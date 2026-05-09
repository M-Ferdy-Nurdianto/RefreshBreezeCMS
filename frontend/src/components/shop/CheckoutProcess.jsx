import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronRight, FaPlus, FaMinus, FaCamera, FaSpinner, FaUniversity, FaRegCopy, FaCheckCircle, FaExclamationTriangle, FaTimes, FaDownload, FaInfoCircle, FaBoxOpen } from 'react-icons/fa'
import { useEffect } from 'react'

const CheckoutProcess = ({
  step,
  setStep,
  cart,
  merchCart,
  totalHarga,
  totalMerchHarga,
  formData,
  setFormData,
  merchForm,
  setMerchForm,
  file,
  setFile,
  filePreview,
  setFilePreview,
  merchFile,
  setMerchFile,
  merchFilePreview,
  setMerchFilePreview,
  events,
  submitting,
  uploading,
  merchSubmitting,
  merchUploading,
  handleSubmit,
  handleMerchSubmit,
  handleFileChange,
  handleMerchFileChange,
  orderSuccess,
  merchOrderSuccess,
  receiptData,
  merchReceiptData,
  maskContact,
  setMaskContact,
  maskMerchContact,
  setMaskMerchContact,
  eventDropdownOpen,
  setEventDropdownOpen,
  activeDropdownId,
  setActiveDropdownId,
  lineupError,
  setLineupError,
  fileInputRef,
  merchFileInputRef,
  themeColor,
  isSpecialEvent,
  payment,
  copied,
  setCopied
}) => {

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // --- SUB-COMPONENTS ---

  const PaymentInfo = () => (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transfer Ke</span>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-100">
           <FaUniversity className="text-[#079108] text-xs" />
           <span className="text-xs font-black text-gray-900">{payment.bank}</span>
        </div>
      </div>
      <div className="flex items-center justify-between group cursor-pointer" onClick={() => copyToClipboard(payment.rekening)}>
        <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{payment.rekening}</span>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-[#079108] group-hover:text-white transition-colors">
          {copied ? <FaCheckCircle className="text-xs" /> : <FaRegCopy className="text-xs" />}
        </div>
      </div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">a.n {payment.atasNama}</p>
    </div>
  )

  // --- STEP 2: CHEKI CHECKOUT ---
  if (step === 2) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
       <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden">
          <div className="relative space-y-8">
             <div className="flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-900 font-bold text-sm flex items-center gap-2 group">
                   <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                     <FaChevronRight className="rotate-180 text-[10px]" />
                   </div>
                   Back to Shop
                </button>
                <div className="text-right">
                   <p className="text-[10px] font-black text-[#079108] uppercase tracking-[0.2em] mb-1">Step 02/03</p>
                   <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Checkout</h2>
                </div>
             </div>

             <PaymentInfo />

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nama Panggilan</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Contoh: Budi"
                        value={formData.nama_panggilan}
                        onChange={(e) => setFormData({...formData, nama_panggilan: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#079108] focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nomor WhatsApp/Kontak</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="0812xxxx"
                        value={formData.kontak}
                        onChange={(e) => setFormData({...formData, kontak: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-[#079108] focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300" 
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Pilih Jadwal Event</label>
                   <div className="relative custom-dropdown-container">
                      <button 
                        type="button"
                        onClick={() => setActiveDropdownId(activeDropdownId === 'event' ? null : 'event')}
                        className={`w-full bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-2xl px-6 py-4 text-left outline-none transition-all flex items-center justify-between group ${formData.event_id ? 'border-[#079108]/20' : ''}`}
                      >
                        {formData.event_id ? (
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
                              <span className="font-bold text-gray-900">
                                {events.find(e => e.id === formData.event_id)?.nama}
                                {isSpecialEvent && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: themeColor }}>SPECIAL</span>}
                              </span>
                           </div>
                        ) : (
                           <span className="font-bold text-gray-300">Pilih Event...</span>
                        )}
                        <FaChevronRight className={`text-xs transition-transform duration-300 ${activeDropdownId === 'event' ? '-rotate-90' : 'rotate-90'} text-gray-300`} />
                      </button>

                      <AnimatePresence>
                        {activeDropdownId === 'event' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden"
                          >
                             <div className="p-2 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                                {events.length > 0 ? (
                                   events.map(event => {
                                      const isSpecial = event.is_special || event.type === 'special' || !!event.theme_name || !!event.theme_color
                                      const color = isSpecial ? (event.theme_color || '#FF6B9D') : '#079108'
                                      return (
                                        <button
                                          key={event.id}
                                          type="button"
                                          onClick={() => {
                                            setFormData({...formData, event_id: event.id})
                                            setActiveDropdownId(null)
                                          }}
                                          className="w-full text-left px-5 py-4 rounded-2xl hover:bg-gray-50 transition-colors group flex items-center justify-between"
                                        >
                                           <div className="flex flex-col">
                                              <span className="font-bold text-gray-900 group-hover:text-[#079108] transition-colors">{event.nama}</span>
                                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{event.tanggal} {event.bulan} {event.tahun}</span>
                                           </div>
                                           {isSpecial && (
                                              <div className="flex items-center gap-2">
                                                 <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-sm" style={{ backgroundColor: color }}>
                                                   {event.theme_name || 'SPECIAL'}
                                                 </span>
                                              </div>
                                           )}
                                        </button>
                                      )
                                   })
                                ) : (
                                   <div className="px-5 py-8 text-center text-gray-400 font-bold text-sm">Tidak ada event tersedia</div>
                                )}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bukti Transfer (Screenshot)</label>
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group ${filePreview ? 'border-[#079108] bg-gray-50' : 'border-gray-200 hover:border-[#079108]/50 hover:bg-emerald-50/30'}`}
                   >
                      {filePreview ? (
                         <>
                            <img src={filePreview} alt="Preview" className="w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#079108]">
                               <FaCheckCircle className="text-4xl mb-2" />
                               <span className="font-black text-xs uppercase tracking-widest">Bukti Terpilih</span>
                               <span className="text-[10px] font-bold text-gray-500 mt-1">{file?.name}</span>
                            </div>
                         </>
                      ) : (
                         <>
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#079108] group-hover:text-white transition-all">
                               <FaCamera className="text-xl" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-[#079108] transition-colors">Upload Screenshot</span>
                         </>
                      )}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden" 
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Catatan (Opsional)</label>
                   <textarea 
                      placeholder="Contoh: Pakai nama di cheki..."
                      value={formData.catatan}
                      onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#079108] focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 min-h-[100px] resize-none"
                   ></textarea>
                </div>

                <div className="pt-4">
                   <div className="flex items-center justify-between mb-6 px-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Pembayaran</span>
                      <span className="text-3xl font-black text-gray-900">IDR {totalHarga.toLocaleString()}</span>
                   </div>

                   <motion.button 
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#079108] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#079108]/20 flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                      {submitting ? (
                         <>
                            <FaSpinner className="animate-spin" />
                            {uploading ? 'Uploading Proof...' : 'Processing...'}
                         </>
                      ) : (
                         <>Confirm Order & Pay</>
                      )}
                   </motion.button>
                </div>
             </form>
          </div>
       </div>

       {/* Lineup Error Modal */}
       <AnimatePresence>
          {lineupError && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
             >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl overflow-hidden relative"
                >
                   <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: lineupError.eventColor }}></div>
                   <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                         <FaExclamationTriangle className="text-4xl" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-2xl font-black uppercase tracking-tight">Lineup Terbatas</h3>
                         <p className="text-sm font-bold text-gray-500 leading-relaxed">
                            Event <span className="text-gray-900">"{lineupError.eventName}"</span> adalah event spesial 
                            <span className="mx-1 px-2 py-0.5 rounded-full text-white text-[10px]" style={{ backgroundColor: lineupError.eventColor }}>{lineupError.themeName}</span> 
                            dengan lineup terbatas.
                         </p>
                      </div>
                      <div className="w-full bg-gray-50 rounded-3xl p-6 space-y-4">
                         <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Item tidak tersedia di event ini:</p>
                         <div className="space-y-2">
                            {lineupError.items.map(item => (
                               <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
                                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs">❌</div>
                                  <span className="text-xs font-black text-gray-900">{item.name}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="w-full space-y-3">
                         <button 
                           onClick={() => { setLineupError(null); setStep(1); }}
                           className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
                         >
                            Hapus Item & Kembali ke Shop
                         </button>
                         <button 
                           onClick={() => setLineupError(null)}
                           className="w-full text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-gray-600 transition-colors"
                         >
                            Ganti Jadwal Event
                         </button>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>
    </motion.div>
  )

  // --- STEP 3: CHEKI RECEIPT ---
  if (step === 3) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
       <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-emerald-900/10 border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32"></div>
          <div className="relative space-y-10">
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
                   <FaCheckCircle className="text-4xl" />
                </div>
                <div className="space-y-1">
                   <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Order Received!</h2>
                   <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Nota Digital Anda</p>
                </div>
             </div>

             <div className="bg-gray-50/50 rounded-[2rem] p-6 sm:p-10 border border-gray-100 space-y-8 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-dashed border-gray-200">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Number</p>
                      <h3 className="text-xl font-black text-[#079108] tracking-tight">{receiptData?.orderNumber}</h3>
                   </div>
                   <div className="space-y-1 sm:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                      <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                         Pending Verification
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Details</p>
                         <p className="text-sm font-black text-gray-900">{receiptData?.nama}</p>
                         <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-gray-500">{maskContact ? receiptData?.kontak?.replace(/(\d{4})\d+(\d{4})/, '$1****$2') : receiptData?.kontak}</p>
                            <button onClick={() => setMaskContact(!maskContact)} className="text-[10px] text-[#079108] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-2">
                               {maskContact ? 'Show' : 'Hide'}
                            </button>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Event</p>
                         <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-gray-900">{receiptData?.eventName}</p>
                            {receiptData?.isSpecial && <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-black text-white uppercase">Special</span>}
                         </div>
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{receiptData?.eventDate}</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Summary</p>
                         <div className="space-y-2">
                            {receiptData?.items.map((item, idx) => (
                               <div key={idx} className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-gray-600">{item.quantity}x {item.name}</span>
                                  <span className="text-xs font-black text-gray-900">Rp {(item.price * item.quantity).toLocaleString()}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                         <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total Paid</span>
                         <span className="text-lg font-black text-[#079108]">IDR {receiptData?.total.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <FaInfoCircle />
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                      Screenshot nota ini dan tunjukkan kepada staff kami saat berada di venue event untuk klaim tiket fisik.
                   </p>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors shadow-xl shadow-black/10"
                >
                   <FaDownload /> Download Nota
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white text-gray-900 border-2 border-gray-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                >
                   Shop More
                </button>
             </div>
          </div>
       </div>
    </motion.div>
  )

  // --- STEP 4: MERCH CHECKOUT ---
  if (step === 4) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto pb-20">
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-emerald-50">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-900 font-bold text-sm flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors"><FaChevronRight className="rotate-180 text-[10px]" /></div>
              Back to Shop
            </button>
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Merchandise</p>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Checkout Merch</h2>
            </div>
          </div>

          <PaymentInfo />

          <form onSubmit={handleMerchSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nama Lengkap</label>
                <input required type="text" value={merchForm.nama_lengkap} onChange={e => setMerchForm({...merchForm, nama_lengkap: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none" placeholder="Masukkan nama..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">WhatsApp</label>
                <input required type="text" value={merchForm.whatsapp} onChange={e => setMerchForm({...merchForm, whatsapp: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none" placeholder="08..." />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Instagram (Opsional)</label>
              <input type="text" value={merchForm.instagram} onChange={e => setMerchForm({...merchForm, instagram: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none" placeholder="@username" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Bukti Transfer (Screenshot)</label>
              <div onClick={() => merchFileInputRef.current?.click()} className={`relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all ${merchFilePreview ? 'border-emerald-500 bg-gray-50' : 'border-gray-200 hover:border-emerald-300'}`}>
                {merchFilePreview ? (
                  <>
                    <img src={merchFilePreview} alt="Preview" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-600">
                      <FaCheckCircle className="text-4xl mb-2" />
                      <span className="font-black text-xs uppercase tracking-widest">Terpilih</span>
                    </div>
                  </>
                ) : (
                  <>
                    <FaCamera className="text-3xl text-gray-300 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Klik untuk upload</span>
                  </>
                )}
                <input ref={merchFileInputRef} type="file" accept="image/*" onChange={handleMerchFileChange} className="hidden" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Catatan (Opsional)</label>
              <textarea value={merchForm.catatan} onChange={e => setMerchForm({...merchForm, catatan: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-6 py-4 font-bold outline-none min-h-[80px] resize-none" placeholder="Ketik catatan di sini..." />
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-6 px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Merch</span>
                <span className="text-3xl font-black text-gray-900">IDR {totalMerchHarga.toLocaleString()}</span>
              </div>
              <motion.button type="submit" disabled={merchSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-[#079108] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                {merchSubmitting ? <><FaSpinner className="animate-spin" /> {merchUploading ? 'Uploading...' : 'Processing...'}</> : 'Place Merch Order'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )

  // --- STEP 5: MERCH RECEIPT ---
  if (step === 5) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto pb-20">
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32"></div>
        <div className="relative space-y-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner"><FaBoxOpen className="text-4xl" /></div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Merch Order Placed!</h2>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Nota Digital Merchandise</p>
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-[2rem] p-6 sm:p-10 border border-gray-100 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-dashed border-gray-200">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Number</p>
                  <h3 className="text-xl font-black text-emerald-600 tracking-tight">{merchReceiptData?.orderNumber}</h3>
               </div>
               <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  Processing
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                     <p className="text-sm font-black text-gray-900">{merchReceiptData?.nama}</p>
                     <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-gray-500">{maskMerchContact ? merchReceiptData?.whatsapp?.replace(/(\d{4})\d+(\d{4})/, '$1****$2') : merchReceiptData?.whatsapp}</p>
                        <button onClick={() => setMaskMerchContact(!maskMerchContact)} className="text-[10px] text-emerald-600 font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-2">
                           {maskMerchContact ? 'Show' : 'Hide'}
                        </button>
                     </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</p>
                     <div className="space-y-2">
                        {merchReceiptData?.items.map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-600">{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                              <span className="text-xs font-black text-gray-900">Rp {(item.price * item.quantity).toLocaleString()}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                     <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total</span>
                     <span className="text-lg font-black text-emerald-600">IDR {merchReceiptData?.total.toLocaleString()}</span>
                  </div>
               </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400"><FaInfoCircle /></div>
               <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">Kirimkan bukti screenshot nota ini ke admin kami jika ada kendala dalam pengiriman merchandise.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => window.print()} className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 shadow-xl transition-all"><FaDownload /> Save Receipt</button>
            <button onClick={() => setStep(1)} className="flex-1 bg-white text-gray-900 border-2 border-gray-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all">Back to Shop</button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return null
}

export default CheckoutProcess
