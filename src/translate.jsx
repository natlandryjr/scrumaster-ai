import { useTerminology, TERMINOLOGY_MODES } from './terminologyContext.jsx';

const TERM_MAP = {
    // Core Agile/Scrum terms
    'Daily Stand-up': 'The Huddle',
    'Sprint': 'Drive',
    'Product Owner': 'Offensive Coordinator',
    'Scrum Master': 'Quarterback',
    'Retrospective': 'Post-Game Review',
    'Sprint Planning': 'Drive Planning',
    'Sprint Review': 'Drive Review',
    'Sprint Retrospective': 'Post-Game Review',
    'Backlog': 'Playbook',
    'User Story': 'Play Call',
    'Epic': 'Game Plan',
    'Velocity': 'Yards Gained',
    'Burndown Chart': 'Scoreboard',
    'Story Points': 'Yard Markers',
    'Sprint Goal': 'Drive Goal',
    'Definition of Done': 'Touchdown Criteria',
    'Definition of Ready': 'Huddle Ready',
    'Sprint Backlog': 'Drive Playbook',
    'Product Backlog': 'Season Playbook',
    'Release': 'Season',
    'Release Planning': 'Season Planning',
    'PI Planning': 'Season Strategy',
    'Program Increment': 'Season',
    'Iteration': 'Drive',
    'Team': 'Squad',
    'Scrum Team': 'Squad',
    'Development Team': 'Offense',
    'Stakeholder': 'Fan Base',
    'Sprint Demo': 'Drive Showcase',
    'Daily Scrum': 'The Huddle',
    'Sprint Planning Meeting': 'Drive Planning Meeting',
    'Sprint Review Meeting': 'Drive Review Meeting',
    'Sprint Retrospective Meeting': 'Post-Game Review Meeting',

    // Dashboard and UI terms
    'Dashboard': 'Command Center',
    'Risks': 'Threats',
    'Metrics': 'Stats',
    'Retrospectives': 'Post-Game Reviews',
    'Active Sprints': 'Active Drives',
    'Create Sprint': 'Create Drive',
    'Recent Retrospectives': 'Recent Post-Game Reviews',
    'Schedule Retrospective': 'Schedule Post-Game Review',
    'Team Management': 'Squad Management',
    'Risk Management': 'Threat Management',
    'Metrics & Analytics': 'Stats & Analytics',
    'Product Owner Dashboard': 'Offensive Coordinator Command Center',
    'Release Train Engineer Dashboard': 'Head Coach Command Center',
    'Sponsor Dashboard': 'Owner Command Center',
    'Unknown Role': 'Unknown Position',
    'Role:': 'Position:',

    // Retrospective specific terms
    'Add Retrospective': 'Add Post-Game Review',
    'Keep Doing': 'Keep Executing',
    'Start Doing': 'Start Executing',
    'Stop Doing': 'Stop Executing',
    'AI Insights': 'AI Analysis',
    'AI Suggestion': 'AI Recommendation',
    'No feedback for this sprint.': 'No feedback for this drive.',
    'Select team': 'Select squad',
    'Select sprint': 'Select drive',
    'Add': 'Add',
    'Cancel': 'Cancel',
    'No retrospectives yet': 'No post-game reviews yet',

    // Landing page terms
    'AI-Powered Agile for SAFe, Scrum & Hybrid Teams': 'AI-Powered Huddle Method for Championship Teams',
    'Built for RTEs, ScrumMasters, Product Owners & Sponsors': 'Built for Head Coaches, Quarterbacks, Offensive Coordinators & Owners',
    'AI Planning Assistant': 'AI Strategy Assistant',
    'Role-Based Dashboards': 'Position-Based Command Centers',
    'ROAM Risk Tracking': 'ROAM Threat Tracking',
    'Real-Time Metrics': 'Real-Time Stats',
    'Team Collaboration': 'Squad Collaboration',
    'Sprint Management': 'Drive Management',
    'Key Features': 'Key Plays',
    'Pricing': 'Season Tickets',
    'About Us': 'About Our Team',
    'Contact': 'Contact',
    'Login': 'Enter Game',
    'Start Free Trial': 'Start Free Season',
    'Get Started': 'Get in the Game',
    'Start Pro Trial': 'Start Pro Season',
    'Contact Sales': 'Contact Management',
    'Contact Us': 'Contact Management',

    // Pricing tiers
    'Starter': 'Rookie',
    'Pro': 'Pro',
    'Enterprise': 'Championship',
    '1 Team': '1 Squad',
    'Basic AI Planning': 'Basic AI Strategy',
    'Community Support': 'Fan Support',
    'Up to 5 Teams': 'Up to 5 Squads',
    'Advanced AI': 'Advanced AI',
    'Priority Support': 'Priority Support',
    'Unlimited Teams': 'Unlimited Squads',
    'Custom Integrations': 'Custom Plays',
    'Dedicated Success Manager': 'Dedicated Coach',

    // Additional terms
    'stories': 'plays',
    'No active sprints': 'No active drives',
    'Team management features coming soon!': 'Squad management features coming soon!',
    'ROAM risk tracking features coming soon!': 'ROAM threat tracking features coming soon!',
    'Advanced metrics and analytics coming soon!': 'Advanced stats and analytics coming soon!',
    'Retrospective management features coming soon!': 'Post-game review management features coming soon!',
    'Product Owner dashboard coming soon!': 'Offensive Coordinator command center coming soon!',
    'RTE dashboard coming soon!': 'Head Coach command center coming soon!',
    'Sponsor dashboard coming soon!': 'Owner command center coming soon!'
};

export function useTranslate() {
    const { mode } = useTerminology();
    return (term) => {
        if (mode === TERMINOLOGY_MODES.HUDDLE && TERM_MAP[term]) {
            return TERM_MAP[term];
        }
        return term;
    };
} 