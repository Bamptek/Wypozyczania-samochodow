import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const BookingCancelledPage = () => {
  return (
    <div className="text-center py-20 bg-white rounded-lg shadow-xl">
      <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800">Rezerwacja Anulowana</h1>
      <p className="text-xl text-gray-600 mt-4">Twoja rezerwacja została pomyślnie anulowana.</p>
      <Link to="/" className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
        Wróć na stronę główną
      </Link>
    </div>
  );
};

export default BookingCancelledPage;