import { Link } from "react-router-dom"

function Navbar({ isAdmin, onLogout }) {
    return (
        <nav className="bg-gradient-to-r from-indigo-950 via-purple-900 to-pink-900 px-6 py-4 flex justify-between items-center shadow-lg">
            
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-white tracking-wide hover:text-pink-300 transition-colors">
                🎨 Solomia's Gallery
            </Link>

            {/* Links */}
            <div className="flex items-center gap-6">
                <Link
                    to="/"
                    className="text-purple-200 hover:text-white transition-colors font-medium"
                >
                    Gallery
                </Link>

                {isAdmin && (
                    <Link
                        to="/admin"
                        className="text-purple-200 hover:text-white transition-colors font-medium"
                    >
                        Admin
                    </Link>
                )}

                <button
                    onClick={onLogout}
                    className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar