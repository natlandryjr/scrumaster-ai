import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const TYPE_ORDER = ['Epic', 'Feature', 'Story', 'Task'];

function buildHierarchy(items) {
    const byId = Object.fromEntries(items.map(item => [item.id, { ...item, children: [] }]));
    const roots = [];
    for (const item of items) {
        if (item.parent_id && byId[item.parent_id]) {
            byId[item.parent_id].children.push(byId[item.id]);
        } else {
            roots.push(byId[item.id]);
        }
    }
    return roots;
}

const WorkItemNode = ({ item, expanded, toggleExpand }) => {
    const hasChildren = item.children && item.children.length > 0;
    return (
        <li style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {hasChildren && (
                    <button onClick={() => toggleExpand(item.id)} style={{ width: 24 }}>
                        {expanded[item.id] ? '-' : '+'}
                    </button>
                )}
                <span><strong>{item.title}</strong> [{item.type}]</span>
                <span>Status: {item.status}</span>
                {item.story_points !== undefined && (
                    <span>Points: {item.story_points}</span>
                )}
            </div>
            {hasChildren && expanded[item.id] && (
                <ul style={{ marginLeft: '2rem' }}>
                    {item.children
                        .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type))
                        .map(child => (
                            <WorkItemNode key={child.id} item={child} expanded={expanded} toggleExpand={toggleExpand} />
                        ))}
                </ul>
            )}
        </li>
    );
};

const WorkItemExplorer = () => {
    const [workItems, setWorkItems] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [filters, setFilters] = useState({ team_id: '', sprint_id: '', status: '' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: workItemsData, error: workItemsError } = await supabase.from('work_items').select('*');
                const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');
                const { data: sprintsData, error: sprintsError } = await supabase.from('sprints').select('*');
                if (workItemsError) throw workItemsError;
                if (teamsError) throw teamsError;
                if (sprintsError) throw sprintsError;
                setWorkItems(workItemsData || []);
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

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFilters({ team_id: '', sprint_id: '', status: '' });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Apply filters
    let filteredItems = workItems;
    if (filters.team_id) filteredItems = filteredItems.filter(item => String(item.team_id) === filters.team_id);
    if (filters.sprint_id) filteredItems = filteredItems.filter(item => String(item.sprint_id) === filters.sprint_id);
    if (filters.status) filteredItems = filteredItems.filter(item => item.status === filters.status);

    // Group roots by type order
    const hierarchy = buildHierarchy(filteredItems);
    const grouped = TYPE_ORDER.map(type => ({
        type,
        items: hierarchy.filter(item => item.type === type)
    }));

    // Collect all unique statuses for the status filter
    const allStatuses = Array.from(new Set(workItems.map(item => item.status).filter(Boolean)));

    return (
        <div>
            <h2>Work Item Explorer</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <select name="team_id" value={filters.team_id} onChange={handleFilterChange}>
                    <option value="">All Teams</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <select name="sprint_id" value={filters.sprint_id} onChange={handleFilterChange}>
                    <option value="">All Sprints</option>
                    {sprints.map(sprint => (
                        <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                    ))}
                </select>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All Statuses</option>
                    {allStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button onClick={handleReset}>Reset</button>
            </div>
            {grouped.map(group => (
                <div key={group.type} style={{ marginBottom: '2rem' }}>
                    <h3>{group.type}s</h3>
                    <ul>
                        {group.items.map(item => (
                            <WorkItemNode key={item.id} item={item} expanded={expanded} toggleExpand={toggleExpand} />
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default WorkItemExplorer; 