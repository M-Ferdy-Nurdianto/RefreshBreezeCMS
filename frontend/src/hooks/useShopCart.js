import { useState } from 'react'
import { toast } from 'react-toastify'
import { getMemberEmoji } from '../lib/memberUtils'

export const useShopCart = (hargaMember, hargaGrup) => {
  const [cart, setCart] = useState([])
  const [merchCart, setMerchCart] = useState([])

  // --- Cheki Cart Logic ---
  const addToCart = (type, member = null, getMemberImage) => {
    const isGroup = type === 'group'
    const imageUrl = isGroup ? '/images/members/group.webp' : getMemberImage(member)
    
    const item = {
      id: isGroup ? 'group' : member.id,
      member_id: isGroup ? 'group' : member.id,
      name: isGroup ? 'Cheki Group' : `Cheki ${member.nama_panggung}`,
      price: isGroup ? hargaGrup : hargaMember,
      quantity: 1,
      image: imageUrl
    }

    const existing = cart.find(i => i.id === item.id)
    const newQty = existing ? existing.quantity + 1 : 1
    
    const toastId = `cart-${item.id}`
    const toastContent = (
      <div className="flex items-center gap-4 px-6 py-3 bg-gray-900/95 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px]">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/5">
          {isGroup ? '✨' : getMemberEmoji(member.id)}
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 leading-none mb-1.5">Added to Cart</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-white whitespace-nowrap">{item.name}</p>
            <span className="text-white/40 text-[10px] font-bold">• {newQty}x</span>
          </div>
        </div>
      </div>
    )

    const toastOptions = {
      toastId,
      position: "bottom-center",
      autoClose: 2500,
      className: "!bg-transparent !p-0 !shadow-none min-h-0",
      bodyClassName: "!p-0 !m-0",
      closeButton: false,
    }

    if (toast.isActive(toastId)) {
      toast.update(toastId, { render: toastContent, ...toastOptions })
    } else {
      toast(toastContent, toastOptions)
    }

    setCart(prev => {
      const existingInPrev = prev.find(i => i.id === item.id)
      if (existingInPrev) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, item]
    })
  }

  const updateQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id)
    if (item && item.quantity === 1 && delta === -1) {
      toast(
        <div className="flex items-center gap-4 px-6 py-3 bg-red-900/90 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px]">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/5">🗑️</div>
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 leading-none mb-1.5">Removed from Cart</p>
            <p className="text-sm font-black text-white whitespace-nowrap">{item.name}</p>
          </div>
        </div>,
        { position: "bottom-center", autoClose: 2000, className: "!bg-transparent !p-0 !shadow-none min-h-0", bodyClassName: "!p-0 !m-0", closeButton: false }
      )
    }

    setCart(prev => {
      const itemInPrev = prev.find(i => i.id === id)
      if (itemInPrev && itemInPrev.quantity === 1 && delta === -1) {
        return prev.filter(i => i.id !== id)
      }
      return prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) }
        }
        return item
      })
    })
  }

  const removeFromCart = (id) => {
    const item = cart.find(i => i.id === id)
    if (item) {
      toast(
        <div className="flex items-center gap-4 px-6 py-3 bg-red-900/90 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px]">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/5">🗑️</div>
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 leading-none mb-1.5">Removed from Cart</p>
            <p className="text-sm font-black text-white whitespace-nowrap">{item.name}</p>
          </div>
        </div>,
        { position: "bottom-center", autoClose: 2000, className: "!bg-transparent !p-0 !shadow-none min-h-0", bodyClassName: "!p-0 !m-0", closeButton: false }
      )
    }
    setCart(prev => prev.filter(item => item.id !== id))
  }

  // --- Merch Cart Logic ---
  const getSizePriceIncrement = (size) => {
    if (!size) return 0;
    const s = size.toUpperCase().trim();
    if (s === 'XXL' || s === '2XL') return 5000;
    if (s === '3XL' || s === 'XXXL') return 10000;
    if (s === '4XL' || s === 'XXXXL') return 15000;
    return 0;
  }

  const addToMerchCart = (item, size = '') => {
    const cartId = size ? `${item.id}-${size}` : item.id
    const existing = merchCart.find(i => i.cartId === cartId)
    const newQty = existing ? existing.quantity + 1 : 1
    const toastId = `merch-${cartId}`
    const toastContent = (
      <div className="flex items-center gap-4 px-6 py-3 bg-gray-900/95 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px]">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/5">🛍️</div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 leading-none mb-1.5">Added to Cart</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-white whitespace-nowrap">{item.nama}{size ? ` (${size})` : ''}</p>
            <span className="text-white/40 text-[10px] font-bold">• {newQty}x</span>
          </div>
        </div>
      </div>
    )
    const toastOptions = { toastId, position: "bottom-center", autoClose: 2500, className: "!bg-transparent !p-0 !shadow-none min-h-0", bodyClassName: "!p-0 !m-0", closeButton: false }
    if (toast.isActive(toastId)) toast.update(toastId, { render: toastContent, ...toastOptions })
    else toast(toastContent, toastOptions)

    setMerchCart(prev => {
      const ex = prev.find(i => i.cartId === cartId)
      if (ex) return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i)
      const baseHarga = item.baseHarga || item.harga;
      const finalHarga = baseHarga + getSizePriceIncrement(size);
      return [...prev, { ...item, baseHarga, harga: finalHarga, quantity: 1, cartId, size }]
    })
  }

  const updateMerchQuantity = (cartId, delta) => {
    setMerchCart(prev => {
      const item = prev.find(i => i.cartId === cartId)
      if (item && item.quantity === 1 && delta === -1) return prev.filter(i => i.cartId !== cartId)
      return prev.map(i => i.cartId === cartId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
    })
  }

  const removeFromMerchCart = (cartId) => setMerchCart(prev => prev.filter(i => i.cartId !== cartId))
  
  const updateMerchSize = (cartId, newSize) => {
    setMerchCart(prev => {
      const existing = prev.find(i => i.cartId === cartId)
      if (!existing) return prev
      const newCartId = newSize ? `${existing.id}-${newSize}` : existing.id
      const duplicate = prev.find(i => i.cartId === newCartId && i.cartId !== cartId)
      if (duplicate) {
        return prev.map(i => {
          if (i.cartId === newCartId) return { ...i, quantity: i.quantity + existing.quantity }
          return i
        }).filter(i => i.cartId !== cartId)
      }
      const newHarga = existing.baseHarga + getSizePriceIncrement(newSize);
      return prev.map(i => i.cartId === cartId ? { ...i, cartId: newCartId, size: newSize, harga: newHarga } : i)
    })
  }

  const totalHarga = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalMerchHarga = merchCart.reduce((sum, i) => sum + (i.harga * i.quantity), 0)

  return {
    cart,
    setCart,
    merchCart,
    setMerchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    addToMerchCart,
    updateMerchQuantity,
    removeFromMerchCart,
    updateMerchSize,
    totalHarga,
    totalMerchHarga
  }
}
