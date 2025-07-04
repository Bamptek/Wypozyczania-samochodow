import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user } = useAuth(); 


  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  const isAuthorized = allowedRoles ? allowedRoles.includes(user?.role) : true;
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;