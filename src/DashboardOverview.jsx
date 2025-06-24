import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

const DashboardOverview = () => {
    const [organizations, setOrganizations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: orgs, error: orgsError } = await supabase.from('organizations').select('*');
                const { data: usersData, error: usersError } = await supabase.from('users').select('*');
                if (orgsError) throw orgsError;
                if (usersError) throw usersError;
                setOrganizations(orgs || []);
                setUsers(usersData || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Organizations</h2>
            <ul>
                {organizations.map(org => (
                    <li key={org.id}>
                        {org.name}
                        <ul>
                            {users.filter(user => user.organization_id === org.id).map(user => (
                                <li key={user.id}>{user.name}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardOverview; 