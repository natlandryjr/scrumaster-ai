import { useTerminology, TERMINOLOGY_MODES } from './terminologyContext';

const TERM_MAP = {
    'Daily Stand-up': 'The Huddle',
    'Sprint': 'Drive',
    'Product Owner': 'Offensive Coordinator',
    'Scrum Master': 'Quarterback',
    'Retrospective': 'Post-Game Review',
    // Add more mappings as needed
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