import { useState } from "react"
import { motion } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import API_URL from "./config"

function Auth({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)
        const url = isRegister
            ? `${API_URL}/api/v1/auth/register`
            : `${API_URL}/api/v1/auth/login`

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Authentication failed")
            }

            if (data.token) {
                onLogin(data.token)
                toast.success(isRegister ? "Account created successfully" : "Welcome back")
            } else {
                toast.error("Invalid email or password")
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_45%),linear-gradient(135deg,_#0f172a,_#111827)] flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/30"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white font-bold text-2xl">A</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Art Gallery Portal</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isRegister ? "Create your account to manage the collection" : "Sign in to explore and curate the gallery"}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-colors font-medium mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Please wait...
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