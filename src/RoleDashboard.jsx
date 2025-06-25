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
    FaTimes,
    FaSignOutAlt,
    FaCog,
    FaBell,
    FaSun,
    FaMoon,
    FaList,
    FaFilter,
    FaPlus
} from 'react-icons/fa';
import { useTranslate } from './translate.jsx';

// Theme-aware styles
const getStyles = (isDarkMode) => ({
    container: {
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#111827' : '#f7fafd',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        display: 'flex',
        color: isDarkMode ? '#f9fafb' : '#111827'
    },
    sidebar: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '280px',
        backgroundColor: isDarkMode ? '#1f2937' : 'white',
        boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 40,
        transform: 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        overflowY: 'auto',
        borderRight: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb'
    },
    sidebarOpen: {
        transform: 'translateX(0)'
    },
    sidebarDesktop: {
        position: 'fixed',
        transform: 'translateX(0)'
    },
    mainContent: {
        flex: 1,
        marginLeft: '0',
        transition: 'margin-left 0.3s ease-in-out',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    },
    mainContentDesktop: {
        marginLeft: '280px'
    },
    header: {
        backgroundColor: '#000000',
        boxShadow: isDarkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    mobileToggle: {
        display: 'block',
        backgroundColor: isDarkMode ? '#374151' : 'white',
        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        cursor: 'pointer',
        boxShadow: isDarkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        color: isDarkMode ? '#f9fafb' : '#6b7280'
    },
    mobileToggleDesktop: {
        display: 'none'
    },
    card: {
        background: isDarkMode
            ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '1rem',
        boxShadow: isDarkMode
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    },
    statCard: {
        background: isDarkMode
            ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '1rem',
        boxShadow: isDarkMode
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
    },
    statCardHover: {
        boxShadow: isDarkMode
            ? '0 10px 25px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
            : '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transform: 'translateY(-4px) scale(1.02)'
    },
    button: {
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        fontSize: '0.875rem'
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        color: isDarkMode ? '#d1d5db' : '#6b7280',
        border: isDarkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '0.875rem'
    },
    buttonDanger: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        fontSize: '0.875rem'
    },
    themeToggle: {
        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
        color: isDarkMode ? '#f9fafb' : '#374151',
        border: 'none',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.5rem',
        height: '2.5rem'
    },
    loadingContainer: {
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#111827' : '#f7fafd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorContainer: {
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#111827' : '#f7fafd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorCard: {
        backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
        border: isDarkMode ? '1px solid #991b1b' : '1px solid #fecaca',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        maxWidth: '28rem'
    },
    content: {
        flex: 1,
        padding: '2rem',
        backgroundColor: isDarkMode ? '#111827' : '#f7fafd'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    sectionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
    },
    navItem: {
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
        backgroundColor: 'transparent',
        color: isDarkMode ? '#d1d5db' : '#6b7280',
        textAlign: 'left'
    },
    navItemActive: {
        backgroundColor: isDarkMode ? '#1e3a8a' : '#dbeafe',
        color: isDarkMode ? '#93c5fd' : '#1d4ed8',
        borderRight: isDarkMode ? '2px solid #3b82f6' : '2px solid #1d4ed8'
    },
    navItemHover: {
        backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
        color: isDarkMode ? '#f9fafb' : '#374151'
    }
});

