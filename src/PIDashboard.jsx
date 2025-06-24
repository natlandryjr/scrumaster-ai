import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const PIDashboard = () => {
    const [pis, setPIs] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState({}); // piId: bool
    const [votes, setVotes] = useState({}); // piId: value

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: piData, error: piError } = await supabase.from('program_increments').select('*');
                const { data: objData, error: objError } = await supabase.from('objectives').select('*');
                if (piError) throw piError;
                if (objError) throw objError;
                setPIs(piData || []);
                setObjectives(objData || []);
                setVotes(Object.fromEntries((piData || []).map(pi => [pi.id, pi.confidence_vote || ''])));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleVoteChange = (piId, value) => {
        setVotes(prev => ({ ...prev, [piId]: value }));
    };

    const handleVoteSubmit = async (piId) => {
        setUpdating(prev => ({ ...prev, [piId]: true }));
        setError(null);
        try {
            const { error } = await supabase.from('program_increments').update({ confidence_vote: votes[piId] }).eq('id', piId);
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(prev => ({ ...prev, [piId]: false }));
        }
    };

    const handleToggleInspect = async (piId, current) => {
        setUpdating(prev => ({ ...prev, [piId]: true }));
        setError(null);
        try {
            const { error } = await supabase.from('program_increments').update({ inspect_and_adapt_complete: !current }).eq('id', piId);
            if (error) throw error;
            setPIs(pis => pis.map(pi => pi.id === piId ? { ...pi, inspect_and_adapt_complete: !current } : pi));
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(prev => ({ ...prev, [piId]: false }));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Program Increment Dashboard</h2>
            <ul>
                {pis.map(pi => (
                    <li key={pi.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
                        <div><strong>PI Name:</strong> {pi.name}</div>
                        <div><strong>Start:</strong> {pi.start_date} <strong>End:</strong> {pi.end_date}</div>
                        <div style={{ margin: '0.5rem 0' }}>
                            <strong>Objectives:</strong>
                            <ul>
                                {objectives.filter(obj => obj.pi_id === pi.id).map(obj => (
                                    <li key={obj.id}>{obj.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Confidence Vote:</strong>
                            <select
                                value={votes[pi.id] || ''}
                                onChange={e => handleVoteChange(pi.id, e.target.value)}
                                disabled={updating[pi.id]}
                                style={{ marginLeft: '0.5rem' }}
                            >
                                <option value="">Select</option>
                                {[1, 2, 3, 4, 5].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => handleVoteSubmit(pi.id)}
                                disabled={updating[pi.id] || !votes[pi.id]}
                                style={{ marginLeft: '0.5rem' }}
                            >
                                {updating[pi.id] ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <strong>Inspect & Adapt Complete:</strong>
                            <input
                                type="checkbox"
                                checked={!!pi.inspect_and_adapt_complete}
                                onChange={() => handleToggleInspect(pi.id, pi.inspect_and_adapt_complete)}
                                disabled={updating[pi.id]}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PIDashboard; 