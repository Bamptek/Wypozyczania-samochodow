import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

const CarDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const updateUser = useAuthStore((state) => state.updateUser);

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [usePoints, setUsePoints] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await api.get(`/cars/${id}`);
                setCar(res.data);
            } catch (err) {
                setError('Nie udało się pobrać danych samochodu. Możliwe, że oferta jest już nieaktualna.');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    useEffect(() => {
        if (car && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end > start) {
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                setTotalPrice(days * car.pricePerDay);
            } else {
                setTotalPrice(0);
            }
        }
    }, [startDate, endDate, car]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isLoggedIn) {
            setError('Musisz być zalogowany, aby dokonać rezerwacji.');
            return;
        }
        if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
            setError('Proszę wybrać poprawne daty rezerwacji (data zwrotu musi być późniejsza niż data odbioru).');
            return;
        }

        try {
            await api.post('/bookings', {
                carId: car.id,
                startDate,
                endDate,
                usePoints
            });
            setSuccess('Twoja rezerwacja została pomyślnie złożona! Sprawdź e-mail z potwierdzeniem.');

            const { data: updatedUser } = await api.get('/users/me');
            updateUser(updatedUser); 
            
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd podczas rezerwacji.');
        }
    };

    if (loading) return <p className="text-center mt-8">Ładowanie szczegółów samochodu...</p>;
    if (error && !car) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            {car && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-lg">
                    {/* Kolumna ze zdjęciem i opisem */}
                    <div>
                        <img src={car.imageUrl || 'https://via.placeholder.com/600x400?text=Brak+Zdjecia'} alt={`${car.make} ${car.model}`} className="w-full rounded-lg mb-4" />
                        <h1 className="text-4xl font-bold">{car.make} {car.model}</h1>
                        <p className="text-xl text-gray-600">Rocznik: {car.year}</p>
                        <p className="text-2xl font-bold text-blue-600 mt-4">{car.pricePerDay.toFixed(2)} PLN/dzień</p>
                    </div>

                    {/* Kolumna z formularzem rezerwacji */}
                    <div>
                        <form onSubmit={handleBooking} className="p-6 border rounded-lg bg-gray-50">
                            <h2 className="text-2xl font-semibold mb-4">Zarezerwuj ten samochód</h2>
                            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
                            {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</p>}
                            
                            <div className="mb-4">
                                <label className="block text-gray-700">Data odbioru</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded mt-1" min={today} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Data zwrotu</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded mt-1" min={today} />
                            </div>

                            {isLoggedIn && user.points > 0 && (
                                <div className="mb-4 flex items-center">
                                    <input type="checkbox" id="usePoints" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                    <label htmlFor="usePoints" className="ml-2 block text-sm text-gray-900">Użyj swoich {user.points} punktów lojalnościowych, aby uzyskać zniżkę</label>
                                </div>
                            )}

                            <div className="text-2xl font-bold my-4">
                                Całkowity koszt: {totalPrice.toFixed(2)} PLN
                            </div>

                            <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold transition-transform transform hover:scale-105">Zarezerwuj teraz</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetailPage;