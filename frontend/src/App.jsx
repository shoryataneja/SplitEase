import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import TripDetails from "./pages/TripDetails";
import Invitations from "./pages/Invitations";
import Landing from "./pages/Landing";
import Trips from "./pages/Trips";
import Profile from "./pages/Profile";



function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Landing />} />


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
  path="/trips"
  element={
    <PrivateRoute>
      <Trips />
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
  <Route
  path="/profile"
  element={
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  }
/>
    
</Routes>

  

    </BrowserRouter>
  );
}

export default App;


