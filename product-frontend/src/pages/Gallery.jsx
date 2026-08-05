import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../config"

function Gallery() {
    const [artworks, setArtworks] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const loadArtworks = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${API_URL}/api/v1/artworks?page=${currentPage}&size=6`)
                const data = await response.json()
                setArtworks(data.content || [])
                setTotalPages(data.totalPages || 0)
            } catch (error) {
                console.error("Error loading artworks", error)
                setArtworks([])
            } finally {
                setLoading(false)
            }
        }

        loadArtworks()
    }, [currentPage])

    if (loading) return (
        <div className="flex justify-center items-center min-h-[70vh] bg-transparent">
            <div className="flex flex-col items-center gap-4 text-white">
                <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-purple-200 tracking-wide">Loading the collection...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Art Collection</h1>
                    <p className="text-purple-200/80 mt-2">Discover standout pieces from the gallery catalog</p>
                </div>

                {artworks.length === 0 ? (
                    <div className="rounded-3xl border border-purple-900/50 bg-slate-900/70 p-10 text-center text-slate-300 shadow-xl">
                        <p className="text-lg font-semibold">No artworks are available right now.</p>
                        <p className="text-sm text-slate-400 mt-2">Please check back soon or refresh the collection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {artworks.map(artwork => (
                            <div
                                key={artwork.id}
                                onClick={() => navigate(`/artwork/${artwork.id}`)}
                                className="group bg-slate-900/80 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-xl border border-purple-900/50"
                            >
                                <img
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="p-4">
                                    <h2 className="text-white font-semibold text-lg mb-2">{artwork.title}</h2>
                                    <div className="flex items-center justify-between">
                                        <span className="bg-purple-900/70 text-purple-200 text-xs px-3 py-1 rounded-full">
                                            {artwork.category}
                                        </span>
                                        <span className="text-slate-400 text-sm">View details</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-6 mt-10">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-6 py-2 rounded-xl bg-purple-900/80 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Previous
                        </button>
                        <span className="text-purple-200 font-medium">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-6 py-2 rounded-xl bg-purple-900/80 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Gallery