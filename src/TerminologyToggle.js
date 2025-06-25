import React from 'react';
import { useTerminology, TERMINOLOGY_MODES } from './terminologyContext';

export default function TerminologyToggle() {
    const { mode, toggleMode } = useTerminology();

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 500, color: mode === TERMINOLOGY_MODES.AGILE ? '#2563eb' : '#888' }}>Agile</span>
            <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 24 }}>
                <input
                    type="checkbox"
                    checked={mode === TERMINOLOGY_MODES.HUDDLE}
                    onChange={toggleMode}
                    style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                    style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: mode === TERMINOLOGY_MODES.HUDDLE ? '#2563eb' : '#ccc',
                        borderRadius: 24,
                        transition: 'background 0.2s',
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        left: mode === TERMINOLOGY_MODES.HUDDLE ? 24 : 2,
                        top: 2,
                        width: 20,
                        height: 20,
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        transition: 'left 0.2s',
                    }}
                />
            </label>
            <span style={{ fontWeight: 500, color: mode === TERMINOLOGY_MODES.HUDDLE ? '#2563eb' : '#888' }}>Huddle</span>
        </div>
    );
} 