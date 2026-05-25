import { useState } from "react"
import { motion } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import API_URL from "./config"

function Auth({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {
        if (!email || !password) {
            toast.error("Please fill in all fields")
            return
        }
        setLoading(true)
        const url = isRegister
            ? `${API_URL}/api/v1/auth/register`
            : `${API_URL}/api/v1/auth/login`

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(r => r.json())
        .then(data => {
            if (data.token) {
                onLogin(data.token)
            } else {
                toast.error("Invalid email or password")
            }
        })
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setLoading(false))
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">P</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">ProductHub</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {isRegister ? "Create your account" : "Welcome back!!"}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                            Loading...
                        </>
                    ) : (
                        isRegister ? "Create Account" : "Login"
                    )}
                </button>

                <p
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-center text-sm text-indigo-600 cursor-pointer hover:underline mt-4"
                >
                    {isRegister
                        ? "Already have an account? Login"
                        : "Don't have an account? Register"}
                </p>
            </motion.div>
        </div>
    )
}

export default Auth