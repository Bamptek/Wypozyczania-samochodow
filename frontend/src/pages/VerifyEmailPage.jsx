import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const VerifyEmailPage = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-lg text-red-600">Brak adresu e-mail do weryfikacji.</p>
                <p className="mt-2 text-gray-600">Proszę, wróć do strony rejestracji i spróbuj ponownie.</p>
                <Link to="/register" className="mt-4 inline-block text-blue-500 hover:underline">Wróć do rejestracji</Link>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await api.post('/auth/verify-email', { email, token });
            setSuccess(response.data.message + " Przekierowuję do logowania...");
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił nieznany błąd.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-2 text-center">Zweryfikuj swój E-mail</h2>
                <p className="text-center text-gray-600 mb-6">Wysłaliśmy 6-cyfrowy kod na adres <strong>{email}</strong>.</p>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
                {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Kod Weryfikacyjny</label>
                    <input 
                        type="text" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        className="w-full p-3 border rounded-lg text-center tracking-[1em]" 
                        maxLength="6" 
                        required 
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold">Zweryfikuj</button>
            </form>
        </div>
    );
};

export default VerifyEmailPage;