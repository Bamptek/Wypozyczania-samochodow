import { useState, useEffect } from 'react';
import api from '../api';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my-bookings');
            setBookings(res.data);
        } catch (err) {
            setError('Nie udało się pobrać rezerwacji.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
            try {
                await api.delete(`/bookings/${bookingId}`);
                fetchBookings(); 
            } catch (err) {
                alert(err.response?.data?.message || 'Nie udało się anulować rezerwacji.');
            }
        }
    };

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Moje Rezerwacje</h1>
            {bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={booking.car.imageUrl} alt={booking.car.make} className="w-32 h-20 object-cover rounded mr-4" />
                                <div>
                                    <h2 className="text-xl font-bold">{booking.car.make} {booking.car.model}</h2>
                                    <p>Od: {new Date(booking.startDate).toLocaleDateString()}</p>
                                    <p>Do: {new Date(booking.endDate).toLocaleDateString()}</p>
                                    <p>Status: <span className={`font-semibold ${booking.status === 'CANCELLED' ? 'text-red-500' : 'text-green-500'}`}>{booking.status}</span></p>
                                </div>
                            </div>
                            <div>
                                {booking.status === 'CONFIRMED' && new Date(booking.startDate) > new Date() && (
                                    <button onClick={() => handleCancelBooking(booking.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                        Anuluj
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Nie masz jeszcze żadnych rezerwacji.</p>
            )}
        </div>
    );
};

export default MyBookingsPage;