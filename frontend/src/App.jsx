import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import TripDetails from "./pages/TripDetails";
import Invitations from "./pages/Invitations";



function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} />

  <Route path="/login" element={<Login />} />
  
  <Route path="/signup" element={<Signup />} />

  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
  <Route
  path="/invitations"
  element={
    <PrivateRoute>
      <Invitations />
    </PrivateRoute>
  }
/>


  <Route
    path="/trips/:tripId"
    element={
      <PrivateRoute>
        <TripDetails />
      </PrivateRoute>
    }
  />
</Routes>

      

    </BrowserRouter>
  );
}

export default App;
