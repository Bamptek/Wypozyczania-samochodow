import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const { user, token, login, logout } = useAuthStore();
    return {
        isLoggedIn: !!token,
        user,
        isAdmin: user?.role === 'ADMIN',
        login,
        logout,
    };
};