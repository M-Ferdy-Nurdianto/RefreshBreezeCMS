import { motion, AnimatePresence } from 'framer-motion'
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaChevronRight, FaUniversity } from 'react-icons/fa'

const CartSidebar = ({ 
  cart, 
  merchCart, 
  updateQuantity, 
  removeFromCart, 
  updateMerchQuantity, 
  removeFromMerchCart, 
  updateMerchSize, 
  totalHarga, 
  totalMerchHarga, 
  onCheckout 
}) => {
  const hasItems = cart.length > 0 || merchCart.length > 0

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-32 space-y-6">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/5 border border-emerald-50/50 relative overflow-hidden group">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#079108] rounded-2xl flex items-center justify-center shadow-lg shadow-[#079108]/20">
                    <FaShoppingCart className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Your Cart</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {cart.length + merchCart.length} Items Selected
                    </p>
                  </div>
               </div>
            </div>

            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {/* Cheki Items */}
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 group/item"
                  >
                     <div className="w-16 h-16 rounded-2xl bg-gray-50 p-2 border border-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{item.name}</h4>
                        <p className="text-xs font-bold text-[#079108]">IDR {item.price.toLocaleString()}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                           <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                              >
                                <FaMinus className="text-[8px]" />
                              </button>
                              <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                              >
                                <FaPlus className="text-[8px]" />
                              </button>
                           </div>
                           <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                           >
                              <FaTrash className="text-xs" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
                ))}

                {/* Merch Items */}
                {merchCart.map((item) => (
                  <motion.div 
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 group/item"
                  >
                     <div className="w-16 h-16 rounded-2xl bg-gray-50 p-2 border border-gray-100 flex-shrink-0">
                        {item.gambar_url ? (
                          <img src={item.gambar_url} alt={item.nama} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-200">🛍️</div>
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{item.nama}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#079108]">IDR {item.harga.toLocaleString()}</p>
                          {item.size && <span className="text-[10px] font-black bg-gray-100 px-1.5 py-0.5 rounded uppercase">{item.size}</span>}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                           <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                              <button onClick={() => updateMerchQuantity(item.cartId, -1)} className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"><FaMinus className="text-[8px]" /></button>
                              <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                              <button onClick={() => updateMerchQuantity(item.cartId, 1)} className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center transition-colors"><FaPlus className="text-[8px]" /></button>
                           </div>
                           <button onClick={() => removeFromMerchCart(item.cartId)} className="text-gray-300 hover:text-red-500 transition-colors"><FaTrash className="text-xs" /></button>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!hasItems && (
                <div className="py-12 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                      <FaShoppingCart className="text-2xl" />
                   </div>
                   <p className="text-gray-400 font-bold text-sm">Your cart is empty</p>
                </div>
              )}
            </div>

            {hasItems && (
              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                    <span className="text-2xl font-black text-gray-900">IDR {(totalHarga + totalMerchHarga).toLocaleString()}</span>
                 </div>
                 
                 <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCheckout}
                    className="w-full bg-[#079108] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#079108]/20 flex items-center justify-center gap-3 group"
                 >
                    Checkout Now
                    <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
                 </motion.button>

                 <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    <FaUniversity className="text-[#079108]" />
                    Secure Payment via Bank Transfer
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSidebar
