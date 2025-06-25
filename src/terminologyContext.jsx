import React, { createContext, useContext, useState, useEffect } from 'react';

const TerminologyContext = createContext();

export const TERMINOLOGY_MODES = {
    AGILE: 'agile',
    HUDDLE: 'huddle',
};

const TERMINOLOGY_KEY = 'scrumasterai_terminology_mode';

export function TerminologyProvider({ children }) {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem(TERMINOLOGY_KEY);
        return saved === TERMINOLOGY_MODES.HUDDLE ? TERMINOLOGY_MODES.HUDDLE : TERMINOLOGY_MODES.AGILE;
    });

    useEffect(() => {
        localStorage.setItem(TERMINOLOGY_KEY, mode);
    }, [mode]);

    const toggleMode = () => {
        setMode((prev) =>
            prev === TERMINOLOGY_MODES.AGILE ? TERMINOLOGY_MODES.HUDDLE : TERMINOLOGY_MODES.AGILE
        );
    };

    return (
        <TerminologyContext.Provider value={{ mode, setMode, toggleMode }}>
            {children}
        </TerminologyContext.Provider>
    );
}

export function useTerminology() {
    const context = useContext(TerminologyContext);
    if (!context) throw new Error('useTerminology must be used within a TerminologyProvider');
    return context;
} 