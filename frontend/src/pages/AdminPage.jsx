import { useState, useEffect } from 'react';
import api from '../api';


const EditCarModal = ({ car, onClose, onCarUpdated }) => {
    const [formData, setFormData] = useState({ ...car });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/admin/cars/${car.id}`, formData);
            onCarUpdated();
            onClose();
        } catch (err) {
            alert("Błąd podczas aktualizacji: " + (err.response?.data?.message || ''));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edytuj Samochód</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input name="make" value={formData.make} onChange={handleChange} placeholder="Marka" className="w-full p-3 border rounded-lg" required />
                        <input name="model" value={formData.model} onChange={handleChange} placeholder="Model" className="w-full p-3 border rounded-lg" required />
                        <input name="year" value={formData.year} onChange={handleChange} placeholder="Rocznik" type="number" className="w-full p-3 border rounded-lg" required />
                        <input name="licensePlate" value={formData.licensePlate} onChange={handleChange} placeholder="Numer rejestracyjny" className="w-full p-3 border rounded-lg" required />
                        <input name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} placeholder="Cena za dzień" type="number" step="0.01" className="w-full p-3 border rounded-lg" required />
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL obrazka" className="w-full p-3 border rounded-lg col-span-2" />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Anuluj</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Zapisz zmiany</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminPage = () => {
    const [addCarFormData, setAddCarFormData] = useState({ make: '', model: '', year: '', licensePlate: '', pricePerDay: '', imageUrl: '' });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [allCars, setAllCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);

    const fetchAllCars = async () => {
        try {
            const res = await api.get('/admin/cars');
            setAllCars(res.data);
        } catch (err) {
            console.error("Błąd pobierania aut dla admina", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCars();
    }, []);

    const handleAddFormChange = (e) => setAddCarFormData({ ...addCarFormData, [e.target.name]: e.target.value });

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        try {
            await api.post('/admin/cars', addCarFormData);
            setFormSuccess('Samochód został pomyślnie dodany!');
            setAddCarFormData({ make: '', model: '', year: '', licensePlate: '', pricePerDay: '', imageUrl: '' });
            fetchAllCars();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Wystąpił błąd.');
        }
    };

    const handleStatusChange = async (carId, newStatus) => {
        try {
            await api.patch(`/admin/cars/${carId}/status`, { status: newStatus });
            fetchAllCars();
        } catch (err) {
            alert("Nie udało się zaktualizować statusu.");
        }
    };

    const handleOpenEditModal = (car) => {
        setEditingCar(car);
        setIsModalOpen(true);
    };

    const handleDeleteCar = async (carId) => {
        if (window.confirm('Czy na pewno chcesz trwale usunąć ten samochód? Tej operacji nie można cofnąć.')) {
            try {
                await api.delete(`/admin/cars/${carId}`);
                fetchAllCars();
            } catch (err) {
                alert("Błąd: " + (err.response?.data?.message || 'Nie udało się usunąć samochodu.'));
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10">
            {isModalOpen && <EditCarModal car={editingCar} onClose={() => setIsModalOpen(false)} onCarUpdated={fetchAllCars} />}
            <h1 className="text-3xl font-bold mb-6">Panel Administratora</h1>
            
            <form onSubmit={handleAddFormSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-2xl font-bold mb-4">Dodaj Nowy Samochód</h2>
                {formError && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{formError}</p>}
                {formSuccess && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">{formSuccess}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input name="make" value={addCarFormData.make} onChange={handleAddFormChange} placeholder="Marka" className="w-full p-3 border rounded-lg" required />
                    <input name="model" value={addCarFormData.model} onChange={handleAddFormChange} placeholder="Model" className="w-full p-3 border rounded-lg" required />
                    <input name="year" value={addCarFormData.year} onChange={handleAddFormChange} placeholder="Rocznik" type="number" className="w-full p-3 border rounded-lg" required />
                    <input name="licensePlate" value={addCarFormData.licensePlate} onChange={handleAddFormChange} placeholder="Numer rejestracyjny" className="w-full p-3 border rounded-lg" required />
                    <input name="pricePerDay" value={addCarFormData.pricePerDay} onChange={handleAddFormChange} placeholder="Cena za dzień" type="number" step="0.01" className="w-full p-3 border rounded-lg" required />
                    <input name="imageUrl" value={addCarFormData.imageUrl} onChange={handleAddFormChange} placeholder="URL obrazka" className="w-full p-3 border rounded-lg col-span-2" />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold">Dodaj Samochód</button>
            </form>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Zarządzaj Flotą</h2>
                {loading ? <p>Ładowanie...</p> : (
                    <div className="space-y-4">
                        {allCars.map(car => (
                            <div key={car.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <img src={car.imageUrl} alt={car.make} className="w-24 h-16 object-cover rounded" />
                                    <div>
                                        <p className="font-bold">{car.make} {car.model} ({car.year})</p>
                                        <p className="text-sm text-gray-600">{car.licensePlate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <select onChange={(e) => handleStatusChange(car.id, e.target.value)} value={car.status} className="p-2 border rounded">
                                        <option value="AVAILABLE">AVAILABLE</option>
                                        <option value="RENTED">RENTED</option>
                                        <option value="UNAVAILABLE">UNAVAILABLE</option>
                                    </select>
                                    <button onClick={() => handleOpenEditModal(car)} className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm">Edytuj</button>
                                    <button onClick={() => handleDeleteCar(car.id)} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm">Usuń</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;