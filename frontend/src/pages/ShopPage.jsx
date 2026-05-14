import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaSpinner, FaTicketAlt, FaChevronDown } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { getAssetPath } from '../lib/pathUtils'
import { showToast } from '../lib/toast'
import api from '../lib/api'
import Header from '../components/Header'
import { getMemberEmoji } from '../lib/memberUtils'
import { useShopCart } from '../hooks/useShopCart'

// Refactored Components
import ChekiSection from '../components/shop/ChekiSection'
import MerchSection from '../components/shop/MerchSection'
import CartSidebar from '../components/shop/CartSidebar'
import MerchDetailModal from '../components/shop/MerchDetailModal'
import CheckoutProcess from '../components/shop/CheckoutProcess'

const ShopPage = () => {
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState(1)
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false)
  
  // Checkout Form State
  const [formData, setFormData] = useState({ nama_panggilan: '', kontak: '', event_id: '', catatan: '' })
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [receiptData, setReceiptData] = useState(null)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const fileInputRef = useRef(null)

  // Merch State
  const [merch, setMerch] = useState([])
  const [merchForm, setMerchForm] = useState({ nama_lengkap: '', whatsapp: '', instagram: '', catatan: '' })
  const [merchFile, setMerchFile] = useState(null)
  const [merchFilePreview, setMerchFilePreview] = useState(null)
  const [merchSubmitting, setMerchSubmitting] = useState(false)
  const [merchUploading, setMerchUploading] = useState(false)
  const [merchOrderSuccess, setMerchOrderSuccess] = useState(null)
  const [merchReceiptData, setMerchReceiptData] = useState(null)
  const [maskContact, setMaskContact] = useState(false)
  const [maskMerchContact, setMaskMerchContact] = useState(false)
  const merchFileInputRef = useRef(null)
  const [selectedMerch, setSelectedMerch] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)

  // Cart Hook
  const hargaMember = Number(config?.hargaChekiPerMember) || 25000
  const hargaGrup = Number(config?.hargaChekiGrup) || 30000
  const cartHook = useShopCart(hargaMember, hargaGrup)

  // Click outside listener for custom dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-dropdown-container')) {
        setActiveDropdownId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper functions
  const sanitizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const getMemberImage = (member) => {
    const id = member.member_id || sanitizeName(member.nama_panggung)
    const clean = id.replace('aa', 'a')
    if (clean === 'aca' || clean === 'acaa') return getAssetPath('/images/shop/aca.webp')
    return getAssetPath(`/images/shop/${clean}.webp`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, membersRes, eventsRes] = await Promise.all([
          api.get('/config'),
          api.get('/members'),
          api.get('/events?is_past=false')
        ])

        try {
          const merchRes = await api.get('/merchandise')
          if (merchRes.data.success) setMerch(merchRes.data.data)
        } catch (_) {}
        
        if (configRes.data.success) setConfig(configRes.data.data)
        if (membersRes.data.success) {
           const heroOrder = ['cissi', 'acaa', 'channie', 'cally', 'sinta', 'piya']
           const sorted = membersRes.data.data
             .filter(m => m.member_id !== 'group' && m.member_id !== 'yanyee')
             .sort((a, b) => {
                const indexA = heroOrder.indexOf(a.member_id)
                const indexB = heroOrder.indexOf(b.member_id)
                return (indexA !== -1 ? indexA : 99) - (indexB !== -1 ? indexB : 99)
             })
           setMembers(sorted)
        }
        if (eventsRes.data.success) {
          const activeEvents = eventsRes.data.data.filter(event => {
            if (event.is_past) return false;
            const months = { 'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11 };
            const eventDate = new Date(event.tahun, months[event.bulan] || 0, event.tanggal);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
          });
          setEvents(activeEvents);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const payment = { bank: "BCA", rekening: "0902683273", atasNama: "Natasya Angelina Putri" }

  const handleMerchFileChange = (e) => {
    const f = e.target.files[0]
    if (f) { setMerchFile(f); setMerchFilePreview(URL.createObjectURL(f)) }
  }

  const handleMerchSubmit = async (e) => {
    e.preventDefault()
    if (!merchForm.nama_lengkap.trim()) return alert('Silakan isi nama lengkap kamu')
    if (!merchFile) return alert('Silakan unggah bukti transfer')
    setMerchSubmitting(true); setMerchUploading(true)
    try {
      const uploadData = new FormData(); uploadData.append('file', merchFile)
      const uploadRes = await api.post('/upload/payment-proof', uploadData)
      setMerchUploading(false)
      if (!uploadRes.data.success) throw new Error('Gagal mengunggah bukti bayar')
      const orderData = {
        nama_lengkap: merchForm.nama_lengkap, whatsapp: merchForm.whatsapp, instagram: merchForm.instagram || null, catatan: merchForm.catatan || null,
        items: cartHook.merchCart.map(i => ({ merchandise_id: i.id, nama: i.nama, harga: i.harga, quantity: i.quantity, size: i.size || null })),
        payment_proof_url: uploadRes.data.data.url
      }
      const orderRes = await api.post('/merch-orders', orderData)
      if (orderRes.data.success) {
        setMerchReceiptData({
          orderNumber: orderRes.data.order.order_number, 
          items: cartHook.merchCart.map(i => ({ name: i.nama, quantity: i.quantity, price: i.harga, size: i.size || null, image: i.gambar_url })),
          nama: merchForm.nama_lengkap, 
          whatsapp: merchForm.whatsapp, 
          instagram: merchForm.instagram,
          catatan: merchForm.catatan,
          total: cartHook.totalMerchHarga, 
          createdAt: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':').replace(/\//g, '/')
        })
        setMerchOrderSuccess(orderRes.data.order); cartHook.setMerchCart([]); setStep(5)
      }
    } catch (error) {
      console.error('Merch order failed:', error); alert('Terjadi kesalahan saat memesan.')
    } finally { setMerchSubmitting(false); setMerchUploading(false) }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) { setFile(selectedFile); setFilePreview(URL.createObjectURL(selectedFile)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return alert('Silakan unggah bukti transfer')
    if (!formData.event_id) return alert('Silakan pilih jadwal event')
    const selectedEvent = events.find(e => e.id === formData.event_id)
    const isEventSpecial = selectedEvent?.is_special || selectedEvent?.type === 'special' || !!selectedEvent?.theme_name || !!selectedEvent?.theme_color
    if (selectedEvent && selectedEvent.event_lineup && selectedEvent.event_lineup.length > 0) {
      const allowedMemberIds = selectedEvent.event_lineup.map(l => String(l.member_id))
      const invalidItems = cartHook.cart.filter(item => item.member_id !== 'group' && !allowedMemberIds.includes(String(item.member_id)))
      if (invalidItems.length > 0) {
        const memberNames = invalidItems.map(i => i.name).join(', ')
        showToast.error(`${memberNames} tidak terdapat di lineup event ini!`, 'Lineup Error')
        return
      }
    }
    setSubmitting(true); setUploading(true)
    try {
      const uploadData = new FormData(); uploadData.append('file', file)
      const uploadRes = await api.post('/upload/payment-proof', uploadData)
      setUploading(false)
      if (!uploadRes.data.success) throw new Error('Gagal mengunggah bukti bayar')
      const orderData = { nama_lengkap: formData.nama_panggilan, kontak: formData.kontak, event_id: formData.event_id, items: cartHook.cart, payment_proof_url: uploadRes.data.data.url, catatan: formData.catatan || null }
      const orderRes = await api.post('/orders', orderData)
      if (orderRes.data.success) {
        setReceiptData({
          orderNumber: orderRes.data.order.order_number, 
          eventName: selectedEvent?.nama || '-', 
          eventDate: selectedEvent ? `${selectedEvent.tanggal} ${selectedEvent.bulan} ${selectedEvent.tahun}` : '-',
          isSpecial: isEventSpecial, 
          themeColor: isEventSpecial ? (selectedEvent.theme_color || '#FF6B9D') : '#079108',
          items: cartHook.cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, image: item.image })), 
          nama: formData.nama_panggilan, 
          kontak: formData.kontak, 
          instagram: null,
          catatan: formData.catatan,
          total: cartHook.totalHarga, 
          createdAt: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':').replace(/\//g, '/')
        })
        setOrderSuccess(orderRes.data.order); cartHook.setCart([]); setStep(3)
      }
    } catch (error) {
      console.error('Order failed:', error); alert('Terjadi kesalahan saat memesan.')
    } finally { setSubmitting(false); setUploading(false) }
  }

  const selectedEventForTheme = events.find(e => e.id === formData.event_id)
  const isSpecialEvent = selectedEventForTheme?.is_special || selectedEventForTheme?.type === 'special' || !!selectedEventForTheme?.theme_name || !!selectedEventForTheme?.theme_color
  const themeColor = isSpecialEvent ? (selectedEventForTheme.theme_color || '#FF6B9D') : '#079108'

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 flex items-center justify-center">
        <FaSpinner className="text-4xl text-[#079108] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 text-gray-900">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #079108; border-radius: 10px; }
      `}</style>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#079108]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      <Header cartCount={cartHook.cart.length + cartHook.merchCart.length} onCartClick={() => setStep(1)} />
      
      <main className="relative pt-32 pb-30 container mx-auto max-w-7xl px-4">
        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-2 space-y-12">
                {/* Event Selector */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#079108] to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-[#079108]/20 shrink-0">
                      <FaTicketAlt className="text-lg sm:text-xl" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-tight">Pilih Jadwal Event</h2>
                      <p className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Wajib dipilih sebelum memesan cheki</p>
                    </div>
                  </div>

                  <div className="relative custom-dropdown-container">
                    <div 
                      onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                      className={`w-full bg-gray-50 border-2 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between cursor-pointer transition-all ${formData.event_id ? 'border-emerald-500 bg-white shadow-md' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${formData.event_id ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                        <span className={`font-black uppercase tracking-widest text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none ${formData.event_id ? 'text-gray-900' : 'text-gray-400'}`}>
                          {events.find(e => e.id === formData.event_id)?.nama || 'Klik untuk memilih event...'}
                        </span>
                      </div>
                      <FaChevronDown className={`text-gray-400 text-xs sm:text-sm transition-transform duration-300 ${eventDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                      {eventDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-[100] overflow-hidden border border-emerald-100/50"
                        >
                          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            {events.length > 0 ? events.map(event => (
                              <div 
                                key={event.id}
                                onClick={() => { setFormData({...formData, event_id: event.id}); setEventDropdownOpen(false); }}
                                className={`px-6 py-4 cursor-pointer flex items-center justify-between group transition-all ${formData.event_id === event.id ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
                              >
                                <div className="flex flex-col">
                                  <span className={`font-black text-xs sm:text-sm uppercase tracking-tight ${formData.event_id === event.id ? 'text-[#079108]' : 'text-gray-900'}`}>{event.nama}</span>
                                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{event.tanggal} {event.bulan}</span>
                                </div>
                                {formData.event_id === event.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                )}
                              </div>
                            )) : (
                              <div className="px-8 py-6 text-center text-gray-400 font-bold italic">Tidak ada event tersedia</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <ChekiSection 
                  loading={loading} members={members} hargaGrup={hargaGrup} hargaMember={hargaMember} 
                  selectedEvent={events.find(e => e.id === formData.event_id)}
                    addToCart={(type, m) => {
                    if (type === 'member' || type === 'group') {
                      if (!formData.event_id) {
                        showToast.info("Silakan pilih jadwal event terlebih dahulu!", "Info")
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                      }
                    }
                    cartHook.addToCart(type, m, getMemberImage);
                  }} 
                  getMemberImage={getMemberImage} getAssetPath={getAssetPath} 
                />
                <MerchSection 
                  merch={merch} merchCart={cartHook.merchCart} setSelectedMerch={setSelectedMerch} addToMerchCart={cartHook.addToMerchCart} 
                />
            </div>
            <CartSidebar 
              {...cartHook} 
              onCheckout={() => {
                if (cartHook.cart.length > 0) setStep(2)
                else if (cartHook.merchCart.length > 0) setStep(4)
              }} 
            />
          </div>
        ) : (
          <CheckoutProcess 
            step={step} setStep={setStep} {...cartHook}
            formData={formData} setFormData={setFormData} merchForm={merchForm} setMerchForm={setMerchForm}
            file={file} setFile={setFile} filePreview={filePreview} setFilePreview={setFilePreview}
            merchFile={merchFile} setMerchFile={setMerchFile} merchFilePreview={merchFilePreview} setMerchFilePreview={setMerchFilePreview}
            events={events} submitting={submitting} uploading={uploading} merchSubmitting={merchSubmitting} merchUploading={merchUploading}
            handleSubmit={handleSubmit} handleMerchSubmit={handleMerchSubmit} handleFileChange={handleFileChange} handleMerchFileChange={handleMerchFileChange}
            orderSuccess={orderSuccess} merchOrderSuccess={merchOrderSuccess} receiptData={receiptData} merchReceiptData={merchReceiptData}
            maskContact={maskContact} setMaskContact={setMaskContact} maskMerchContact={maskMerchContact} setMaskMerchContact={setMaskMerchContact}
            activeDropdownId={activeDropdownId} setActiveDropdownId={setActiveDropdownId} 
            fileInputRef={fileInputRef} merchFileInputRef={merchFileInputRef} themeColor={themeColor} isSpecialEvent={isSpecialEvent} payment={payment}
            copied={copied} setCopied={setCopied}
          />
        )}
      </main>

      <MerchDetailModal 
        selectedMerch={selectedMerch} setSelectedMerch={setSelectedMerch} activeSlide={activeSlide} setActiveSlide={setActiveSlide} 
        selectedSize={selectedSize} setSelectedSize={setSelectedSize} addToMerchCart={cartHook.addToMerchCart} 
      />

    </div>
  )
}

export default ShopPage
