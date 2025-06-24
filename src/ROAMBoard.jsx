import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const ROAM_STATUSES = ['Resolved', 'Owned', 'Accepted', 'Mitigated'];

const ROAMBoard = () => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRisk, setNewRisk] = useState({ title: '', description: '', status: ROAM_STATUSES[0] });
    const [editing, setEditing] = useState({}); // riskId: status
    const [updating, setUpdating] = useState({}); // riskId: bool

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error: fetchError } = await supabase.from('risks').select('*');
                if (fetchError) throw fetchError;
                setRisks(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNewRiskChange = (e) => {
        const { name, value } = e.target;
        setNewRisk(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRisk = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.from('risks').insert([newRisk]);
            if (error) throw error;
            setNewRisk({ title: '', description: '', status: ROAM_STATUSES[0] });
            // Refresh risks
            const { data, error: fetchError } = await supabase.from('risks').select('*');
            if (fetchError) throw fetchError;
            setRisks(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (riskId, newStatus) => {
        setEditing(prev => ({ ...prev, [riskId]: newStatus }));
    };

    const handleUpdateStatus = async (riskId) => {
        setUpdating(prev => ({ ...prev, [riskId]: true }));
        setError(null);
        try {
            const { error } = await supabase.from('risks').update({ status: editing[riskId] }).eq('id', riskId);
            if (error) throw error;
            setEditing(prev => {
                const copy = { ...prev };
                delete copy[riskId];
                return copy;
            });
            // Refresh risks
            const { data, error: fetchError } = await supabase.from('risks').select('*');
            if (fetchError) throw fetchError;
            setRisks(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(prev => ({ ...prev, [riskId]: false }));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>ROAM Board</h2>
            <form onSubmit={handleAddRisk} style={{ marginBottom: '2rem' }}>
                <h3>Add New Risk</h3>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newRisk.title}
                    onChange={handleNewRiskChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newRisk.description}
                    onChange={handleNewRiskChange}
                    required
                />
                <select name="status" value={newRisk.status} onChange={handleNewRiskChange}>
                    {ROAM_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button type="submit">Add Risk</button>
            </form>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {ROAM_STATUSES.map(status => (
                    <div key={status} style={{ flex: 1, minWidth: 220 }}>
                        <h3>{status}</h3>
                        <ul>
                            {risks.filter(risk => risk.status === status).map(risk => (
                                <li key={risk.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '0.5rem' }}>
                                    <div><strong>{risk.title}</strong></div>
                                    <div>{risk.description}</div>
                                    <div>
                                        <select
                                            value={editing[risk.id] !== undefined ? editing[risk.id] : risk.status}
                                            onChange={e => handleStatusChange(risk.id, e.target.value)}
                                            disabled={updating[risk.id]}
                                        >
                                            {ROAM_STATUSES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {editing[risk.id] !== undefined && editing[risk.id] !== risk.status && (
                                            <button
                                                onClick={() => handleUpdateStatus(risk.id)}
                                                disabled={updating[risk.id]}
                                                style={{ marginLeft: '0.5rem' }}
                                            >
                                                {updating[risk.id] ? 'Saving...' : 'Save'}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ROAMBoard; 