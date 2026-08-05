import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Router components for navigation
import { useState } from "react"; // hook for managing state in functional components
import Gallery from "./pages/Gallery";
import ArtworkDetail from "./pages/ArtworkDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./Auth";
import Contact from "./pages/Contact";
import Navbar from "./Navbar";

const getRoleFromToken = (token) => {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role;
    } catch {
        return null;
    }
};

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const role = getRoleFromToken(token);
    const isAdmin = (role === "ROLE_ADMIN");

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const backgroundClass = "min-h-screen w-full bg-gradient-to-tr from-cyan-500 via-blue-600 via-purple-600 to-pink-500 text-slate-100 font-sans antialiased selection:bg-pink-500/30";

    // 1. If not authenticated, wrap the Auth form in the background layout
    if (!token) {
        return (
            <div className={backgroundClass}>
                <Auth onLogin={handleLogin} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className={backgroundClass}>
                
                <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
                
                <main className="p-6 md:p-10">
                    <Routes>
                        <Route path="/" element={<Gallery />} />
                        <Route path="/artwork/:id" element={<ArtworkDetail />} />
                        <Route path="/contact" element={
                            !isAdmin ? <Contact /> : <Navigate to="/" />
                        } />
                        <Route path="/admin" element={
                            isAdmin ? <AdminDashboard token={token} /> : <Navigate to="/" />
                        } />
                        
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}

export default App;