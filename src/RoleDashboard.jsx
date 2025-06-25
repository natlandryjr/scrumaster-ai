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
    FaMoon
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
    const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'ScrumMaster';

    // Navigation items
    const navItems = [
        { id: 'dashboard', label: translate('Dashboard'), icon: FaTachometerAlt },
        { id: 'team', label: translate('Team'), icon: FaUsers },
        { id: 'risks', label: translate('Risks'), icon: FaExclamationTriangle },
        { id: 'metrics', label: translate('Metrics'), icon: FaChartLine },
        { id: 'retrospectives', label: translate('Retrospectives'), icon: FaComments }
    ];

    // Render Scrum Master Dashboard
    if (primaryRole === 'ScrumMaster') {
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
                        <div style={{ padding: '1.5rem', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src="/scrumaster_ai_logo.png"
                                    alt="ScrumMaster AI Logo"
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
                                {/* Stats Cards */}
                                <div style={styles.statsGrid}>
                                    {/* Team Velocity Card */}
                                    <div
                                        style={styles.statCard}
                                        className="premium-card fade-in"
                                        onMouseEnter={(e) => {
                                            e.target.style.boxShadow = styles.statCardHover.boxShadow;
                                            e.target.style.transform = styles.statCardHover.transform;
                                            e.target.classList.add('glow');
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.boxShadow = styles.statCard.boxShadow;
                                            e.target.style.transform = 'none';
                                            e.target.classList.remove('glow');
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                    Team Velocity
                                                </p>
                                                <p className="gradient-text" style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                                    {data.velocity || 0}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
                                                    story points/sprint
                                                </p>
                                            </div>
                                            <div style={{
                                                width: '4rem',
                                                height: '4rem',
                                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
                                            }} className="float">
                                                <FaRocket style={{ color: '#2563eb', fontSize: '1.5rem' }} />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: isDarkMode ? '1px solid #374151' : '1px solid #f3f4f6' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                <FaChartLine style={{ marginRight: '0.5rem' }} />
                                                <span>Based on last 3 sprints</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Sprints Count */}
                                    <div
                                        style={styles.statCard}
                                        onMouseEnter={(e) => {
                                            e.target.style.boxShadow = styles.statCardHover.boxShadow;
                                            e.target.style.transform = styles.statCardHover.transform;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.boxShadow = styles.statCard.boxShadow;
                                            e.target.style.transform = 'none';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                    Active Sprints
                                                </p>
                                                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: isDarkMode ? '#f9fafb' : '#111827', marginTop: '0.5rem' }}>
                                                    {data.sprints?.length || 0}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
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
                                    <div
                                        style={styles.statCard}
                                        onMouseEnter={(e) => {
                                            e.target.style.boxShadow = styles.statCardHover.boxShadow;
                                            e.target.style.transform = styles.statCardHover.transform;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.boxShadow = styles.statCard.boxShadow;
                                            e.target.style.transform = 'none';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                                    Retrospectives
                                                </p>
                                                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: isDarkMode ? '#f9fafb' : '#111827', marginTop: '0.5rem' }}>
                                                    {data.retros?.length || 0}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
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

                                {/* Content Sections */}
                                <div style={styles.sectionGrid}>
                                    {/* Active Sprints Section */}
                                    <div style={styles.card} className="premium-card fade-in">
                                        <div style={{ padding: '1.5rem', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                                            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', display: 'flex', alignItems: 'center' }}>
                                                <FaCalendarAlt style={{ marginRight: '0.75rem', color: '#2563eb' }} />
                                                {translate('Active Sprints')}
                                            </h2>
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            {data.sprints && data.sprints.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {data.sprints.map((sprint) => (
                                                        <div key={sprint.id} style={{
                                                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                                            borderRadius: '0.5rem',
                                                            padding: '1rem',
                                                            transition: 'box-shadow 0.2s ease'
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <div>
                                                                    <h3 style={{ fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>{sprint.name}</h3>
                                                                    <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
                                                                        {sprint.start_date} - {sprint.end_date}
                                                                    </p>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                                    <div style={{ textAlign: 'right' }}>
                                                                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                            {data.workItems?.filter(wi => wi.sprint_id === sprint.id).length || 0}
                                                                        </p>
                                                                        <p style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('stories')}</p>
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
                                                    <FaCalendarAlt style={{ color: isDarkMode ? '#6b7280' : '#9ca3af', fontSize: '2rem', margin: '0 auto 1rem' }} />
                                                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('No active sprints')}</p>
                                                    <button style={{
                                                        ...styles.button,
                                                        marginTop: '1rem'
                                                    }} className="premium-button">
                                                        {translate('Create Sprint')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Retrospectives Section */}
                                    <div style={styles.card} className="premium-card fade-in">
                                        <div style={{ padding: '1.5rem', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb' }}>
                                            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', display: 'flex', alignItems: 'center' }}>
                                                <FaComments style={{ marginRight: '0.75rem', color: '#9333ea' }} />
                                                {translate('Recent Retrospectives')}
                                            </h2>
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            {data.retros && data.retros.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '24rem', overflowY: 'auto' }}>
                                                    {data.retros.map((retro) => (
                                                        <div key={retro.id} style={{
                                                            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                                            borderRadius: '0.5rem',
                                                            padding: '1rem',
                                                            transition: 'box-shadow 0.2s ease'
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                                        <h3 style={{ fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827' }}>
                                                                            {translate('Sprint')} {retro.sprint_id}
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
                                                                            <p style={{ fontWeight: '500', color: isDarkMode ? '#d1d5db' : '#374151' }}>{translate('Keep Doing')}</p>
                                                                            <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
                                                                                {retro.keepDoing || 'No items'}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p style={{ fontWeight: '500', color: isDarkMode ? '#d1d5db' : '#374151' }}>{translate('Start Doing')}</p>
                                                                            <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
                                                                                {retro.startDoing || 'No items'}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p style={{ fontWeight: '500', color: isDarkMode ? '#d1d5db' : '#374151' }}>{translate('Stop Doing')}</p>
                                                                            <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: '0.25rem' }}>
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
                                                    <FaComments style={{ color: isDarkMode ? '#6b7280' : '#9ca3af', fontSize: '2rem', margin: '0 auto 1rem' }} />
                                                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{translate('No retrospectives yet')}</p>
                                                    <button style={{
                                                        ...styles.button,
                                                        marginTop: '1rem',
                                                        backgroundColor: '#9333ea'
                                                    }}>
                                                        {translate('Schedule Retrospective')}
                                                    </button>
                                                </div>
                                            )}
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