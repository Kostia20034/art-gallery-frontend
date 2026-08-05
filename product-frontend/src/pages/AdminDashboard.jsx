import { useState, useEffect } from "react";
import API_URL from "../config";

function AdminDashboard({ token }) {

    // =========================
    // CONTACT MESSAGES STATE
    // =========================
    const [messages, setMessages] = useState([]);
    const [showMessages, setShowMessages] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // =========================
    // DATA STATE
    // =========================
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // =========================
    // TOAST NOTIFICATION STATE
    // =========================
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 3000);
    };

    const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    // =========================
    // MODAL STATE
    // =========================
    const [showEditor, setShowEditor] = useState(false);
    const [editingArtwork, setEditingArtwork] = useState(null);

    // =========================
    // FORM STATE
    // =========================
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("LANDSCAPE");
    const [featured, setFeatured] = useState(false);

    const fetchMessages = async () => {
    try {
        setLoadingMessages(true);
        const response = await fetch(`${API_URL}/api/v1/contact`, {
            headers: requestHeaders
        });
        const data = await response.json();
        setMessages(data || []);
    } catch (error) {
        console.error("Error fetching messages:", error);
        showToast("Failed to load messages", "error");
    } finally {
        setLoadingMessages(false);
    }
};

    const openMessages = () => {
        setShowMessages(true);
        fetchMessages();
    };

    // =========================
    // FETCH OPERATION
    // =========================
    const fetchArtworks = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/v1/artworks?page=${currentPage}&size=10`
            );
            const data = await response.json();
            setArtworks(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching artworks:", error);
            showToast("Failed to load artworks", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, [currentPage]);

    // =========================
    // MODE SWITCHERS (CREATE / EDIT)
    // =========================
    const openCreate = () => {
        setEditingArtwork(null);
        setTitle("");
        setDescription("");
        setImageUrl("");
        setCategory("LANDSCAPE");
        setFeatured(false);
        setShowEditor(true);
    };

    const openEdit = (artwork) => {
        setEditingArtwork(artwork);
        setTitle(artwork.title);
        setDescription(artwork.description);
        setImageUrl(artwork.imageUrl);
        setCategory(artwork.category);
        setFeatured(artwork.featured);
        setShowEditor(true);
    };

    // =========================
    // SAVE OPERATION (POST / PUT)
    // =========================
    const saveArtwork = async () => {
        if (!title || !imageUrl) {
            showToast("Please fill in required fields (Title and Image URL)", "error");
            return;
        }

        const artworkData = {
            title,
            description,
            imageUrl,
            category,
            featured
        };

        try {
            if (editingArtwork) {
                await fetch(
                    `${API_URL}/api/v1/artworks/${editingArtwork.id}`,
                    {
                        method: "PUT",
                        headers: requestHeaders,
                        body: JSON.stringify(artworkData)
                    }
                );
                showToast("Artwork updated successfully!");
            } else {
                console.log("token:", token)
                await fetch(
                    `${API_URL}/api/v1/artworks`,
                    {
                        method: "POST",
                        headers: requestHeaders,
                        body: JSON.stringify(artworkData)
                    }
                );
                showToast("New artwork added successfully!");
            }

            setShowEditor(false);
            setEditingArtwork(null);
            await fetchArtworks();
        } catch (error) {
            console.error("Error saving artwork:", error);
            showToast("Failed to save artwork", "error");
        }
    };

    // =========================
    // DELETE OPERATION
    // =========================
    const deleteArtwork = async (id) => {
        if (!window.confirm("Are you sure you want to delete this artwork?")) {
            return;
        }

        try {
            await fetch(
                `${API_URL}/api/v1/artworks/${id}`,
                {
                    method: "DELETE",
                    headers: requestHeaders
                }
            );
            showToast("Artwork deleted successfully!");
            await fetchArtworks();
        } catch (error) {
            console.error("Error deleting artwork:", error);
            showToast("Failed to delete artwork", "error");
        }
    };

    return (
        <div className="max-w-7xl mx-auto relative">

            {/* =========================
                CUSTOM TOAST NOTIFICATION
               ========================= */}
            {toast.show && (
                <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-xl shadow-2xl transition-all duration-300 border backdrop-blur-md ${toast.type === "error"
                    ? "bg-rose-950/80 border-rose-500 text-rose-200"
                    : "bg-fuchsia-950/80 border-fuchsia-500 text-fuchsia-200"
                    }`}>
                    <div className="text-sm font-semibold tracking-wide">{toast.message}</div>
                </div>
            )}

            {/* HEADER AREA */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Manage gallery listings, edit information, and review catalog</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={openMessages}
                        className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-0.5"
                    >
                        ✉ Messages
                    </button>

                    <button
                        onClick={openCreate}
                        className="cursor-pointer bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-900/30 transition duration-300 transform hover:-translate-y-0.5"
                    >
                        + Add New Artwork
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* =========================
                    THE MODAL / FORM EDITOR
                   ========================= */}
                {showEditor && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-purple-950/50">

                            {/* Modal Banner */}
                            <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 px-6 py-4 border-b border-purple-500/20">
                                <h3 className="text-xl font-bold text-white">
                                    {editingArtwork ? "⚡ Edit Artwork Details" : "🌟 Add New Catalog Entry"}
                                </h3>
                            </div>

                            {/* Form Inputs Grid */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
                                        placeholder="Artwork Title"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition resize-none"
                                        placeholder="Write an insightful narrative for this piece..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Image URL *</label>
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
                                    >
                                        <option value="LANDSCAPE">Landscape</option>
                                        <option value="ANIMALS">Animals</option>
                                        <option value="PORTRAIT">Portrait</option>
                                        <option value="ABSTRACT">Abstract</option>
                                        <option value="STILL_LIFE">Still Life</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-start bg-slate-950 border border-slate-800 rounded-lg p-3">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={featured}
                                            onChange={(e) => setFeatured(e.target.checked)}
                                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700 accent-fuchsia-500"
                                        />
                                        Featured on the gallery
                                    </label>
                                </div>
                            </div>

                            {/* Modal Actions Footer */}
                            <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveArtwork}
                                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-purple-950"
                                >
                                    Save Changes
                                </button>
                            </div>

                        </div>
                    </div>
                )}
                {showMessages && (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-purple-950/50">

            <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 px-6 py-4 border-b border-purple-500/20 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">✉ Contact Messages</h3>
                <button
                    onClick={() => setShowMessages(false)}
                    className="cursor-pointer text-slate-300 hover:text-white text-2xl leading-none"
                >
                    &times;
                </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                {loadingMessages ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-slate-400 text-sm">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-8">No messages yet.</p>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold text-slate-200">{msg.name}</p>
                                    <p className="text-xs text-indigo-300">{msg.email}</p>
                                </div>
                                {msg.createdAt && (
                                    <span className="text-[11px] text-slate-500 whitespace-nowrap">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex justify-end">
                <button
                    onClick={() => setShowMessages(false)}
                    className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-medium transition"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

                {/* =========================
                    THE ARTWORKS DATA TABLE
                   ========================= */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-medium">Syncing database inventory...</p>
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wider font-bold">
                                        <th className="py-4 px-6">Preview</th>
                                        <th className="py-4 px-6">Title</th>
                                        <th className="py-4 px-6">Category</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {artworks.map((artwork) => (
                                        <tr key={artwork.id} className="hover:bg-slate-850/40 transition duration-150">
                                            <td className="py-4 px-6">
                                                <div className="relative group w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                                                    <img
                                                        src={artwork.imageUrl}
                                                        alt={artwork.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                                        onError={(e) => { e.target.src = "https://via.placeholder.com/80" }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-200 max-w-xs truncate">
                                                {artwork.title}
                                                <div className="flex gap-1.5 mt-1">
                                                    {artwork.featured && (
                                                        <span className="text-[10px] bg-pink-950/60 border border-pink-700/50 text-pink-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                                            ★ Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-indigo-300 font-medium">
                                                <span className="bg-indigo-950/40 border border-indigo-900/60 px-2.5 py-1 rounded-md">
                                                    {artwork.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => openEdit(artwork)}
                                                    className="cursor-pointer bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-900/60 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteArtwork(artwork.id)}
                                                    className="cursor-pointer bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {artworks.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-slate-500 text-sm">
                                                No artworks found in this segment.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* =========================
                    PAGINATION BAR
                   ========================= */}
                <div className="flex justify-between items-center mt-6 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="cursor-pointer px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
                    >
                        ← Previous
                    </button>

                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                        Segment <span className="text-purple-400 font-mono text-sm">{currentPage + 1}</span> of <span className="text-slate-200 font-mono text-sm">{totalPages || 1}</span>
                    </span>

                    <button
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="cursor-pointer px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;