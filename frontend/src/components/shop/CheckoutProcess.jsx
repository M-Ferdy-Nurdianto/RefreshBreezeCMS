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
  <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-lg border border-white/5">
    <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/5">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
        <FaUniversity className="text-emerald-500 text-lg" />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{payment?.bank || 'Bank Central Asia'}</h4>
        <span className="text-[10px] font-medium text-gray-500">Official Account</span>
      </div>
    </div>
    
    <div className="flex items-center justify-between gap-4 mb-5">
      <div className="min-w-0">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Holder</span>
        <p className="text-xs font-bold text-emerald-400 uppercase truncate leading-none">{payment?.atasNama || 'Natasya Angelina Putri'}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Method</span>
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
           <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
           <span className="text-[9px] font-bold text-emerald-500 uppercase">Manual TF</span>
        </div>
      </div>
    </div>

    <div 
      onClick={() => copyToClipboard(payment?.rekening)}
      className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Account Number</span>
        <span className="text-lg sm:text-xl font-black text-white tracking-wider block">{payment?.rekening || '0902683273'}</span>
      </div>
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}>
        {copied ? <FaCheckCircle className="text-sm" /> : <FaRegCopy className="text-sm" />}
      </div>
    </div>
  </div>
)

const InternalCartSummary = ({ items, type, updateQuantity, updateMerchQuantity, removeFromCart, removeFromMerchCart, total }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 leading-none">Keranjang Belanja</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Daftar item yang akan kamu pesan</p>
      </div>
      <div className="text-right">
        <span className="text-3xl font-black text-emerald-600 block leading-none">{items?.length || 0}</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Items</span>
      </div>
    </div>

    <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {items?.map((item, index) => (
        <motion.div layout key={item.cartId || item.id} className="group relative flex items-start gap-3 bg-white rounded-2xl p-3 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
          <span className="text-[10px] font-black text-gray-300 w-3 pt-2">{index + 1}.</span>
          <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 mt-1">
            <img src={item.image || item.gambar_url} alt="Item" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h4 className="font-black text-[11px] text-gray-900 uppercase tracking-tight leading-tight mb-1.5 break-words">
              {(item.name || item.nama || '').replace(/cheki/gi, '').replace(/\p{Extended_Pictographic}/gu, '').trim()}
            </h4>
            <div className="flex flex-wrap items-center gap-2">

              <span className="text-emerald-600 font-bold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">IDR {(item.price || item.harga || 0).toLocaleString()}</span>
              {item.size && <span className="text-[8px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase">Size: {item.size}</span>}
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-0.5">
                 <button onClick={() => type === 'cheki' ? updateQuantity(item.id, -1) : updateMerchQuantity(item.cartId, -1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><FaMinus className="text-[8px]" /></button>
                 <span className="w-5 text-center font-black text-[10px] text-gray-900">{item.quantity}</span>
                 <button onClick={() => type === 'cheki' ? updateQuantity(item.id, 1) : updateMerchQuantity(item.cartId, 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><FaPlus className="text-[8px]" /></button>
              </div>
              <button onClick={() => type === 'cheki' ? removeFromCart(item.id) : removeFromMerchCart(item.cartId)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><FaTrash className="text-[10px]" /></button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-8 -mx-6 -mb-6 bg-[#1a1a1a] rounded-b-3xl p-6 flex items-center justify-between border-t border-white/5">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Order</span>
        <div className="flex items-baseline gap-1">
           <span className="text-xs font-bold text-gray-400">IDR</span>
           <span className="text-2xl font-black text-white">{(total || 0).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
         <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Ready to Pay</span>
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
    const data = step === 3 ? receiptData : merchReceiptData;
    
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto text-center space-y-6 pt-8 pb-4 px-4">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl shadow-2xl shadow-emerald-500/40 relative z-10 animate-bounce"><FaCheckCircle /></div>
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Terima Kasih!</h2>
          <p className="text-xs text-gray-500 font-bold leading-relaxed">Pesanan kamu sudah diterima oleh <span className="text-emerald-600">Refresh Breeze</span>.</p>
        </div>

        <div className="space-y-4">
          <DigitalReceipt data={data} payment={payment} isPreview />
          
          <div className="max-w-md mx-auto space-y-3">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg">
              <FaInstagram className="text-lg" /> Post Nota ke IG Story
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Tag <span className="text-emerald-600">@refreshbreeze</span> dan Oshimu bagikan momen seru kamu!
            </p>
          </div>
        </div>

        <button type="button" onClick={() => setStep(1)} className="text-emerald-600 font-black uppercase tracking-widest text-[10px] hover:tracking-[0.2em] transition-all flex items-center gap-2 mx-auto group pt-2 pb-8">
          Lanjut ke Shop <FaChevronRight className="text-[8px] group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-4 pb-10">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50">
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

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-50/50">
             <div className="space-y-8">
                <div className="flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                      <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 shadow-sm border border-gray-100"><FaChevronRight className="rotate-180 text-[10px]" /></div>
                         <span className="text-[10px] font-black uppercase tracking-widest">Ganti Member / Tambah Pesanan</span>
                      </button>
                      <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {step === 2 ? 'Tickets' : 'Merchandise'}
                      </div>
                   </div>
                   <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">Checkout Data</h2>
                   <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
                </div>
                <InternalPaymentInfo payment={payment} copyToClipboard={copyToClipboard} copied={copied} />
                <form onSubmit={step === 2 ? handleSubmit : handleMerchSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Nama Panggilan</label>
                          <input required type="text" placeholder="Contoh: iki" value={step === 2 ? formData.nama_panggilan : merchForm.nama_lengkap} onChange={(e) => step === 2 ? setFormData({...formData, nama_panggilan: e.target.value}) : setMerchForm({...merchForm, nama_lengkap: e.target.value})} className="w-full bg-gray-50/50 border border-gray-100 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-7 py-4 font-bold outline-none transition-all placeholder:text-gray-300 shadow-sm" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">{step === 2 ? 'WhatsApp / IG' : 'WhatsApp Number'}</label>
                          <input required type="text" placeholder={step === 2 ? "08xxx / @username" : "08xxxxxxxxx"} value={step === 2 ? formData.kontak : merchForm.whatsapp} onChange={(e) => step === 2 ? setFormData({...formData, kontak: e.target.value}) : setMerchForm({...merchForm, whatsapp: e.target.value})} className="w-full bg-gray-50/50 border border-gray-100 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-7 py-4 font-bold outline-none transition-all placeholder:text-gray-300 shadow-sm" />
                       </div>
                    </div>
                    {step === 4 && (
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Instagram (Optional)</label>
                         <input type="text" placeholder="@username" value={merchForm.instagram} onChange={(e) => setMerchForm({...merchForm, instagram: e.target.value})} className="w-full bg-gray-50/50 border border-gray-100 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-7 py-4 font-bold outline-none transition-all placeholder:text-gray-300 shadow-sm" />
                       </div>
                    )}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between px-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Bukti Transfer (Screenshot)</label>
                          {(step === 2 ? filePreview : merchFilePreview) && (
                             <span className="text-[9px] font-black text-emerald-600 uppercase flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                <FaCheckCircle className="text-[10px]" /> File Selected
                             </span>
                          )}
                       </div>
                       
                       <div 
                          onClick={() => step === 2 ? fileInputRef.current?.click() : merchFileInputRef.current?.click()} 
                          className={`relative aspect-[16/9] rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group ${
                             (step === 2 ? filePreview : merchFilePreview) 
                                ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' 
                                : 'border-gray-100 border-dashed hover:border-emerald-500 bg-gray-50/50'
                          }`}
                       >
                          {(step === 2 ? filePreview : merchFilePreview) ? (
                             <>
                                <img src={step === 2 ? filePreview : merchFilePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                   <div className="flex flex-col items-center gap-2">
                                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                                         <FaCamera className="text-sm" />
                                      </div>
                                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Ganti Foto</span>
                                   </div>
                                </div>
                             </>
                          ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-200 transition-all">
                                   <FaCamera className="text-gray-300 text-lg group-hover:text-emerald-500" />
                                </div>
                                <div className="text-center">
                                   <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Upload Bukti Transfer</p>
                                   <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Ketuk untuk memilih file</p>
                                </div>
                             </div>
                          )}
                          <input ref={step === 2 ? fileInputRef : merchFileInputRef} type="file" accept="image/*" onChange={(e) => onFileSelect(e, step === 2 ? 'cheki' : 'merch')} className="hidden" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Catatan Pesanan (Optional)</label>
                       <textarea placeholder="Bisa ditulis bila tidak datang" value={step === 2 ? formData.catatan : merchForm.catatan} onChange={(e) => step === 2 ? setFormData({...formData, catatan: e.target.value}) : setMerchForm({...merchForm, catatan: e.target.value})} className="w-full bg-gray-50/50 border border-gray-100 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-7 py-4 font-bold outline-none min-h-[100px] resize-none transition-all placeholder:text-gray-300 shadow-sm" />
                    </div>
                    <motion.button type="submit" disabled={(step === 2 ? submitting : merchSubmitting) || (step === 2 ? cart.length === 0 : merchCart.length === 0)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full bg-[#079108] text-white py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] shadow-xl shadow-emerald-500/20 flex items-center justify-center transition-all disabled:opacity-50">
                       CONFIRM
                    </motion.button>
                 </form>
             </div>
          </div>
       </div>
       <LoadingOverlay isVisible={(step === 2 ? submitting : merchSubmitting)} message={(step === 2 ? uploading : merchUploading) ? 'Optimizing Receipt...' : 'Processing Order...'} />
    </motion.div>
  )
}

const LoadingOverlay = ({ isVisible, message }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-3">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900">{message}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-4">Mohon tunggu sebentar ya!</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default CheckoutProcess
