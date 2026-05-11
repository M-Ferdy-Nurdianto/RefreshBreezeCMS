import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaChevronRight, FaPlus, FaMinus, FaCamera, FaSpinner, 
  FaUniversity, FaRegCopy, FaCheckCircle, FaTrash, 
  FaInstagram, FaDownload 
} from 'react-icons/fa'
import { useState } from 'react'
import DigitalReceipt from './DigitalReceipt'
import imageCompression from 'browser-image-compression'

// --- SHARED SUB-COMPONENTS ---

const InternalPaymentInfo = ({ payment, copyToClipboard, copied }) => (
  <div className="bg-emerald-50/50 rounded-[2rem] p-6 border border-emerald-100 space-y-4 shadow-inner">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Transfer Ke</span>
      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
         <FaUniversity className="text-[#079108] text-[10px]" />
         <span className="text-[10px] font-black text-gray-900">{payment?.bank || 'BCA'}</span>
      </div>
    </div>
    <div className="flex items-center justify-between group cursor-pointer" onClick={() => copyToClipboard(payment?.rekening)}>
      <span className="text-2xl font-black text-gray-900 tracking-tight">{payment?.rekening || '0902683273'}</span>
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-emerald-50 group-hover:bg-[#079108] group-hover:text-white transition-all transform group-active:scale-90">
        {copied ? <FaCheckCircle className="text-sm" /> : <FaRegCopy className="text-sm" />}
      </div>
    </div>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">a.n {payment?.atasNama || 'Natasya Angelina Putri'}</p>
  </div>
)

const InternalCartSummary = ({ items, type, updateQuantity, updateMerchQuantity, removeFromCart, removeFromMerchCart, total }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Pesanan Kamu</h3>
      <span className="text-[10px] font-black px-3 py-1 bg-gray-100 rounded-full text-gray-500 uppercase">{items?.length || 0} Items</span>
    </div>
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {items?.map((item) => (
        <motion.div layout key={item.cartId || item.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
            <img src={item.image || item.gambar_url} alt="Item" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-sm text-gray-900 truncate uppercase tracking-tight">{item.name || item.nama}</h4>
            <p className="text-emerald-600 font-black text-xs">IDR {(item.price || item.harga || 0).toLocaleString()}</p>
            {item.size && <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded text-gray-400">Size: {item.size}</span>}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              <button type="button" onClick={() => type === 'cheki' ? updateQuantity(item.id, -1) : updateMerchQuantity(item.cartId, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"><FaMinus className="text-[8px]" /></button>
              <span className="w-8 text-center font-black text-xs">{item.quantity}</span>
              <button type="button" onClick={() => type === 'cheki' ? updateQuantity(item.id, 1) : updateMerchQuantity(item.cartId, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"><FaPlus className="text-[8px]" /></button>
            </div>
            <button type="button" onClick={() => type === 'cheki' ? removeFromCart(item.id) : removeFromMerchCart(item.cartId)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><FaTrash className="text-xs" /></button>
          </div>
        </motion.div>
      ))}
    </div>
    <div className="pt-6 border-t border-dashed border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Harga</span>
        <span className="text-2xl font-black text-gray-900">IDR {total?.toLocaleString() || 0}</span>
      </div>
    </div>
  </div>
)

// --- MAIN COMPONENT ---

const CheckoutProcess = ({
  step, setStep, cart, merchCart, totalHarga, totalMerchHarga, updateQuantity, removeFromCart,
  updateMerchQuantity, removeFromMerchCart, formData, setFormData, merchForm, setMerchForm,
  file, setFile, filePreview, setFilePreview, merchFile, setMerchFile, merchFilePreview, setMerchFilePreview,
  submitting, uploading, merchSubmitting, merchUploading, handleSubmit, handleMerchSubmit,
  receiptData, merchReceiptData, payment, copied, setCopied, fileInputRef, merchFileInputRef
}) => {

  const [showFinalReceipt, setShowFinalReceipt] = useState(false)

  const copyToClipboard = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onFileSelect = async (e, type) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    
    // Immediate preview
    const previewUrl = URL.createObjectURL(selectedFile)
    if (type === 'cheki') setFilePreview(previewUrl)
    else setMerchFilePreview(previewUrl)

    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true, fileType: 'image/webp' }
      const compressedFile = await imageCompression(selectedFile, options)
      const webpFile = new File([compressedFile], selectedFile.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' })
      if (type === 'cheki') setFile(webpFile)
      else setMerchFile(webpFile)
    } catch (error) {
      console.error("Compression error:", error)
      if (type === 'cheki') setFile(selectedFile)
      else setMerchFile(selectedFile)
    }
  }

  if (step === 3 || step === 5) {
    const data = step === 3 ? receiptData : merchReceiptData
    if (showFinalReceipt) {
      return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <DigitalReceipt data={data} payment={payment} onBack={() => setShowFinalReceipt(false)} />
        </div>
      )
    }
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center space-y-8 py-12 px-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-4xl shadow-2xl shadow-emerald-500/40 relative z-10 animate-bounce"><FaCheckCircle /></div>
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Terima Kasih!</h2>
          <p className="text-gray-500 font-bold leading-relaxed">Pesanan kamu sudah diterima oleh <span className="text-emerald-600">Refresh Breeze</span>. Segera kami proses ya! 💚</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-emerald-50 shadow-xl space-y-6">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Dukunganmu sangat berarti bagi kami</p>
          <div className="space-y-3">
            <button type="button" onClick={() => window.open('https://instagram.com', '_blank')} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg hover:scale-105 transition-transform"><FaInstagram className="text-lg" /> Post Nota ke IG Story</button>
            <button type="button" onClick={() => setShowFinalReceipt(true)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg hover:bg-gray-800 transition-colors"><FaDownload className="text-sm" /> Lihat & Simpan Nota</button>
          </div>
        </div>
        <button type="button" onClick={() => setStep(1)} className="text-emerald-600 font-black uppercase tracking-widest text-xs hover:tracking-[0.2em] transition-all flex items-center gap-2 mx-auto group">Lanjut ke Shop <FaChevronRight className="text-[8px] group-hover:translate-x-1 transition-transform" /></button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-4 pb-20">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/50">
             <InternalCartSummary 
                items={step === 2 ? cart : merchCart} 
                type={step === 2 ? 'cheki' : 'merch'} 
                updateQuantity={updateQuantity}
                updateMerchQuantity={updateMerchQuantity}
                removeFromCart={removeFromCart}
                removeFromMerchCart={removeFromMerchCart}
                total={step === 2 ? totalHarga : totalMerchHarga}
             />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-emerald-50">
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-900 font-bold text-xs flex items-center gap-2 group">
                      <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors"><FaChevronRight className="rotate-180 text-[8px]" /></div>
                      Edit Shop
                   </button>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{step === 2 ? 'Tickets' : 'Merchandise'}</p>
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Checkout Data</h2>
                   </div>
                </div>
                <InternalPaymentInfo payment={payment} copyToClipboard={copyToClipboard} copied={copied} />
                <form onSubmit={step === 2 ? handleSubmit : handleMerchSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nama Lengkap</label>
                         <input required type="text" placeholder="Budi" value={step === 2 ? formData.nama_panggilan : merchForm.nama_lengkap} onChange={(e) => step === 2 ? setFormData({...formData, nama_panggilan: e.target.value}) : setMerchForm({...merchForm, nama_lengkap: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">{step === 2 ? 'WA/IG' : 'WhatsApp'}</label>
                         <input required type="text" placeholder={step === 2 ? "08xxx / @ig" : "08..."} value={step === 2 ? formData.kontak : merchForm.whatsapp} onChange={(e) => step === 2 ? setFormData({...formData, kontak: e.target.value}) : setMerchForm({...merchForm, whatsapp: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none transition-all" />
                      </div>
                   </div>
                   {step === 4 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Instagram (Optional)</label>
                        <input type="text" placeholder="@username" value={merchForm.instagram} onChange={(e) => setMerchForm({...merchForm, instagram: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none transition-all" />
                      </div>
                   )}
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bukti Transfer</label>
                      <div onClick={() => step === 2 ? fileInputRef.current?.click() : merchFileInputRef.current?.click()} className={`relative aspect-[16/9] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${(step === 2 ? filePreview : merchFilePreview) ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30'}`}>
                         {(step === 2 ? filePreview : merchFilePreview) ? (
                            <>
                               <img src={step === 2 ? filePreview : merchFilePreview} alt="Preview" className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                               <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600">
                                  <FaCheckCircle className="text-3xl mb-1" />
                                  <span className="font-black text-[10px] uppercase tracking-widest">WebP Optimized</span>
                               </div>
                            </>
                         ) : (
                            <>
                               <FaCamera className="text-2xl text-gray-300 mb-2 group-hover:scale-110 group-hover:text-emerald-500 transition-all" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Screenshot</span>
                            </>
                         )}
                         <input ref={step === 2 ? fileInputRef : merchFileInputRef} type="file" accept="image/*" onChange={(e) => onFileSelect(e, step === 2 ? 'cheki' : 'merch')} className="hidden" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Catatan</label>
                      <textarea placeholder="Tulis catatan jika ada..." value={step === 2 ? formData.catatan : merchForm.catatan} onChange={(e) => step === 2 ? setFormData({...formData, catatan: e.target.value}) : setMerchForm({...merchForm, catatan: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none min-h-[80px] resize-none" />
                   </div>
                   <motion.button type="submit" disabled={(step === 2 ? submitting : merchSubmitting) || (step === 2 ? cart.length === 0 : merchCart.length === 0)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-[#079108] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-30">
                      {(step === 2 ? submitting : merchSubmitting) ? <><FaSpinner className="animate-spin" /> {(step === 2 ? uploading : merchUploading) ? 'Optimizing Photo...' : 'Sending...'}</> : 'Confirm & Pay Now'}
                   </motion.button>
                </form>
             </div>
          </div>
       </div>
    </motion.div>
  )
}

export default CheckoutProcess
