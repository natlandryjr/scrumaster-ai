import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import {
    FaTachometerAlt,
    FaUsers,
    FaExclamationTriangle,
    FaChartLine,
    FaComments,
    FaCalendarAlt,
    FaRocket,
    FaEye,
    FaClock,
    FaCheckCircle,
    FaSpinner,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import './dashboard.css';

// Inline styles as fallback
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f7fafd',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
    },
    sidebar: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '256px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 40,
        transform: 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
    },
    sidebarOpen: {
        transform: 'translateX(0)'
    },
    sidebarDesktop: {
        position: 'static',
        transform: 'none'
    },
    mainContent: {
        marginLeft: '0',
        transition: 'margin-left 0.3s ease-in-out'
    },
    mainContentDesktop: {
        marginLeft: '256px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '1.5rem'
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        transition: 'all 0.2s ease'
    },
    statCardHover: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-1px)'
    },
    button: {
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    },
    buttonHover: {
        backgroundColor: '#1d4ed8'
    },
    loadingContainer: {
        minHeight: '100vh',
        backgroundColor: '#f7fafd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorContainer: {
        minHeight: '100vh',
        backgroundColor: '#f7fafd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorCard: {
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        maxWidth: '28rem'
    }
};

const RoleDashboard = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchUserAndData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch user
                const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();
                if (userError) throw userError;
                setUser(userData);

                // Get the primary role from the roles array
                const primaryRole = userData.roles && userData.roles.length > 0 ? userData.roles[0] : 'ScrumMaster';

                // Fetch data based on role
                let dashboardData = {};
                if (primaryRole === 'ScrumMaster') {
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
                } else if (primaryRole === 'ProductOwner') {
                    // Backlog items, priority features, recent completions
                    const { data: backlog } = await supabase.from('work_items').select('*').eq('team_id', userData.team_id).eq('status', 'Backlog');
                    const { data: features } = await supabase.from('work_items').select('*').eq('team_id', userData.team_id).eq('type', 'Feature').order('priority', { ascending: true });
                    const { data: recent } = await supabase.from('work_items').select('*').eq('team_id', userData.team_id).eq('status', 'Done').order('updated_at', { ascending: false }).limit(5);
                    dashboardData = { backlog, features, recent };
                } else if (primaryRole === 'RTE') {
                    // PI dashboard, ROAM risks, ART progress
                    const { data: pis } = await supabase.from('program_increments').select('*');
                    const { data: risks } = await supabase.from('risks').select('*');
                    const { data: arts } = await supabase.from('release_trains').select('*');
                    dashboardData = { pis, risks, arts };
                } else if (primaryRole === 'Sponsor') {
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

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{ textAlign: 'center' }}>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '2rem', color: '#2563eb', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#6b7280' }}>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorCard}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaExclamationTriangle style={{ color: '#ef4444', fontSize: '1.25rem', marginRight: '0.75rem' }} />
                        <h3 style={{ color: '#991b1b', fontWeight: '500' }}>Error Loading Dashboard</h3>
                    </div>
                    <p style={{ color: '#dc2626', marginTop: '0.5rem' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{ textAlign: 'center' }}>
                    <FaUsers style={{ fontSize: '2rem', color: '#9ca3af', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#6b7280' }}>No user found.</p>
                </div>
            </div>
        );
    }

    // Get the primary role from the roles array
    const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'ScrumMaster';

    // Navigation items
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
        { id: 'team', label: 'Team', icon: FaUsers },
        { id: 'risks', label: 'Risks', icon: FaExclamationTriangle },
        { id: 'metrics', label: 'Metrics', icon: FaChartLine },
        { id: 'retrospectives', label: 'Retrospectives', icon: FaComments }
    ];

    // Render Scrum Master Dashboard
    if (primaryRole === 'ScrumMaster') {
        return (
            <div style={styles.container}>
                {/* Mobile Sidebar Toggle */}
                <div style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50, display: 'block' }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            backgroundColor: 'white',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {sidebarOpen ? <FaTimes style={{ color: '#6b7280' }} /> : <FaBars style={{ color: '#6b7280' }} />}
                    </button>
                </div>

                {/* Sidebar */}
                <div style={{
                    ...styles.sidebar,
                    ...(sidebarOpen ? styles.sidebarOpen : {}),
                    ...(window.innerWidth >= 1024 ? styles.sidebarDesktop : {})
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaRocket style={{ color: '#2563eb', fontSize: '1.5rem', marginRight: '0.75rem' }} />
                                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>ScrumMaster AI</h1>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                Welcome back, {user.full_name || user.email}
                            </p>
                        </div>

                        {/* Navigation */}
                        <nav style={{ flex: 1, padding: '1rem' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                                            <button
                                                onClick={() => setActiveTab(item.id)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    backgroundColor: activeTab === item.id ? '#dbeafe' : 'transparent',
                                                    color: activeTab === item.id ? '#1d4ed8' : '#6b7280',
                                                    borderRight: activeTab === item.id ? '2px solid #1d4ed8' : 'none'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (activeTab !== item.id) {
                                                        e.target.style.backgroundColor = '#f3f4f6';
                                                        e.target.style.color = '#374151';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (activeTab !== item.id) {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.color = '#6b7280';
                                                    }
                                                }}
                                            >
                                                <Icon style={{ marginRight: '0.75rem', fontSize: '1.125rem' }} />
                                                {item.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* User Info */}
                        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '2rem',
                                    height: '2rem',
                                    backgroundColor: '#2563eb',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ marginLeft: '0.75rem' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                        {user.full_name || 'User'}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{primaryRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{
                    ...styles.mainContent,
                    ...(window.innerWidth >= 1024 ? styles.mainContentDesktop : {})
                }}>
                    {/* Top Header */}
                    <header style={{
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <div style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                                        Scrum Master Dashboard
                                    </h1>
                                    <p style={{ color: '#6b7280' }}>
                                        Manage your team's agile process and track progress
                                    </p>
                                </div>
                                <div style={{ display: 'none' }}>
                                    <button style={{
                                        ...styles.button,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                                        New Sprint
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <main style={{ padding: '1.5rem' }}>
                        {activeTab === 'dashboard' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Stats Cards */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    {/* Team Velocity Card */}
                                    <div style={styles.statCard}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                                                    Team Velocity
                                                </p>
                                                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>
                                                    {data.velocity || 0}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    story points/sprint
                                                </p>
                                            </div>
                                            <div style={{
                                                width: '4rem',
                                                height: '4rem',
                                                backgroundColor: '#dbeafe',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FaRocket style={{ color: '#2563eb', fontSize: '1.5rem' }} />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                                                <FaChartLine style={{ marginRight: '0.5rem' }} />
                                                <span>Based on last 3 sprints</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Sprints Count */}
                                    <div style={styles.statCard}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                                                    Active Sprints
                                                </p>
                                                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>
                                                    {data.sprints?.length || 0}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    currently running
                                                </p>
                                            </div>
                                            <div style={{
                                                width: '4rem',
                                                height: '4rem',
                                                backgroundColor: '#dcfce7',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FaClock style={{ color: '#16a34a', fontSize: '1.5rem' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Retrospectives Count */}
                                    <div style={styles.statCard}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                                                    Retrospectives
                                                </p>
                                                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>
                                                    {data.retros?.length || 0}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    completed
                                                </p>
                                            </div>
                                            <div style={{
                                                width: '4rem',
                                                height: '4rem',
                                                backgroundColor: '#f3e8ff',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FaComments style={{ color: '#9333ea', fontSize: '1.5rem' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Sprints Section */}
                                <div style={styles.card}>
                                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center' }}>
                                            <FaCalendarAlt style={{ marginRight: '0.75rem', color: '#2563eb' }} />
                                            Active Sprints
                                        </h2>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        {data.sprints && data.sprints.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {data.sprints.map((sprint) => (
                                                    <div key={sprint.id} style={{
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        transition: 'box-shadow 0.2s ease'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div>
                                                                <h3 style={{ fontWeight: '500', color: '#111827' }}>{sprint.name}</h3>
                                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                                    {sprint.start_date} - {sprint.end_date}
                                                                </p>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                                                        {data.workItems?.filter(wi => wi.sprint_id === sprint.id).length || 0}
                                                                    </p>
                                                                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>stories</p>
                                                                </div>
                                                                <div style={{
                                                                    width: '0.75rem',
                                                                    height: '0.75rem',
                                                                    backgroundColor: '#16a34a',
                                                                    borderRadius: '50%'
                                                                }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                <FaCalendarAlt style={{ color: '#9ca3af', fontSize: '2rem', margin: '0 auto 1rem' }} />
                                                <p style={{ color: '#6b7280' }}>No active sprints</p>
                                                <button style={{
                                                    ...styles.button,
                                                    marginTop: '1rem'
                                                }}>
                                                    Create Sprint
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Retrospectives Section */}
                                <div style={styles.card}>
                                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center' }}>
                                            <FaComments style={{ marginRight: '0.75rem', color: '#9333ea' }} />
                                            Recent Retrospectives
                                        </h2>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        {data.retros && data.retros.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '24rem', overflowY: 'auto' }}>
                                                {data.retros.map((retro) => (
                                                    <div key={retro.id} style={{
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        transition: 'box-shadow 0.2s ease'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                                    <h3 style={{ fontWeight: '500', color: '#111827' }}>
                                                                        Sprint {retro.sprint_id}
                                                                    </h3>
                                                                    <span style={{
                                                                        marginLeft: '0.5rem',
                                                                        padding: '0.25rem 0.5rem',
                                                                        backgroundColor: '#dcfce7',
                                                                        color: '#166534',
                                                                        fontSize: '0.75rem',
                                                                        borderRadius: '9999px'
                                                                    }}>
                                                                        Completed
                                                                    </span>
                                                                </div>
                                                                <div style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                                    gap: '1rem',
                                                                    fontSize: '0.875rem'
                                                                }}>
                                                                    <div>
                                                                        <p style={{ fontWeight: '500', color: '#374151' }}>Keep Doing</p>
                                                                        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                                                                            {retro.keepDoing || 'No items'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p style={{ fontWeight: '500', color: '#374151' }}>Start Doing</p>
                                                                        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                                                                            {retro.startDoing || 'No items'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p style={{ fontWeight: '500', color: '#374151' }}>Stop Doing</p>
                                                                        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                                                                            {retro.stopDoing || 'No items'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button style={{
                                                                ...styles.button,
                                                                marginLeft: '1rem',
                                                                fontSize: '0.875rem',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}>
                                                                <FaEye style={{ marginRight: '0.25rem' }} />
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                <FaComments style={{ color: '#9ca3af', fontSize: '2rem', margin: '0 auto 1rem' }} />
                                                <p style={{ color: '#6b7280' }}>No retrospectives yet</p>
                                                <button style={{
                                                    ...styles.button,
                                                    marginTop: '1rem',
                                                    backgroundColor: '#9333ea'
                                                }}>
                                                    Schedule Retrospective
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other tabs can be implemented here */}
                        {activeTab !== 'dashboard' && (
                            <div style={styles.card}>
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                                        {navItems.find(item => item.id === activeTab)?.label}
                                    </h2>
                                    <p style={{ color: '#6b7280' }}>This section is coming soon!</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 30
                        }}
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
            </div>
        );
    }

    // Render other role dashboards (simplified for now)
    if (primaryRole === 'ProductOwner') {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Product Owner Dashboard</h2>
                    <p style={{ color: '#6b7280' }}>Product Owner dashboard coming soon!</p>
                </div>
            </div>
        );
    }
    if (primaryRole === 'RTE') {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Release Train Engineer Dashboard</h2>
                    <p style={{ color: '#6b7280' }}>RTE dashboard coming soon!</p>
                </div>
            </div>
        );
    }
    if (primaryRole === 'Sponsor') {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Sponsor Dashboard</h2>
                    <p style={{ color: '#6b7280' }}>Sponsor dashboard coming soon!</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.loadingContainer}>
            <div style={styles.card}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Unknown Role</h2>
                <p style={{ color: '#6b7280' }}>Role: {primaryRole}</p>
            </div>
        </div>
    );
};

export default RoleDashboard; 