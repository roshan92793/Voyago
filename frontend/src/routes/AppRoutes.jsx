import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

// Pages
import Home              from '../pages/Home/Home';
import Explore           from '../pages/Explore/Explore';
import DestinationDetails from '../pages/DestinationDetails/DestinationDetails';
import Login             from '../pages/Login/Login';
import Register          from '../pages/Register/Register';
import Profile           from '../pages/Profile/Profile';
import Wishlist          from '../pages/Wishlist/Wishlist';
import MyTrips           from '../pages/MyTrips/MyTrips';
import TripPlanner       from '../pages/TripPlanner/TripPlanner';
import Reviews           from '../pages/Reviews/Reviews';
import Admin             from '../pages/Admin/Admin';
import NotFound          from '../pages/NotFound/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      {/* Public routes */}
      <Route path="/"                    element={<Home />} />
      <Route path="/explore"             element={<Explore />} />
      <Route path="/destination/:id"     element={<DestinationDetails />} />
      <Route path="/login"               element={<Login />} />
      <Route path="/register"            element={<Register />} />
      <Route path="/reviews"             element={<Reviews />} />

      {/* Protected routes */}
      <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/wishlist"    element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/my-trips"    element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
      <Route path="/trip-planner" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
