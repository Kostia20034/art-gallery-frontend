import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API_URL from "../config"

function ArtworkDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [artwork, setArtwork] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadArtwork = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/artworks/${id}`)
                const data = await response.json()
                setArtwork(data)
            } catch (error) {
                console.error("Error loading artwork", error)
            } finally {
                setLoading(false)
            }
        }

        loadArtwork()
    }, [id])

    if (loading) return (
        <div className="flex justify-center items-center min-h-[70vh] bg-transparent">
            <div className="flex flex-col items-center gap-4 text-white">
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-purple-200 tracking-wide">Loading artwork details...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen px-6 py-8">
            <button
                onClick={() => navigate("/")}
                className="text-purple-200 hover:text-white mb-6 flex items-center gap-2 transition-colors"
            >
                ← Back to Gallery
            </button>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-purple-900/50 bg-slate-900/70">
                    <img
                        src={artwork?.imageUrl}
                        alt={artwork?.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white">{artwork?.title}</h1>
                        <p className="text-sm uppercase tracking-[0.3em] text-purple-300 mt-3">Featured artwork</p>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        {artwork?.description || "No description available for this piece yet."}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/70 rounded-2xl p-4 border border-purple-900/50">
                            <p className="text-purple-400 text-sm mb-1">Category</p>
                            <p className="text-white font-medium">{artwork?.category}</p>
                        </div>
                        <div className="bg-slate-900/70 rounded-2xl p-4 border border-purple-900/50">
                            <p className="text-purple-400 text-sm mb-1">Featured</p>
                            <p className={artwork?.featured ? "text-emerald-400 font-medium" : "text-slate-300 font-medium"}>
                                {artwork?.featured ? "Highlighted piece" : "Standard gallery entry"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtworkDetail