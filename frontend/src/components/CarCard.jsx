
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 border">
        <img 
          src={car.imageUrl || 'https://via.placeholder.com/400x250?text=Brak+Zdjecia'} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-56 object-cover" 
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800">{car.make} {car.model}</h3>
          <p className="text-gray-600">Rocznik: {car.year}</p>
          <p className="text-gray-500 text-sm">Rejestracja: {car.licensePlate}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-blue-600">{car.pricePerDay} PLN/dzień</span>
            <Link to={`/cars/${car.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold">
              Szczegóły
            </Link>
          </div>
        </div>
      </div>
    );
};
export default CarCard;