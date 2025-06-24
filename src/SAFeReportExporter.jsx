import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const SECTIONS = [
    { key: 'strategic_themes', label: 'Strategic Themes' },
    { key: 'objectives', label: 'Objectives' },
    { key: 'programs', label: 'Programs' },
    { key: 'release_trains', label: 'Release Trains' },
    { key: 'teams', label: 'Teams' },
    { key: 'sprints', label: 'Sprints' },
    { key: 'work_items', label: 'Work Items' },
    { key: 'retrospectives', label: 'Retrospectives' },
    { key: 'risks', label: 'Risks' },
];

const fetchAllData = async () => {
    const tables = SECTIONS.map(s => s.key);
    const results = {};
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw new Error(`Error fetching ${table}: ${error.message}`);
        results[table] = data || [];
    }
    return results;
};

const SAFeReportExporter = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(SECTIONS.map(s => s.key));
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const allData = await fetchAllData();
                setData(allData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSelect = (key) => {
        setSelected(prev => prev.includes(key)
            ? prev.filter(k => k !== key)
            : [...prev, key]
        );
    };

    const handleExportCSV = () => {
        setExporting(true);
        try {
            selected.forEach(section => {
                const csv = Papa.unparse(data[section] || []);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', `${section}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        } finally {
            setExporting(false);
        }
    };

    const handleExportPDF = () => {
        setExporting(true);
        try {
            const doc = new jsPDF();
            let y = 10;
            selected.forEach(section => {
                doc.setFontSize(14);
                doc.text(SECTIONS.find(s => s.key === section).label, 10, y);
                y += 6;
                doc.setFontSize(10);
                const items = data[section] || [];
                if (items.length > 0) {
                    const keys = Object.keys(items[0]);
                    items.forEach(item => {
                        let line = keys.map(k => `${k}: ${item[k]}`).join(' | ');
                        doc.text(line, 10, y);
                        y += 5;
                        if (y > 270) {
                            doc.addPage();
                            y = 10;
                        }
                    });
                } else {
                    doc.text('No data', 10, y);
                    y += 5;
                }
                y += 5;
            });
            doc.save('safe_report.pdf');
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>SAFe Report Exporter</h2>
            <div style={{ marginBottom: '1rem' }}>
                <strong>Select Sections to Export:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                    {SECTIONS.map(section => (
                        <label key={section.key} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <input
                                type="checkbox"
                                checked={selected.includes(section.key)}
                                onChange={() => handleSelect(section.key)}
                            />
                            {section.label}
                        </label>
                    ))}
                </div>
            </div>
            <button onClick={handleExportCSV} disabled={exporting} style={{ marginRight: '1rem' }}>Export as CSV</button>
            <button onClick={handleExportPDF} disabled={exporting}>Export as PDF</button>
        </div>
    );
};

export default SAFeReportExporter; 