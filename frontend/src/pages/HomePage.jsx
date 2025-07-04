
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import CarCard from '../components/CarCard';

const HomePage = () => {
    const [featuredCars, setFeaturedCars] = useState([]);

    useEffect(() => {
        
        const fetchFeaturedCars = async () => {
            try {
                const res = await api.get('/cars?limit=3');
                setFeaturedCars(res.data);
            } catch (error) {
                console.error("Nie udało się pobrać polecanych samochodów", error);
            }
        };
        fetchFeaturedCars();
    }, []);

    return (
        <div className="space-y-16">
            {/* --- Sekcja Hero --- */}
            <div className="relative text-center bg-gray-800 text-white py-24 px-6 rounded-lg overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/3156482/pexels-photo-3156482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
                ></div>
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Twoja podróż zaczyna się tutaj</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Znajdź i wynajmij idealny samochód w kilku prostych krokach. Bezpiecznie, szybko i bezproblemowo.
                    </p>
                    <Link to="/cars" className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                        Zobacz Dostępne Samochody
                    </Link>
                </div>
            </div>

            {/* --- Sekcja Polecane Oferty --- */}
            {featuredCars.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-center mb-8">Polecane Oferty</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;