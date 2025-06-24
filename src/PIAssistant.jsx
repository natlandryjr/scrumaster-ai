import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

// Placeholder for AI endpoint call
const generatePIPlanAI = async (themes, objectives, epics) => {
    // Simulate AI response
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                artGoals: ['Deliver MVP for Theme 1', 'Reduce risk for Theme 2'],
                featureGroupings: [
                    { group: 'Customer Experience', features: ['Epic 1', 'Epic 2'] },
                    { group: 'Platform', features: ['Epic 3'] }
                ],
                riskFlags: ['Epic 2 has high dependency risk', 'Epic 3 lacks clear owner']
            });
        }, 1500);
    });
};

const PIAssistant = () => {
    const [themes, setThemes] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [epics, setEpics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiPlan, setAiPlan] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: themesData, error: themesError } = await supabase.from('strategic_themes').select('*');
                const { data: objectivesData, error: objectivesError } = await supabase.from('objectives').select('*');
                const { data: epicsData, error: epicsError } = await supabase.from('work_items').select('*').eq('type', 'Epic').is('parent_id', null);
                if (themesError) throw themesError;
                if (objectivesError) throw objectivesError;
                if (epicsError) throw epicsError;
                setThemes(themesData || []);
                setObjectives(objectivesData || []);
                setEpics(epicsData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGeneratePIPlan = async () => {
        setAiLoading(true);
        setAiPlan(null);
        setSaveStatus('');
        try {
            const plan = await generatePIPlanAI(themes, objectives, epics);
            setAiPlan(plan);
        } catch (err) {
            setAiPlan({ error: 'Failed to generate plan.' });
        } finally {
            setAiLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        setSaveStatus('Saving...');
        try {
            const { error } = await supabase.from('program_increments').insert([
                {
                    name: 'Draft PI Plan',
                    status: 'Draft',
                    ai_plan: aiPlan,
                    created_at: new Date().toISOString(),
                }
            ]);
            if (error) throw error;
            setSaveStatus('Draft saved!');
        } catch (err) {
            setSaveStatus('Failed to save draft.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>PI Assistant</h2>
            <button onClick={handleGeneratePIPlan} disabled={aiLoading} style={{ marginBottom: '1rem' }}>
                {aiLoading ? 'Generating...' : 'Generate PI Plan'}
            </button>
            {aiPlan && !aiPlan.error && (
                <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }}>
                    <h3>AI-Generated PI Plan</h3>
                    <div>
                        <strong>ART-level Goals:</strong>
                        <ul>
                            {aiPlan.artGoals.map((goal, i) => <li key={i}>{goal}</li>)}
                        </ul>
                    </div>
                    <div>
                        <strong>Feature Groupings:</strong>
                        <ul>
                            {aiPlan.featureGroupings.map((fg, i) => (
                                <li key={i}><strong>{fg.group}:</strong> {fg.features.join(', ')}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Risk Flags:</strong>
                        <ul>
                            {aiPlan.riskFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                        </ul>
                    </div>
                    <button onClick={handleSaveDraft} style={{ marginTop: '1rem' }}>Save as Draft PI</button>
                    {saveStatus && <div style={{ marginTop: '0.5rem' }}>{saveStatus}</div>}
                </div>
            )}
            {aiPlan && aiPlan.error && <div style={{ color: 'red' }}>{aiPlan.error}</div>}
        </div>
    );
};

export default PIAssistant; 