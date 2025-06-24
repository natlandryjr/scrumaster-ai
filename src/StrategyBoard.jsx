import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const StrategyBoard = () => {
    const [themes, setThemes] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state for adding a new theme
    const [newTheme, setNewTheme] = useState({ title: '', description: '' });
    // Form state for editing a theme
    const [editingTheme, setEditingTheme] = useState(null);
    const [editingThemeData, setEditingThemeData] = useState({ title: '', description: '' });
    // Form state for adding objectives per theme
    const [newObjectives, setNewObjectives] = useState({});
    // Form state for editing objectives
    const [editingObjective, setEditingObjective] = useState(null);
    const [editingObjectiveData, setEditingObjectiveData] = useState({ title: '', description: '', target_kpi: '' });

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: themesData, error: themesError } = await supabase.from('strategic_themes').select('*');
            const { data: objectivesData, error: objectivesError } = await supabase.from('objectives').select('*');
            if (themesError) throw themesError;
            if (objectivesError) throw objectivesError;
            setThemes(themesData || []);
            setObjectives(objectivesData || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Add new theme
    const handleAddTheme = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { title, description } = newTheme;
        try {
            const { error } = await supabase.from('strategic_themes').insert([{ title, description }]);
            if (error) throw error;
            setNewTheme({ title: '', description: '' });
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Edit theme
    const handleEditTheme = (theme) => {
        setEditingTheme(theme.id);
        setEditingThemeData({ title: theme.title, description: theme.description });
    };

    const handleUpdateTheme = async (e, themeId) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.from('strategic_themes').update(editingThemeData).eq('id', themeId);
            if (error) throw error;
            setEditingTheme(null);
            setEditingThemeData({ title: '', description: '' });
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Add new objective
    const handleAddObjective = async (e, themeId) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { title, description, target_kpi } = newObjectives[themeId] || {};
        try {
            const { error } = await supabase.from('objectives').insert([{ title, description, target_kpi, theme_id: themeId }]);
            if (error) throw error;
            setNewObjectives((prev) => ({ ...prev, [themeId]: { title: '', description: '', target_kpi: '' } }));
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    // Edit objective
    const handleEditObjective = (objective) => {
        setEditingObjective(objective.id);
        setEditingObjectiveData({ title: objective.title, description: objective.description, target_kpi: objective.target_kpi });
    };

    const handleUpdateObjective = async (e, objectiveId) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.from('objectives').update(editingObjectiveData).eq('id', objectiveId);
            if (error) throw error;
            setEditingObjective(null);
            setEditingObjectiveData({ title: '', description: '', target_kpi: '' });
            await fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Strategy Board</h2>
            <form onSubmit={handleAddTheme} style={{ marginBottom: '2rem' }}>
                <h3>Add Strategic Theme</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTheme.title}
                    onChange={e => setNewTheme({ ...newTheme, title: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTheme.description}
                    onChange={e => setNewTheme({ ...newTheme, description: e.target.value })}
                    required
                />
                <button type="submit">Add Theme</button>
            </form>
            {themes.map(theme => (
                <div key={theme.id} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
                    {editingTheme === theme.id ? (
                        <form onSubmit={e => handleUpdateTheme(e, theme.id)}>
                            <input
                                type="text"
                                value={editingThemeData.title}
                                onChange={e => setEditingThemeData({ ...editingThemeData, title: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                value={editingThemeData.description}
                                onChange={e => setEditingThemeData({ ...editingThemeData, description: e.target.value })}
                                required
                            />
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setEditingTheme(null)}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <h3>{theme.title}</h3>
                            <p>{theme.description}</p>
                            <button onClick={() => handleEditTheme(theme)}>Edit Theme</button>
                        </>
                    )}
                    <ul>
                        {objectives.filter(obj => obj.theme_id === theme.id).map(obj => (
                            <li key={obj.id}>
                                {editingObjective === obj.id ? (
                                    <form onSubmit={e => handleUpdateObjective(e, obj.id)}>
                                        <input
                                            type="text"
                                            value={editingObjectiveData.title}
                                            onChange={e => setEditingObjectiveData({ ...editingObjectiveData, title: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={editingObjectiveData.description}
                                            onChange={e => setEditingObjectiveData({ ...editingObjectiveData, description: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={editingObjectiveData.target_kpi}
                                            onChange={e => setEditingObjectiveData({ ...editingObjectiveData, target_kpi: e.target.value })}
                                            required
                                        />
                                        <button type="submit">Save</button>
                                        <button type="button" onClick={() => setEditingObjective(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <strong>{obj.title}</strong>: {obj.description} (KPI: {obj.target_kpi})
                                        <button onClick={() => handleEditObjective(obj)} style={{ marginLeft: '1rem' }}>Edit</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={e => handleAddObjective(e, theme.id)} style={{ marginTop: '1rem' }}>
                        <h4>Add Objective</h4>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newObjectives[theme.id]?.title || ''}
                            onChange={e => setNewObjectives(prev => ({ ...prev, [theme.id]: { ...prev[theme.id], title: e.target.value } }))}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newObjectives[theme.id]?.description || ''}
                            onChange={e => setNewObjectives(prev => ({ ...prev, [theme.id]: { ...prev[theme.id], description: e.target.value } }))}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Target KPI"
                            value={newObjectives[theme.id]?.target_kpi || ''}
                            onChange={e => setNewObjectives(prev => ({ ...prev, [theme.id]: { ...prev[theme.id], target_kpi: e.target.value } }))}
                            required
                        />
                        <button type="submit">Add Objective</button>
                    </form>
                </div>
            ))}
        </div>
    );
};

export default StrategyBoard; 