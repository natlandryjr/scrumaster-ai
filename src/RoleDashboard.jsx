import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const RoleDashboard = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchUserAndData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch user
                const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();
                if (userError) throw userError;
                setUser(userData);
                // Fetch data based on role
                let dashboardData = {};
                if (userData.role === 'ScrumMaster') {
                    // Team velocity, active sprints, retrospectives
                    const { data: sprints } = await supabase.from('sprints').select('*').eq('team_id', userData.team_id);
                    const { data: workItems } = await supabase.from('work_items').select('*').eq('team_id', userData.team_id);
                    const { data: retros } = await supabase.from('retrospectives').select('*').eq('team_id', userData.team_id);
                    // Calculate velocity (average completed story points per sprint)
                    const velocity = sprints && sprints.length > 0
                        ? (sprints.reduce((sum, sprint) => {
                            const completed = workItems.filter(wi => wi.sprint_id === sprint.id && wi.status === 'Done').reduce((s, wi) => s + (wi.story_points || 0), 0);
                            return sum + completed;
                        }, 0) / sprints.length).toFixed(1)
                        : 0;
                    dashboardData = { velocity, sprints, retros };
                } else if (userData.role === 'ProductOwner') {
                    // Backlog items, priority features, recent completions
                    const { data: backlog } = await supabase.from('work_items').select('*').eq('team_id', userData.team_id).eq('status', 'Backlog');
                    const { data: features } = await supabase.from('work_items').select('*').eq('team_id', userData.team_id).eq('type', 'Feature').order('priority', { ascending: true });
                    const { data: recent } = await supabase.from('work_items').select('*').eq('team_id', userData.team_id).eq('status', 'Done').order('updated_at', { ascending: false }).limit(5);
                    dashboardData = { backlog, features, recent };
                } else if (userData.role === 'RTE') {
                    // PI dashboard, ROAM risks, ART progress
                    const { data: pis } = await supabase.from('program_increments').select('*');
                    const { data: risks } = await supabase.from('risks').select('*');
                    const { data: arts } = await supabase.from('release_trains').select('*');
                    dashboardData = { pis, risks, arts };
                } else if (userData.role === 'Sponsor') {
                    // Strategic themes, objectives, key PI metrics
                    const { data: themes } = await supabase.from('strategic_themes').select('*');
                    const { data: objectives } = await supabase.from('objectives').select('*');
                    const { data: pis } = await supabase.from('program_increments').select('*');
                    dashboardData = { themes, objectives, pis };
                }
                setData(dashboardData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchUserAndData();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found.</div>;

    // Render dashboards by role
    if (user.role === 'ScrumMaster') {
        return (
            <div>
                <h2>Scrum Master Dashboard</h2>
                <div><strong>Team Velocity:</strong> {data.velocity}</div>
                <div style={{ marginTop: '1rem' }}>
                    <strong>Active Sprints:</strong>
                    <ul>
                        {data.sprints && data.sprints.map(sprint => (
                            <li key={sprint.id}>{sprint.name} ({sprint.start_date} - {sprint.end_date})</li>
                        ))}
                    </ul>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <strong>Retrospectives:</strong>
                    <ul>
                        {data.retros && data.retros.map(retro => (
                            <li key={retro.id}>{retro.sprint_id}: {retro.keepDoing} / {retro.startDoing} / {retro.stopDoing}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    if (user.role === 'ProductOwner') {
        return (
            <div>
                <h2>Product Owner Dashboard</h2>
                <div><strong>Backlog Items:</strong>
                    <ul>
                        {data.backlog && data.backlog.map(item => (
                            <li key={item.id}>{item.title}</li>
                        ))}
                    </ul>
                </div>
                <div><strong>Priority Features:</strong>
                    <ul>
                        {data.features && data.features.map(item => (
                            <li key={item.id}>{item.title} (Priority: {item.priority})</li>
                        ))}
                    </ul>
                </div>
                <div><strong>Recent Completions:</strong>
                    <ul>
                        {data.recent && data.recent.map(item => (
                            <li key={item.id}>{item.title} (Completed: {item.updated_at})</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    if (user.role === 'RTE') {
        return (
            <div>
                <h2>Release Train Engineer Dashboard</h2>
                <div><strong>PI Dashboard:</strong>
                    <ul>
                        {data.pis && data.pis.map(pi => (
                            <li key={pi.id}>{pi.name} ({pi.start_date} - {pi.end_date})</li>
                        ))}
                    </ul>
                </div>
                <div><strong>ROAM Risks:</strong>
                    <ul>
                        {data.risks && data.risks.map(risk => (
                            <li key={risk.id}>{risk.title} ({risk.status})</li>
                        ))}
                    </ul>
                </div>
                <div><strong>ART Progress:</strong>
                    <ul>
                        {data.arts && data.arts.map(art => (
                            <li key={art.id}>{art.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    if (user.role === 'Sponsor') {
        return (
            <div>
                <h2>Sponsor Dashboard</h2>
                <div><strong>Strategic Themes:</strong>
                    <ul>
                        {data.themes && data.themes.map(theme => (
                            <li key={theme.id}>{theme.title}</li>
                        ))}
                    </ul>
                </div>
                <div><strong>Objectives:</strong>
                    <ul>
                        {data.objectives && data.objectives.map(obj => (
                            <li key={obj.id}>{obj.title}</li>
                        ))}
                    </ul>
                </div>
                <div><strong>Key PI Metrics:</strong>
                    <ul>
                        {data.pis && data.pis.map(pi => (
                            <li key={pi.id}>{pi.name} (Confidence: {pi.confidence_vote}, Inspect & Adapt: {pi.inspect_and_adapt_complete ? 'Yes' : 'No'})</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    return <div>Unknown role.</div>;
};

export default RoleDashboard; 