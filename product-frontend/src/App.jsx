import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import Auth from "./Auth"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Plus, LogOut } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import API_URL from "./config"

function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm animate-pulse flex justify-between items-start">
            <div className="w-full">
                {/* Fake icon box */}
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                {/* Fake name strip */}
                <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-3"></div>
                {/* Fake price strip */}
                <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    )
}

function App() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [search, setSearch] = useState("")
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // reusable function
    const authHeader = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    })

    useEffect(() => {
        setLoading(true)
        fetch(`${API_URL}/api/v1/products?page=${currentPage}&size=10`)
            .then(r => r.json())
            .then(data => {
                setProducts(data.content)
                setTotalPages(data.totalPages)
                setTimeout(() => {
                    //check if skeleon works
                setLoading(false) // Turns off after 2000 milliseconds
            }, 500)
            })
    }, [currentPage])

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken)  // save to localStorage
        setToken(newToken)
        toast.success("Welcome back!! 🤴")
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        setToken(null)
        toast.success("Logged out successfully")
    }

    const deleteProduct = (id) => {
        fetch(`${API_URL}/api/v1/products/${id}`, {
            method: "DELETE",
            headers: authHeader()  // ← send token
        })
        .then(() => {
            setProducts(products.filter(p => p.id !== id))
            toast.success("Product deleted!! 👌")
        })
        .catch(() => toast.error("Failed to delete product"))
    }

    const createProduct = () => {
        if (!name || !price) {
            toast.error("Please fill in all fields")
            return
        }
        fetch(`${API_URL}/api/v1/products`, {
            method: "POST",
            headers: authHeader(),  // ← send token
            body: JSON.stringify({ name, price })
        })
        .then(r => r.json())
        .then(newProduct => {
            setProducts([...products, newProduct])
            setName("")
            setPrice("")
            toast.success("Product created!! 🎉")
        })
        .catch(() => toast.error("Failed to create product"))
    }

    const updateProduct = (id, name, price) => {
        fetch(`${API_URL}/api/v1/products/${id}`, {
            method: "PUT",
            headers: authHeader(),  // ← send token
            body: JSON.stringify({ name, price })
        })
        .then(r => r.json())
        .then(updated => {
            setProducts(products.map(p => p.id === id ? updated : p))
            toast.success("Product updated!!")
        })
        .catch(() => toast.error("Failed to update product"))
    }

    const searchProducts = () => {
        if (!search) {
            toast.error("Enter a search term")
            return
        }
        fetch(`${API_URL}/api/v1/products/search?name=${search}&page=0&size=5`)
            .then(r => r.json())
            .then(data => {setProducts(data.content)
                           setTotalPages(data.totalPages)
            if (data.content.length === 0) toast.error("No products found")
                else toast.success(`Found ${data.content.length} products!!`)
            })
    }
    const clearSearch = () => {
        setSearch("")
        setCurrentPage(0)
        fetch(`${API_URL}/api/v1/products?page=0&size=10`)
            .then(r => r.json())
            .then(data => {
                setProducts(data.content)
                setTotalPages(data.totalPages)
            })
    }

    // not logged in → show auth form
    if (!token) return <Auth onLogin={handleLogin} />

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster position="top-right" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">ProductHub</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Search bar */}
                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && searchProducts()}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                    <button
                        onClick={searchProducts}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Search
                    </button>
                    {search && (
                        <button
                            onClick={clearSearch}
                            className="flex items-center gap-1 text-gray-500 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    )}
                </div>

                {/* Create form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-indigo-600" />
                        Add New Product
                    </h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Product name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && createProduct()}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && createProduct()}
                            className="w-36 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={createProduct}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add
                        </button>
                    </div>
                </div>

                {loading ? (
                    //Render 6 animated skeleton cards
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    //Show empty state
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products yet</h3>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductCard
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        onDelete={deleteProduct}
                                        onUpdate={updateProduct}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            ← Previous
                        </button>
                        <span className="text-gray-500 text-sm font-medium">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App