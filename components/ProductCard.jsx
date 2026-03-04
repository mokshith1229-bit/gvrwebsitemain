
import React from 'react';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    // Normalize properties to handle both data sources
    const productId = product.id || product._id;
    const category = product.category || 'Specialty';
    const rating = product.rating || 5;
    // Format weight: backend sends a number (e.g. 250), display as "250g"
    const weight = product.weight ? `${product.weight}g` : null;
    // thumbnailUrl is pre-resolved by Redux productSlice (from backend `thumbnail` field)
    const imageUrl = product.thumbnailUrl || null;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full">
            <div
                className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
                onClick={() => onViewDetails(productId)}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        // onError: if the image fails to load (e.g., deleted from server),
                        // hide the broken img tag and let the parent show the placeholder
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <span className="text-4xl">🥜</span>
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                        {category}
                    </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white text-stone-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Quick View
                    </span>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3
                        className="font-serif text-lg font-bold text-stone-800 group-hover:text-amber-700 transition-colors cursor-pointer"
                        onClick={() => onViewDetails(productId)}
                    >
                        {product.name}
                    </h3>
                    <span className="font-bold text-amber-700">₹{product.price}</span>
                </div>

                <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-1">
                    {product.description}
                </p>

                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-stone-300'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    {weight && <span className="text-xs text-stone-400">({weight})</span>}
                </div>

                {/* Stock Display Logic */}
                {product.stock !== undefined && (
                    <div className="mb-3">
                        {product.stock > 0 ? (
                            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                In stock: {product.stock}
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                                Out of stock
                            </span>
                        )}
                    </div>
                )}

                <button
                    onClick={() => onAddToCart({ ...product, id: productId })}
                    className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors active:scale-95 duration-200"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
