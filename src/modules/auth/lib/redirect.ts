import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../components/context/auth-context';

export const useAuthRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true });
        }
    }, [user, loading]);
};