const RoleDashboard = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const translate = useTranslate();

    const styles = getStyles(isDarkMode);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle theme changes
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Logout function
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            // The App component will handle the redirect
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    // Theme toggle function
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

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
                const primaryRole = userData.roles && userData.roles.length > 0 ? userData.roles[0] : 'Scrum Master';

                // Fetch data based on role
                let dashboardData = {};
                if (primaryRole === 'Scrum Master') {
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
                    dashboardData = { velocity, sprints, retros, workItems };
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
                    <p style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>Loading your dashboard...</p>
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
                        <h3 style={{ color: isDarkMode ? '#fca5a5' : '#991b1b', fontWeight: '500' }}>Error Loading Dashboard</h3>
                    </div>
                    <p style={{ color: isDarkMode ? '#fca5a5' : '#dc2626', marginTop: '0.5rem' }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{ textAlign: 'center' }}>
                    <FaUsers style={{ fontSize: '2rem', color: isDarkMode ? '#6b7280' : '#9ca3af', margin: '0 auto 1rem' }} />
                    <p style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>No user found.</p>
                </div>
            </div>
        );
    }

    // Get the primary role from the roles array
    const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'Scrum Master';

    // Navigation items
    const navItems = [
        { id: 'dashboard', label: translate('Dashboard'), icon: FaChartLine },
        { id: 'backlog', label: translate('Backlog'), icon: FaList },
        { id: 'sprints', label: translate('Sprints'), icon: FaCalendarAlt },
        { id: 'team', label: translate('Team'), icon: FaUsers },
        { id: 'retrospectives', label: translate('Retrospectives'), icon: FaComments },
        { id: 'risks', label: translate('Risks'), icon: FaExclamationTriangle },
        { id: 'metrics', label: translate('Metrics'), icon: FaChartLine }
    ];

    // Render Scrum Master Dashboard
    if (primaryRole === 'Scrum Master') {
        return (
            <div style={styles.container}>
                {/* Sidebar */}
                <div style={{
                    ...styles.sidebar,
                    ...(sidebarOpen || isDesktop ? styles.sidebarOpen : {}),
                    ...(isDesktop ? styles.sidebarDesktop : {})
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                            backgroundColor: '#000000'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src="/scrumaster_ai_logo.png"
                                    alt="Scrumaster AI Logo"
                                    style={{
                                        height: '2rem',
                                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                                    }}
                                />
                            </div>
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
                                                    ...styles.navItem,
                                                    ...(activeTab === item.id ? styles.navItemActive : {})
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (activeTab !== item.id) {
                                                        e.target.style.backgroundColor = styles.navItemHover.backgroundColor;
                                                        e.target.style.color = styles.navItemHover.color;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (activeTab !== item.id) {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.color = styles.navItem.color;
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

                        {/* User Info & Logout */}
                        <div style={{ padding: '1rem', borderTop: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
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
                                        {primaryRole.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ marginLeft: '0.75rem', flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                        {primaryRole}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Dashboard</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{
                                    ...styles.buttonDanger,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{
                    ...styles.mainContent,
                    ...(isDesktop ? styles.mainContentDesktop : {})
                }}>
                    {/* Top Header */}
                    <header style={styles.header}>
                        <div style={styles.headerLeft}>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                style={{
                                    ...styles.mobileToggle,
                                    ...(isDesktop ? styles.mobileToggleDesktop : {})
                                }}
                            >
                                <FaBars style={{ color: 'white' }} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                                        {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                                    </h1>
                                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '0.875rem' }}>
                                        Manage your team's agile process and track progress
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={styles.headerRight}>
                            <button style={{
                                ...styles.buttonSecondary,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <FaBell style={{ marginRight: '0.5rem' }} />
                                Notifications
                            </button>
                            <button style={{
                                ...styles.buttonSecondary,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <FaCog style={{ marginRight: '0.5rem' }} />
                                Settings
                            </button>
                            <button
                                onClick={toggleTheme}
                                style={{
                                    ...styles.themeToggle,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDarkMode ? <FaSun /> : <FaMoon />}
                            </button>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <div style={styles.content}>
                        {activeTab === 'dashboard' && (
                            <div>
                                {/* Current Sprint Kanban Board */}
                                <div style={styles.card} className="premium-card fade-in">
                                    <div style={{ padding: '1.5rem', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', display: 'flex', alignItems: 'center' }}>
                                                <FaCalendarAlt style={{ marginRight: '0.75rem', color: '#2563eb' }} />
                                                {translate('Current Sprint Kanban Board')}
                                            </h2>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button style={{
                                                    ...styles.buttonSecondary,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    <FaEye style={{ marginRight: '0.5rem' }} />
                                                    {translate('Sprint Details')}
                                                </button>
                                                <button style={{
                                                    ...styles.button,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    <FaPlus style={{ marginRight: '0.5rem' }} />
                                                    {translate('Add Story')}
                                                </button>
                                            </div>
                                        </div>
                                        <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                            Sprint 3: User Authentication & Dashboard Features (Dec 1-15, 2024)
                                        </p>
                                    </div>

                                    {/* Kanban Board */}
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                            gap: '1rem',
                                            minHeight: '400px'
                                        }}>
                                            {/* To Do Column */}
                                            <div style={{
                                                backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc',
                                                borderRadius: '0.5rem',
                                                padding: '1rem',
                                                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                        {translate('To Do')} (3)
                                                    </h3>
                                                    <div style={{
                                                        backgroundColor: '#f3f4f6',
                                                        color: '#6b7280',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        8 pts
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {/* Story Cards */}
                                                    <div style={{
                                                        backgroundColor: isDarkMode ? '#374151' : 'white',
                                                        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-123: Implement OAuth Login
                                                            </h4>
                                                            <span style={{
                                                                backgroundColor: '#fef3c7',
                                                                color: '#92400e',
                                                                padding: '0.125rem 0.375rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                5 pts
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            Add Google and GitHub OAuth authentication options
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '1.5rem',
                                                                height: '1.5rem',
                                                                backgroundColor: '#3b82f6',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.75rem',
                                                                color: 'white',
                                                                fontWeight: '500'
                                                            }}>
                                                                JD
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                                John Doe
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div style={{
                                                        backgroundColor: isDarkMode ? '#374151' : 'white',
                                                        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-124: Dashboard Analytics
                                                            </h4>
                                                            <span style={{
                                                                backgroundColor: '#fef3c7',
                                                                color: '#92400e',
                                                                padding: '0.125rem 0.375rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                3 pts
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            Add velocity and burndown charts to dashboard
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '1.5rem',
                                                                height: '1.5rem',
                                                                backgroundColor: '#10b981',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.75rem',
                                                                color: 'white',
                                                                fontWeight: '500'
                                                            }}>
                                                                AS
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                                Alice Smith
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* In Progress Column */}
                                            <div style={{
                                                backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc',
                                                borderRadius: '0.5rem',
                                                padding: '1rem',
                                                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                        {translate('In Progress')} (2)
                                                    </h3>
                                                    <div style={{
                                                        backgroundColor: '#dbeafe',
                                                        color: '#1e40af',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        13 pts
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{
                                                        backgroundColor: isDarkMode ? '#374151' : 'white',
                                                        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        borderLeft: '4px solid #3b82f6'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-121: User Profile Management
                                                            </h4>
                                                            <span style={{
                                                                backgroundColor: '#fef3c7',
                                                                color: '#92400e',
                                                                padding: '0.125rem 0.375rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                8 pts
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            Create user profile pages with edit functionality
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '1.5rem',
                                                                height: '1.5rem',
                                                                backgroundColor: '#8b5cf6',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.75rem',
                                                                color: 'white',
                                                                fontWeight: '500'
                                                            }}>
                                                                MJ
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                                Mike Johnson
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div style={{
                                                        backgroundColor: isDarkMode ? '#374151' : 'white',
                                                        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        borderLeft: '4px solid #3b82f6'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-122: Team Collaboration
                                                            </h4>
                                                            <span style={{
                                                                backgroundColor: '#fef3c7',
                                                                color: '#92400e',
                                                                padding: '0.125rem 0.375rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                5 pts
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            Add team chat and collaboration features
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '1.5rem',
                                                                height: '1.5rem',
                                                                backgroundColor: '#f59e0b',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.75rem',
                                                                color: 'white',
                                                                fontWeight: '500'
                                                            }}>
                                                                SB
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                                Sarah Brown
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Done Column */}
                                            <div style={{
                                                backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc',
                                                borderRadius: '0.5rem',
                                                padding: '1rem',
                                                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                        {translate('Done')} (4)
                                                    </h3>
                                                    <div style={{
                                                        backgroundColor: '#dcfce7',
                                                        color: '#166534',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        21 pts
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{
                                                        backgroundColor: isDarkMode ? '#374151' : 'white',
                                                        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        borderLeft: '4px solid #10b981'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-118: Basic Authentication
                                                            </h4>
                                                            <span style={{
                                                                backgroundColor: '#dcfce7',
                                                                color: '#166534',
                                                                padding: '0.125rem 0.375rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                8 pts
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            Implement email/password authentication
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '1.5rem',
                                                                height: '1.5rem',
                                                                backgroundColor: '#ef4444',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.75rem',
                                                                color: 'white',
                                                                fontWeight: '500'
                                                            }}>
                                                                RW
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                                Robert Wilson
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div style={{
                                                        backgroundColor: isDarkMode ? '#374151' : 'white',
                                                        border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        padding: '1rem',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        borderLeft: '4px solid #10b981'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-119: Sprint Planning
                                                            </h4>
                                                            <span style={{
                                                                backgroundColor: '#dcfce7',
                                                                color: '#166534',
                                                                padding: '0.125rem 0.375rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                5 pts
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            Create sprint planning interface
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{
                                                                width: '1.5rem',
                                                                height: '1.5rem',
                                                                backgroundColor: '#06b6d4',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '0.75rem',
                                                                color: 'white',
                                                                fontWeight: '500'
                                                            }}>
                                                                LD
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                                Lisa Davis
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Backlog Management */}
                                <div style={styles.card} className="premium-card fade-in">
                                    <div style={{ padding: '1.5rem', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', display: 'flex', alignItems: 'center' }}>
                                                <FaList style={{ marginRight: '0.75rem', color: '#9333ea' }} />
                                                {translate('Product Backlog Management')}
                                            </h2>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button style={{
                                                    ...styles.buttonSecondary,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    <FaFilter style={{ marginRight: '0.5rem' }} />
                                                    {translate('Filter & Sort')}
                                                </button>
                                                <button style={{
                                                    ...styles.button,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    <FaPlus style={{ marginRight: '0.5rem' }} />
                                                    {translate('Create Story')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {/* Backlog Items with full Scrum Master controls */}
                                            <div style={{
                                                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                                padding: '1.5rem',
                                                backgroundColor: isDarkMode ? '#1f2937' : 'white'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-125: Advanced Reporting Dashboard
                                                            </h3>
                                                            <span style={{
                                                                backgroundColor: '#fef3c7',
                                                                color: '#92400e',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                13 pts
                                                            </span>
                                                            <span style={{
                                                                backgroundColor: '#f3e8ff',
                                                                color: '#7c3aed',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                High Priority
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            As a Scrum Master, I want comprehensive reporting capabilities so that I can track team performance and provide insights to stakeholders.
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                            <span>Epic: Analytics & Reporting</span>
                                                            <span>•</span>
                                                            <span>Created: Dec 1, 2024</span>
                                                            <span>•</span>
                                                            <span>Business Value: High</span>
                                                            <span>•</span>
                                                            <span>Dependencies: US-118, US-119</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                                        <button style={{
                                                            ...styles.buttonSecondary,
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem'
                                                        }}>
                                                            {translate('Edit')}
                                                        </button>
                                                        <button style={{
                                                            ...styles.button,
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem'
                                                        }}>
                                                            {translate('Add to Sprint')}
                                                        </button>
                                                        <button style={{
                                                            ...styles.buttonSecondary,
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#fef3c7',
                                                            color: '#92400e'
                                                        }}>
                                                            {translate('Refine')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                                borderRadius: '0.5rem',
                                                padding: '1.5rem',
                                                backgroundColor: isDarkMode ? '#1f2937' : 'white'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                US-126: Mobile Application
                                                            </h3>
                                                            <span style={{
                                                                backgroundColor: '#fef3c7',
                                                                color: '#92400e',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                21 pts
                                                            </span>
                                                            <span style={{
                                                                backgroundColor: '#fef2f2',
                                                                color: '#dc2626',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '0.25rem',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '500'
                                                            }}>
                                                                Medium Priority
                                                            </span>
                                                        </div>
                                                        <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginBottom: '0.5rem' }}>
                                                            As a team member, I want to access the platform on mobile devices so that I can stay connected and productive while on the go.
                                                        </p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                            <span>Epic: Mobile Experience</span>
                                                            <span>•</span>
                                                            <span>Created: Dec 2, 2024</span>
                                                            <span>•</span>
                                                            <span>Business Value: Medium</span>
                                                            <span>•</span>
                                                            <span>Dependencies: US-125</span>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                                        <button style={{
                                                            ...styles.buttonSecondary,
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem'
                                                        }}>
                                                            {translate('Edit')}
                                                        </button>
                                                        <button style={{
                                                            ...styles.button,
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem'
                                                        }}>
                                                            {translate('Add to Sprint')}
                                                        </button>
                                                        <button style={{
                                                            ...styles.buttonSecondary,
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#fef3c7',
                                                            color: '#92400e'
                                                        }}>
                                                            {translate('Refine')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sprints' && (
                            <div style={styles.card}>
                                <div style={{ padding: '1.5rem', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', display: 'flex', alignItems: 'center' }}>
                                            <FaCalendarAlt style={{ marginRight: '0.75rem', color: '#2563eb' }} />
                                            {translate('Sprint Management')}
                                        </h2>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button style={{
                                                ...styles.buttonSecondary,
                                                fontSize: '0.875rem',
                                                padding: '0.5rem 1rem'
                                            }}>
                                                <FaEye style={{ marginRight: '0.5rem' }} />
                                                {translate('Sprint History')}
                                            </button>
                                            <button style={{
                                                ...styles.button,
                                                fontSize: '0.875rem',
                                                padding: '0.5rem 1rem'
                                            }}>
                                                <FaPlus style={{ marginRight: '0.5rem' }} />
                                                {translate('Create Sprint')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {/* Current Sprint */}
                                        <div style={{
                                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            padding: '1.5rem',
                                            backgroundColor: isDarkMode ? '#1f2937' : 'white',
                                            borderLeft: '4px solid #2563eb'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                    Sprint 3: User Authentication & Dashboard Features
                                                </h3>
                                                <span style={{
                                                    backgroundColor: '#dbeafe',
                                                    color: '#1e40af',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}>
                                                    Active
                                                </span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Duration</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>Dec 1-15, 2024</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Capacity</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>42 points</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Completed</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: '#10b981' }}>21 points</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Remaining</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: '#f59e0b' }}>21 points</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button style={{
                                                    ...styles.buttonSecondary,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    {translate('Sprint Planning')}
                                                </button>
                                                <button style={{
                                                    ...styles.buttonSecondary,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    {translate('Daily Standup')}
                                                </button>
                                                <button style={{
                                                    ...styles.button,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    {translate('Sprint Review')}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Upcoming Sprint */}
                                        <div style={{
                                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            padding: '1.5rem',
                                            backgroundColor: isDarkMode ? '#1f2937' : 'white',
                                            borderLeft: '4px solid #10b981'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                    Sprint 4: Advanced Features & Mobile App
                                                </h3>
                                                <span style={{
                                                    backgroundColor: '#dcfce7',
                                                    color: '#166534',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}>
                                                    Planned
                                                </span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Duration</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>Dec 16-29, 2024</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Capacity</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>40 points</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Stories</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>5 planned</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Status</p>
                                                    <p style={{ fontSize: '1rem', fontWeight: '500', color: '#f59e0b' }}>Planning</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button style={{
                                                    ...styles.buttonSecondary,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    {translate('Sprint Planning')}
                                                </button>
                                                <button style={{
                                                    ...styles.button,
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem'
                                                }}>
                                                    {translate('Start Sprint')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other tabs */}
                        {activeTab === 'team' && (
                            <div style={styles.card}>
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Team Management')}</h2>
                                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('Team management features coming soon!')}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'risks' && (
                            <div style={styles.card}>
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Risk Management')}</h2>
                                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('ROAM risk tracking features coming soon!')}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'metrics' && (
                            <div style={styles.card}>
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Metrics & Analytics')}</h2>
                                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('Advanced metrics and analytics coming soon!')}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'retrospectives' && (
                            <div style={styles.card}>
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Retrospectives')}</h2>
                                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('Retrospective management features coming soon!')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && !isDesktop && (
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
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Product Owner Dashboard')}</h2>
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('Product Owner dashboard coming soon!')}</p>
                </div>
            </div>
        );
    }
    if (primaryRole === 'RTE') {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Release Train Engineer Dashboard')}</h2>
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('RTE dashboard coming soon!')}</p>
                </div>
            </div>
        );
    }
    if (primaryRole === 'Sponsor') {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.card}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Sponsor Dashboard')}</h2>
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('Sponsor dashboard coming soon!')}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.loadingContainer}>
            <div style={styles.card}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', marginBottom: '0.5rem' }}>{translate('Unknown Role')}</h2>
                <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('Role:')} {primaryRole}</p>
            </div>
        </div>
    );
};

export default RoleDashboard; 