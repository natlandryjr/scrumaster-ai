import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { useTranslate } from './translate.jsx';

// Modal Components
const AddStoryModal = ({ onClose }) => {
    const [story, setStory] = useState({
        title: '',
        description: '',
        storyPoints: '',
        assignee: '',
        priority: 'medium',
        epic: ''
    });
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('work_items')
                .insert({
                    title: story.title,
                    description: story.description,
                    story_points: parseInt(story.storyPoints),
                    assignee: story.assignee,
                    priority: story.priority,
                    epic: story.epic,
                    status: 'To Do'
                });

            if (error) throw error;
            onClose();
        } catch (error) {
            console.error('Error adding story:', error);
            alert('Failed to add story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{translate('Add New Story')}</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{translate('Title')}:</label>
                        <input
                            type="text"
                            value={story.title}
                            onChange={(e) => setStory({ ...story, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>{translate('Description')}:</label>
                        <textarea
                            value={story.description}
                            onChange={(e) => setStory({ ...story, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>{translate('Story Points')}:</label>
                        <input
                            type="number"
                            value={story.storyPoints}
                            onChange={(e) => setStory({ ...story, storyPoints: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>{translate('Assignee')}:</label>
                        <input
                            type="text"
                            value={story.assignee}
                            onChange={(e) => setStory({ ...story, assignee: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>{translate('Priority')}:</label>
                        <select
                            value={story.priority}
                            onChange={(e) => setStory({ ...story, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div>
                        <label>{translate('Epic')}:</label>
                        <input
                            type="text"
                            value={story.epic}
                            onChange={(e) => setStory({ ...story, epic: e.target.value })}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            {translate('Cancel')}
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? translate('Adding...') : translate('Add Story')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddRiskModal = ({ onClose }) => {
    const [risk, setRisk] = useState({
        title: '',
        description: '',
        probability: 'medium',
        impact: 'medium',
        mitigation: ''
    });
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('risks')
                .insert({
                    title: risk.title,
                    description: risk.description,
                    probability: risk.probability,
                    impact: risk.impact,
                    mitigation: risk.mitigation,
                    status: 'Open'
                });

            if (error) throw error;
            onClose();
        } catch (error) {
            console.error('Error adding risk:', error);
            alert('Failed to add risk');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{translate('Add New Risk')}</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{translate('Risk Title')}:</label>
                        <input
                            type="text"
                            value={risk.title}
                            onChange={(e) => setRisk({ ...risk, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>{translate('Description')}:</label>
                        <textarea
                            value={risk.description}
                            onChange={(e) => setRisk({ ...risk, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>{translate('Probability')}:</label>
                        <select
                            value={risk.probability}
                            onChange={(e) => setRisk({ ...risk, probability: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label>{translate('Impact')}:</label>
                        <select
                            value={risk.impact}
                            onChange={(e) => setRisk({ ...risk, impact: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label>{translate('Mitigation Strategy')}:</label>
                        <textarea
                            value={risk.mitigation}
                            onChange={(e) => setRisk({ ...risk, mitigation: e.target.value })}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            {translate('Cancel')}
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? translate('Adding...') : translate('Add Risk')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ScrumMasterDashboard = () => {
    const [teamVelocity, setTeamVelocity] = useState(0);
    const [sprints, setSprints] = useState([]);
    const [retrospectives, setRetrospectives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddStoryModal, setShowAddStoryModal] = useState(false);
    const [showAddRiskModal, setShowAddRiskModal] = useState(false);
    const translate = useTranslate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch sprints
                const { data: sprintsData, error: sprintsError } = await supabase
                    .from('sprints')
                    .select('*')
                    .order('start_date', { ascending: false });

                if (sprintsError) throw sprintsError;

                // Fetch work items for velocity calculation
                const { data: workItemsData, error: workItemsError } = await supabase
                    .from('work_items')
                    .select('*');

                if (workItemsError) throw workItemsError;

                // Fetch retrospectives
                const { data: retrosData, error: retrosError } = await supabase
                    .from('retrospectives')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (retrosError) throw retrosError;

                // Calculate team velocity (average completed story points per sprint)
                const completedSprints = sprintsData.filter(sprint => sprint.status === 'Completed');
                let totalVelocity = 0;
                let sprintCount = 0;

                completedSprints.forEach(sprint => {
                    const sprintItems = workItemsData.filter(wi =>
                        wi.sprint_id === sprint.id && wi.status === 'Done'
                    );
                    const sprintPoints = sprintItems.reduce((sum, item) => sum + (item.story_points || 0), 0);
                    totalVelocity += sprintPoints;
                    sprintCount++;
                });

                const averageVelocity = sprintCount > 0 ? (totalVelocity / sprintCount).toFixed(1) : 0;

                setTeamVelocity(averageVelocity);
                setSprints(sprintsData || []);
                setRetrospectives(retrosData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleClose = () => {
        setShowAddStoryModal(false);
    };

    const handleRiskClose = () => {
        setShowAddRiskModal(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="dashboard-container">
                {/* Your existing dashboard content goes here */}
                <h2>{translate('Scrum Master Dashboard')}</h2>
                <p>{translate('Team Velocity')}: {teamVelocity}</p>
                <div>
                    <h3>{translate('Active Sprints')}:</h3>
                    {/* Render sprints here */}
                    {sprints.filter(sprint => sprint.status === 'Active').map(sprint => (
                        <div key={sprint.id} className="sprint-item">
                            <h4>{sprint.name}</h4>
                            <p>{translate('Start Date')}: {sprint.start_date}</p>
                            <p>{translate('End Date')}: {sprint.end_date}</p>
                            <p>{translate('Goal')}: {sprint.goal}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <h3>{translate('Retrospectives')}:</h3>
                    {/* Render retrospectives here */}
                    {retrospectives.slice(0, 5).map(retro => (
                        <div key={retro.id} className="retro-item">
                            <h4>{translate('Sprint')} {retro.sprint_id}</h4>
                            <p>{translate('Keep Doing')}: {retro.keepDoing}</p>
                            <p>{translate('Start Doing')}: {retro.startDoing}</p>
                            <p>{translate('Stop Doing')}: {retro.stopDoing}</p>
                        </div>
                    ))}
                </div>
                {/* Add any other dashboard widgets as needed */}
                <div className="dashboard-actions">
                    <button onClick={() => setShowAddStoryModal(true)}>
                        {translate('Add Story')}
                    </button>
                    <button onClick={() => setShowAddRiskModal(true)}>
                        {translate('Add Risk')}
                    </button>
                </div>
            </div>

            {/* Modal Components */}
            {showAddStoryModal && <AddStoryModal onClose={handleClose} />}
            {showAddRiskModal && <AddRiskModal onClose={handleRiskClose} />}
        </>
    );
};

export default ScrumMasterDashboard; 