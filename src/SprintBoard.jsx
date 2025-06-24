import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const SprintBoard = () => {
    const [teams, setTeams] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({}); // teamId: bool

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');
                const { data: sprintsData, error: sprintsError } = await supabase.from('sprints').select('*').order('start_date', { ascending: true });
                if (teamsError) throw teamsError;
                if (sprintsError) throw sprintsError;
                setTeams(teamsData || []);
                setSprints(sprintsData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleExpand = (teamId) => {
        setExpanded(prev => ({ ...prev, [teamId]: !prev[teamId] }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Sprint Board</h2>
            <ul>
                {teams.map(team => {
                    const teamSprints = sprints.filter(sprint => sprint.team_id === team.id);
                    return (
                        <li key={team.id} style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <strong>{team.name}</strong>
                                <button onClick={() => toggleExpand(team.id)}>
                                    {expanded[team.id] ? 'Hide Sprints' : 'Show Sprints'}
                                </button>
                            </div>
                            {expanded[team.id] && teamSprints.length > 0 && (
                                <table border="1" cellPadding="6" style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>Sprint Name</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Committed Points</th>
                                            <th>Completed Points</th>
                                            <th>Velocity (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamSprints.map(sprint => (
                                            <tr key={sprint.id}>
                                                <td>{sprint.name}</td>
                                                <td>{sprint.start_date}</td>
                                                <td>{sprint.end_date}</td>
                                                <td>{sprint.committed_points}</td>
                                                <td>{sprint.completed_points}</td>
                                                <td>
                                                    {sprint.committed_points && sprint.committed_points > 0
                                                        ? `${Math.round((sprint.completed_points / sprint.committed_points) * 100)}%`
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {expanded[team.id] && teamSprints.length === 0 && (
                                <div style={{ marginTop: '1rem' }}>No sprints found for this team.</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SprintBoard; 