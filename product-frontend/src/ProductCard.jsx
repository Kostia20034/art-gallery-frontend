import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, Edit2, Check, X } from "lucide-react"

function ProductCard({ id, name, price, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState(name)
    const [newPrice, setNewPrice] = useState(price)

    if (editing) {
        return (
            <motion.div
                layout
                className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-sm"
            >
                <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    autoFocus
                />
                <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            onUpdate(id, newName, newPrice)
                            setEditing(false)
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                        <Check size={16} />
                        Save
                    </button>
                    <button
                        onClick={() => setEditing(false)}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            layout
            whileHover={{ y: -4, shadow: "lg" }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Product icon placeholder */}
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📦</span>
            </div>

            <h2 className="font-semibold text-gray-900 text-lg mb-1">{name}</h2>
            <p className="text-indigo-600 font-bold text-xl mb-4">${price}</p>

            <div className="flex gap-2">
                <button
                    onClick={() => setEditing(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    <Edit2 size={14} />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-red-100 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                    <Trash2 size={14} />
                    Delete
                </button>
            </div>
        </motion.div>
    )
}

export default ProductCard