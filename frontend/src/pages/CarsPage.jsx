
import { useState, useEffect } from 'react';
import api from '../api';
import CarCard from '../components/CarCard';

const CarsPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await api.get('/cars');
                setCars(res.data);
            } catch (error) {
                setError("Nie udało się pobrać listy samochodów.");
                console.error("Failed to fetch cars", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    if (loading) return <p className="text-center mt-8">Ładowanie samochodów...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dostępne samochody</h1>
            {cars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map(car => <CarCard key={car.id} car={car} />)}
                </div>
            ) : (
                <p className="text-center mt-8 text-gray-500">Brak dostępnych samochodów w tej chwili.</p>
            )}
        </div>
    );
};
export default CarsPage;