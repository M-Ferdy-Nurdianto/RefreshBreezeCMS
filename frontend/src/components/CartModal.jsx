import { FaTimes } from 'react-icons/fa'

const CartModal = ({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout, total }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-custom-cream rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
          <h3 className="font-bold text-xl text-custom-green flex items-center gap-2">
            <i className="fas fa-shopping-cart"></i> Keranjang
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="overflow-y-auto p-5 space-y-4 flex-grow custom-scrollbar min-h-[100px]">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-shopping-cart fa-3x mb-4"></i>
              <p>Keranjang Kosong</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-3 pt-2">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-custom-green">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQuantity(index, 'decrease')}
                    className="w-6 h-6 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(index, 'increase')}
                    className="w-6 h-6 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 ml-3 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total Estimasi</span>
            <span className="text-xl font-extrabold text-custom-green">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full bg-custom-green text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span>Lanjut Pembayaran</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartModal
