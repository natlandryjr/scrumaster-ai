import { useState } from 'react';
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
    FaBell
} from 'react-icons/fa';
import { useTranslate } from './translate.jsx';

// Same styles as RoleDashboard
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f7fafd',
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        display: 'flex'
    },
    sidebar: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '280px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 40,
        transform: 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        overflowY: 'auto'
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
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb',
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
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        cursor: 'pointer',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    mobileToggleDesktop: {
        display: 'none'
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
        transition: 'all 0.2s ease',
        cursor: 'pointer'
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
        color: '#6b7280',
        border: '1px solid #d1d5db',
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
    content: {
        flex: 1,
        padding: '2rem',
        backgroundColor: '#f7fafd'
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
        color: '#6b7280',
        textAlign: 'left'
    },
    navItemActive: {
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
        borderRight: '2px solid #1d4ed8'
    },
    navItemHover: {
        backgroundColor: '#f3f4f6',
        color: '#374151'
    }
};

const DashboardTest = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const translate = useTranslate();

    // Mock data for testing
    const mockData = {
        velocity: 24.5,
        sprints: [
            { id: 1, name: 'Sprint 1', start_date: '2024-01-01', end_date: '2024-01-14' },
            { id: 2, name: 'Sprint 2', start_date: '2024-01-15', end_date: '2024-01-28' }
        ],
        retros: [
            { id: 1, sprint_id: 1, keepDoing: 'Daily standups', startDoing: 'Code reviews', stopDoing: 'Long meetings' },
            { id: 2, sprint_id: 2, keepDoing: 'Pair programming', startDoing: 'Automated testing', stopDoing: 'Manual deployments' }
        ],
        workItems: [
            { id: 1, sprint_id: 1, status: 'Done', story_points: 5 },
            { id: 2, sprint_id: 1, status: 'Done', story_points: 3 },
            { id: 3, sprint_id: 2, status: 'In Progress', story_points: 8 }
        ]
    };

    // Navigation items
    const navItems = [
        { id: 'dashboard', label: translate('Dashboard'), icon: FaTachometerAlt },
        { id: 'team', label: translate('Team'), icon: FaUsers },
        { id: 'risks', label: translate('Risks'), icon: FaExclamationTriangle },
        { id: 'metrics', label: translate('Metrics'), icon: FaChartLine },
        { id: 'retrospectives', label: translate('Retrospectives'), icon: FaComments }
    ];

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
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaRocket style={{ color: '#2563eb', fontSize: '1.5rem', marginRight: '0.75rem' }} />
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>ScrumMaster AI</h1>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            Welcome back, Test User
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

                    {/* User Info & Logout */}
                    <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
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
                                    T
                                </span>
                            </div>
                            <div style={{ marginLeft: '0.75rem', flex: 1 }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                    Test User
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>ScrumMaster</p>
                            </div>
                        </div>
                        <button
                            onClick={() => alert('Logout clicked!')}
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
                            <FaBars style={{ color: '#6b7280' }} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                            </h1>
                            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                                Manage your team's agile process and track progress
                            </p>
                        </div>
                    </div>
                    <div style={styles.headerRight}>
                        <button style={styles.buttonSecondary}>
                            <FaBell style={{ marginRight: '0.5rem' }} />
                            Notifications
                        </button>
                        <button style={styles.buttonSecondary}>
                            <FaCog style={{ marginRight: '0.5rem' }} />
                            Settings
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
                                <div style={styles.statCard}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                                                Team Velocity
                                            </p>
                                            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>
                                                {mockData.velocity}
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
                                </div>

                                {/* Active Sprints Count */}
                                <div style={styles.statCard}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                                                Active Sprints
                                            </p>
                                            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>
                                                {mockData.sprints.length}
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
                                                {mockData.retros.length}
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

                            {/* Content Sections */}
                            <div style={styles.sectionGrid}>
                                {/* Active Sprints Section */}
                                <div style={styles.card}>
                                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center' }}>
                                            <FaCalendarAlt style={{ marginRight: '0.75rem', color: '#2563eb' }} />
                                            Active Sprints
                                        </h2>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {mockData.sprints.map((sprint) => (
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
                                                                    {mockData.workItems.filter(wi => wi.sprint_id === sprint.id).length}
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
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '24rem', overflowY: 'auto' }}>
                                            {mockData.retros.map((retro) => (
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
                                                                        {retro.keepDoing}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontWeight: '500', color: '#374151' }}>Start Doing</p>
                                                                    <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                                                                        {retro.startDoing}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontWeight: '500', color: '#374151' }}>Stop Doing</p>
                                                                    <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                                                                        {retro.stopDoing}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other tabs */}
                    {activeTab === 'team' && (
                        <div style={styles.card}>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Team Management</h2>
                                <p style={{ color: '#6b7280' }}>Team management features coming soon!</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'risks' && (
                        <div style={styles.card}>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Risk Management</h2>
                                <p style={{ color: '#6b7280' }}>ROAM risk tracking features coming soon!</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'metrics' && (
                        <div style={styles.card}>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Metrics & Analytics</h2>
                                <p style={{ color: '#6b7280' }}>Advanced metrics and analytics coming soon!</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'retrospectives' && (
                        <div style={styles.card}>
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Retrospectives</h2>
                                <p style={{ color: '#6b7280' }}>Retrospective management features coming soon!</p>
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
};

export default DashboardTest; 