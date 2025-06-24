import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const fetchAISuggestion = async ({ keepDoing, startDoing, stopDoing }) => {
    // Placeholder: Replace with your Supabase Edge Function or OpenAI API call
    // Example: POST to /api/ai-suggestion with feedback fields
    // Here, we'll just return a dummy suggestion after a short delay
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`AI Suggestion: Consider focusing more on "${startDoing}" and less on "${stopDoing}" while maintaining "${keepDoing}".`);
        }, 1200);
    });
};

const RetroBoard = () => {
    const [teams, setTeams] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [retros, setRetros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({}); // key: teamId-sprintId
    const [modalOpen, setModalOpen] = useState(false);
    const [newRetro, setNewRetro] = useState({ team_id: '', sprint_id: '', keepDoing: '', startDoing: '', stopDoing: '', ai_insights: '' });
    const [aiSuggestions, setAiSuggestions] = useState({}); // key: teamId-sprintId -> suggestion
    const [aiLoading, setAiLoading] = useState({}); // key: teamId-sprintId -> bool

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');
                const { data: sprintsData, error: sprintsError } = await supabase.from('sprints').select('*');
                const { data: retrosData, error: retrosError } = await supabase.from('retrospectives').select('*');
                if (teamsError) throw teamsError;
                if (sprintsError) throw sprintsError;
                if (retrosError) throw retrosError;
                setTeams(teamsData || []);
                setSprints(sprintsData || []);
                setRetros(retrosData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleExpand = (teamId, sprintId) => {
        const key = `${teamId}-${sprintId}`;
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setNewRetro({ team_id: '', sprint_id: '', keepDoing: '', startDoing: '', stopDoing: '', ai_insights: '' });
    };

    const handleNewRetroChange = (e) => {
        const { name, value } = e.target;
        setNewRetro(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRetro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.from('retrospectives').insert([newRetro]);
            if (error) throw error;
            closeModal();
            // Refresh retros
            const { data: retrosData, error: retrosError } = await supabase.from('retrospectives').select('*');
            if (retrosError) throw retrosError;
            setRetros(retrosData || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGetAISuggestion = async (retro, key) => {
        setAiLoading(prev => ({ ...prev, [key]: true }));
        setAiSuggestions(prev => ({ ...prev, [key]: '' }));
        try {
            const suggestion = await fetchAISuggestion({
                keepDoing: retro.keepDoing,
                startDoing: retro.startDoing,
                stopDoing: retro.stopDoing,
            });
            setAiSuggestions(prev => ({ ...prev, [key]: suggestion }));
        } catch (err) {
            setAiSuggestions(prev => ({ ...prev, [key]: 'Failed to get AI suggestion.' }));
        } finally {
            setAiLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Group retros by team and sprint
    const retrosByTeamSprint = {};
    retros.forEach(retro => {
        const key = `${retro.team_id}-${retro.sprint_id}`;
        retrosByTeamSprint[key] = retro;
    });

    return (
        <div>
            <h2>Retro Board</h2>
            <button onClick={openModal} style={{ marginBottom: '1rem' }}>Add Retrospective</button>
            {teams.map(team => (
                <div key={team.id} style={{ marginBottom: '2rem' }}>
                    <h3>{team.name}</h3>
                    <ul>
                        {sprints.map(sprint => {
                            const key = `${team.id}-${sprint.id}`;
                            const retro = retrosByTeamSprint[key];
                            return (
                                <li key={sprint.id} style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <strong>{sprint.name}</strong>
                                        <button onClick={() => toggleExpand(team.id, sprint.id)}>
                                            {expanded[key] ? 'Hide' : 'Show'} Feedback
                                        </button>
                                    </div>
                                    {expanded[key] && retro && (
                                        <div style={{ marginLeft: '2rem', marginTop: '0.5rem', border: '1px solid #ccc', padding: '1rem' }}>
                                            <div><strong>Keep Doing:</strong> {retro.keepDoing}</div>
                                            <div><strong>Start Doing:</strong> {retro.startDoing}</div>
                                            <div><strong>Stop Doing:</strong> {retro.stopDoing}</div>
                                            <div><strong>AI Insights:</strong> {retro.ai_insights}</div>
                                            <button
                                                style={{ marginTop: '1rem' }}
                                                onClick={() => handleGetAISuggestion(retro, key)}
                                                disabled={aiLoading[key]}
                                            >
                                                {aiLoading[key] ? 'Getting AI Suggestions...' : 'Get AI Suggestions'}
                                            </button>
                                            {aiSuggestions[key] && (
                                                <div style={{ marginTop: '0.5rem', color: '#2a7' }}>
                                                    <strong>AI Suggestion:</strong> {aiSuggestions[key]}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {expanded[key] && !retro && (
                                        <div style={{ marginLeft: '2rem', marginTop: '0.5rem', color: '#888' }}>No feedback for this sprint.</div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '320px' }}>
                        <h3>Add Retrospective</h3>
                        <form onSubmit={handleAddRetro}>
                            <div>
                                <label>Team:</label>
                                <select name="team_id" value={newRetro.team_id} onChange={handleNewRetroChange} required>
                                    <option value="">Select team</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Sprint:</label>
                                <select name="sprint_id" value={newRetro.sprint_id} onChange={handleNewRetroChange} required>
                                    <option value="">Select sprint</option>
                                    {sprints.map(sprint => (
                                        <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Keep Doing:</label>
                                <textarea name="keepDoing" value={newRetro.keepDoing} onChange={handleNewRetroChange} required />
                            </div>
                            <div>
                                <label>Start Doing:</label>
                                <textarea name="startDoing" value={newRetro.startDoing} onChange={handleNewRetroChange} required />
                            </div>
                            <div>
                                <label>Stop Doing:</label>
                                <textarea name="stopDoing" value={newRetro.stopDoing} onChange={handleNewRetroChange} required />
                            </div>
                            <div>
                                <label>AI Insights:</label>
                                <textarea name="ai_insights" value={newRetro.ai_insights} onChange={handleNewRetroChange} />
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <button type="submit">Add</button>
                                <button type="button" onClick={closeModal} style={{ marginLeft: '1rem' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RetroBoard; 