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
        //setLoading(true)
        fetch(`${API_URL}/api/v1/artworks?page=${currentPage}&size=6`)
            .then(r => r.json())
            .then(data => {
                setArtworks(data.content)
                setTotalPages(data.totalPages)
                setLoading(false)
            })
    }, [currentPage])

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-950">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"/>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
                Art Collection
            </h1>

            {/* Artwork grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {artworks.map(artwork => (
                    <div
                        key={artwork.id}
                        onClick={() => navigate(`/artwork/${artwork.id}`)}
                        className="bg-gray-900 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-lg border border-purple-900"
                    >
                        <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-white font-semibold text-lg mb-2">
                                {artwork.title}
                            </h2>
                            <span className="bg-purple-900 text-purple-200 text-xs px-3 py-1 rounded-full">
                                {artwork.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-10">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-6 py-2 rounded-xl bg-purple-900 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Previous
                    </button>
                    <span className="text-purple-300 font-medium">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages - 1}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-6 py-2 rounded-xl bg-purple-900 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    )
}

export default Gallery