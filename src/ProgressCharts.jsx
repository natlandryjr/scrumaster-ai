import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const ProgressCharts = () => {
    const [teams, setTeams] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [workItems, setWorkItems] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedSprint, setSelectedSprint] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');
                const { data: sprintsData, error: sprintsError } = await supabase.from('sprints').select('*');
                const { data: workItemsData, error: workItemsError } = await supabase.from('work_items').select('*');
                if (teamsError) throw teamsError;
                if (sprintsError) throw sprintsError;
                if (workItemsError) throw workItemsError;
                setTeams(teamsData || []);
                setSprints(sprintsData || []);
                setWorkItems(workItemsData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter sprints and work items by selected team/sprint
    const filteredSprints = selectedTeam
        ? sprints.filter(s => s.team_id === selectedTeam)
        : sprints;
    const filteredWorkItems = workItems.filter(wi => {
        if (selectedTeam && wi.team_id !== selectedTeam) return false;
        if (selectedSprint && wi.sprint_id !== selectedSprint) return false;
        return true;
    });

    // Prepare data for charts
    const chartData = filteredSprints
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .map(sprint => {
            const sprintItems = filteredWorkItems.filter(wi => wi.sprint_id === sprint.id);
            const committed = sprintItems.reduce((sum, wi) => sum + (wi.story_points || 0), 0);
            const completed = sprintItems.filter(wi => wi.status === 'Done').reduce((sum, wi) => sum + (wi.story_points || 0), 0);
            return {
                name: sprint.name,
                start_date: sprint.start_date,
                end_date: sprint.end_date,
                committed,
                completed,
            };
        });

    // Burnup data: cumulative completed and total scope
    let cumulativeCompleted = 0;
    let cumulativeScope = 0;
    const burnupData = chartData.map((d) => {
        cumulativeCompleted += d.completed;
        cumulativeScope += d.committed;
        return {
            name: d.name,
            cumulativeCompleted,
            cumulativeScope,
        };
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Progress Charts</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <select value={selectedTeam} onChange={e => { setSelectedTeam(e.target.value); setSelectedSprint(''); }}>
                    <option value="">All Teams</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <select value={selectedSprint} onChange={e => setSelectedSprint(e.target.value)}>
                    <option value="">All Sprints</option>
                    {filteredSprints.map(sprint => (
                        <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                    ))}
                </select>
            </div>
            <div style={{ width: '100%', height: 350, marginBottom: 40 }}>
                <h3>Burndown Chart</h3>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="committed" stroke="#8884d8" name="Committed" />
                        <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div style={{ width: '100%', height: 350 }}>
                <h3>Burnup Chart</h3>
                <ResponsiveContainer>
                    <AreaChart data={burnupData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="cumulativeScope" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total Scope" />
                        <Area type="monotone" dataKey="cumulativeCompleted" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Cumulative Completed" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProgressCharts; 