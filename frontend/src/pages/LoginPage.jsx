import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { loginIdentifier, password });
            login(response.data, response.data.accessToken);
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Błędny email lub hasło.';
            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Logowanie</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email lub Nazwa użytkownika</label>
                    <input 
                        type="text" 
                        value={loginIdentifier} 
                        onChange={(e) => setLoginIdentifier(e.target.value)} 
                        className="w-full p-3 border rounded-lg" 
                        required 
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Hasło</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors">Zaloguj</button>
            </form>
        </div>
    );
};
export default LoginPage;