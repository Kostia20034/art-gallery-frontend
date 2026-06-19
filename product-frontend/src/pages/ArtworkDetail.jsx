import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API_URL from "../config"

function ArtworkDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [artwork, setArtwork] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/api/v1/artworks/${id}`)
            .then(r => r.json())
            .then(data => {
                setArtwork(data)
                setLoading(false)
            })
    }, [id])

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-950">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"/>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-8">

            {/* Back button */}
            <button
                onClick={() => navigate("/")}
                className="text-purple-300 hover:text-white mb-6 flex items-center gap-2 transition-colors"
            >
                ← Back to Gallery
            </button>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Big image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-900">
                    <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center gap-6">
                    <h1 className="text-4xl font-bold text-white">
                        {artwork.title}
                    </h1>

                    <p className="text-gray-300 text-lg leading-relaxed">
                        {artwork.description}
                    </p>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 rounded-xl p-4 border border-purple-900">
                            <p className="text-purple-400 text-sm mb-1">Category</p>
                            <p className="text-white font-medium">{artwork.category}</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 border border-purple-900">
                            <p className="text-purple-400 text-sm mb-1">Medium</p>
                            <p className="text-white font-medium">{artwork.medium}</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 border border-purple-900">
                            <p className="text-purple-400 text-sm mb-1">Price</p>
                            <p className="text-white font-medium">${artwork.price}</p>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 border border-purple-900">
                            <p className="text-purple-400 text-sm mb-1">Status</p>
                            <p className={artwork.available
                                ? "text-green-400 font-medium"
                                : "text-red-400 font-medium"}>
                                {artwork.available ? "Available" : "Sold"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtworkDetail