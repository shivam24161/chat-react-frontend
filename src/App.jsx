import { Routes, Route, HashRouter } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </HashRouter>
      </SocketProvider>
    </AuthProvider>
  );
}