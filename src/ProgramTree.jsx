import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const ProgramTree = () => {
    const [programs, setPrograms] = useState([]);
    const [arts, setArts] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assigning, setAssigning] = useState({}); // teamId: userId

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: programsData, error: programsError } = await supabase.from('programs').select('*');
                const { data: artsData, error: artsError } = await supabase.from('release_trains').select('*');
                const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');
                const { data: usersData, error: usersError } = await supabase.from('users').select('*');
                if (programsError) throw programsError;
                if (artsError) throw artsError;
                if (teamsError) throw teamsError;
                if (usersError) throw usersError;
                setPrograms(programsData || []);
                setArts(artsData || []);
                setTeams(teamsData || []);
                setUsers(usersData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssignUser = async (teamId) => {
        const userId = assigning[teamId];
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.from('users').update({ team_id: teamId }).eq('id', userId);
            if (error) throw error;
            setAssigning((prev) => ({ ...prev, [teamId]: '' }));
            // Refresh users list
            const { data: usersData, error: usersError } = await supabase.from('users').select('*');
            if (usersError) throw usersError;
            setUsers(usersData || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Program Tree</h2>
            <ul>
                {programs.map(program => (
                    <li key={program.id} style={{ marginBottom: '1rem' }}>
                        <strong>{program.name}</strong>{program.description && `: ${program.description}`}
                        <ul>
                            {arts.filter(art => art.program_id === program.id).map(art => (
                                <li key={art.id} style={{ marginBottom: '0.5rem' }}>
                                    <span>{art.name}</span>{art.description && `: ${art.description}`}
                                    <ul>
                                        {teams.filter(team => team.art_id === art.id).map(team => (
                                            <li key={team.id} style={{ marginBottom: '0.5rem' }}>
                                                <div>
                                                    <strong>{team.name}</strong>{team.description && `: ${team.description}`}
                                                </div>
                                                <div style={{ marginLeft: '1rem' }}>
                                                    <em>Assigned Users:</em>
                                                    <ul>
                                                        {users.filter(user => user.team_id === team.id).map(user => (
                                                            <li key={user.id}>{user.name}</li>
                                                        ))}
                                                    </ul>
                                                    <form
                                                        onSubmit={e => {
                                                            e.preventDefault();
                                                            handleAssignUser(team.id);
                                                        }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                    >
                                                        <select
                                                            value={assigning[team.id] || ''}
                                                            onChange={e => setAssigning(prev => ({ ...prev, [team.id]: e.target.value }))}
                                                        >
                                                            <option value=''>Assign user...</option>
                                                            {users.filter(user => !user.team_id || user.team_id !== team.id).map(user => (
                                                                <option key={user.id} value={user.id}>{user.name}</option>
                                                            ))}
                                                        </select>
                                                        <button type="submit" disabled={!assigning[team.id]}>Assign</button>
                                                    </form>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProgramTree; 