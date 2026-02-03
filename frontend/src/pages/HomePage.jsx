import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import imageCompression from 'browser-image-compression'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartModal from '../components/CartModal'
import AnimatedBackground from '../components/AnimatedBackground'
import ScrollProgressBar from '../components/ScrollProgressBar'
import FloatingButton from '../components/FloatingButton'
import api from '../lib/api'

// Skeleton Loading Components
const MemberCardSkeleton = () => (
  <div className="bg-custom-cream rounded-3xl shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
)

const EventCardSkeleton = () => (
  <div className="bg-custom-cream rounded-3xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
    <div className="p-6">
      <div className="h-8 bg-gray-300 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
)

// Member Profile Modal Component  
const MemberModal = ({ member, isOpen, onClose, onAddToCart, galleryIndex, onGalleryChange }) => {
  if (!isOpen || !member) return null

  const handlePrevImage = () => {
    if (member.gallery && member.gallery.length > 0) {
      onGalleryChange((galleryIndex - 1 + member.gallery.length) % member.gallery.length)
    }
  }

  const handleNextImage = () => {
    if (member.gallery && member.gallery.length > 0) {
      onGalleryChange((galleryIndex + 1) % member.gallery.length)
    }
  }

  const currentImage = member.gallery && member.gallery.length > 0 
    ? member.gallery[galleryIndex] 
    : member.image_url

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-custom-cream rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gallery Section */}
          <div className="relative">
            <img 
              src={currentImage} 
              alt={member.nama_panggung}
              className="w-full h-full object-cover rounded-tl-3xl md:rounded-bl-3xl"
              onError={(e) => {
                e.target.src = '/images/members/placeholder.svg'
              }}
            />
            
            {/* Gallery Navigation */}
            {member.gallery && member.gallery.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Gallery Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {member.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => onGalleryChange(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === galleryIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-4xl font-bold text-gray-800">{member.nama_panggung}</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Jiko */}
            {member.jiko && (
              <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-l-4 border-green-500">
                <p className="text-gray-700 italic leading-relaxed">{member.jiko}</p>
              </div>
            )}

            {/* Tagline */}
            <div className="mb-6">
              <p className="text-gray-600 text-lg">{member.tagline}</p>
            </div>

            {/* Details */}
            {member.details && (
              <div className="space-y-3 mb-6">
                {Object.entries(member.details).map(([key, value]) => (
                  <div key={key} className="flex border-b border-gray-100 pb-2">
                    <span className="font-semibold text-gray-700 w-32">{key}:</span>
                    <span className="text-gray-600 flex-1">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Instagram */}
            {member.instagram && (
              <a 
                href={`https://instagram.com/${member.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium mb-6 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @{member.instagram}
              </a>
            )}

            {/* Add to Cart Button */}
            {member.member_id !== 'group' && (
              <button
                onClick={() => {
                  onAddToCart(member)
                  onClose()
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Tambah ke Keranjang
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const HomePage = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [faqs, setFaqs] = useState([])
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    kontak: '',
    payment_proof: null
  })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Load members from local JSON file (hardcoded)
      const membersResponse = await fetch('/data/members.json')
      const membersData = await membersResponse.json()
      
      // Sort members by order field
      const sortedMembers = (membersData.members || []).sort((a, b) => {
        return (a.order || 999) - (b.order || 999)
      })
      setMembers(sortedMembers)
      
      // Fetch dynamic data from API (softcoded)
      const [eventsRes, faqsRes, configRes] = await Promise.all([
        api.get('/events'),
        api.get('/faqs'),
        api.get('/config')
      ])

      setEvents(eventsRes.data.data || [])
      setFaqs(faqsRes.data.data || [])
      setConfig(configRes.data.data || {})
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Gagal memuat data. Silakan refresh halaman!', {
        position: 'top-center',
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (member, price) => {
    const isGroup = member.member_id === 'group'
    const priceToUse = price || (isGroup 
      ? parseInt(config.harga_cheki_grup || 30000)
      : parseInt(config.harga_cheki_per_member || 25000))
    
    const name = isGroup ? 'Cheki All Member' : `Cheki ${member.nama_panggung}`

    const existingIndex = cart.findIndex(item => item.member_id === member.id)
    
    if (existingIndex >= 0) {
      const newCart = [...cart]
      newCart[existingIndex].quantity++
      setCart(newCart)
    } else {
      setCart([...cart, {
        member_id: member.id,
        name,
        price: priceToUse,
        quantity: 1
      }])
    }

    toast.success(`${name} ditambahkan ke keranjang! 🎉`, {
      position: 'top-center',
      autoClose: 2000,
    })
  }

  const updateCartQuantity = (index, action) => {
    const newCart = [...cart]
    if (action === 'increase') {
      newCart[index].quantity++
    } else if (action === 'decrease') {
      if (newCart[index].quantity > 1) {
        newCart[index].quantity--
      } else {
        newCart.splice(index, 1)
      }
    }
    setCart(newCart)
  }

  const removeFromCart = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const handleCheckout = () => {
    setCartModalOpen(false)
    setTimeout(() => {
      document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedEvent) {
      toast.error('Pilih event terlebih dahulu! 📅', {
        position: 'top-center',
        autoClose: 2000,
      })
      return
    }

    if (cart.length === 0) {
      toast.error('Keranjang masih kosong! Pilih member dulu yuk 🛒', {
        position: 'top-center',
        autoClose: 2000,
      })
      return
    }

    if (!formData.payment_proof) {
      toast.warning('Upload bukti transfer terlebih dahulu! 📸', {
        position: 'top-center',
        autoClose: 3000,
      })
      return
    }

    setSubmitting(true)

    try {
      // Compress image
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        initialQuality: 0.7
      }

      const compressedFile = await imageCompression(formData.payment_proof, options)

      // Upload to Google Drive
      const uploadFormData = new FormData()
      uploadFormData.append('file', compressedFile)

      const uploadRes = await api.post('/upload/payment-proof', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const paymentProofUrl = uploadRes.data.data.url

      // Create order
      const orderData = {
        event_id: selectedEvent,
        nama_lengkap: formData.nama_lengkap,
        kontak: formData.kontak,
        items: cart,
        payment_proof_url: paymentProofUrl
      }

      await api.post('/orders', orderData)

      toast.success(`✅ Pesanan berhasil! Terima kasih ${formData.nama_lengkap}. Admin akan menghubungi Anda segera! 💚`, {
        position: 'top-center',
        autoClose: 5000,
      })

      // Reset form
      setCart([])
      setSelectedEvent(null)
      setFormData({
        nama_lengkap: '',
        kontak: '',
        payment_proof: null
      })
      e.target.reset()

    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error(error.response?.data?.error || 'Gagal mengirim pesanan. Coba lagi!', {
        position: 'top-center',
        autoClose: 4000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const upcomingEvents = events.filter(e => !e.is_past)
  const pastEvents = events.filter(e => e.is_past).reverse()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-custom-mint/20 to-custom-sage/30">
        <Header cartCount={0} onCartClick={() => {}} />
        
        {/* Hero Skeleton */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="mx-auto mb-8 w-64 h-64 bg-gradient-to-br from-custom-green/20 to-green-400/20 rounded-full animate-pulse"></div>
            <div className="h-12 bg-gradient-to-r from-custom-green/20 to-green-400/20 rounded-xl max-w-xl mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
        </section>
        
        {/* Events Skeleton */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="h-10 bg-custom-green/20 rounded-full w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl max-w-xl mx-auto mb-16 animate-pulse"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
        
        {/* Members Skeleton */}
        <section className="py-20 px-6 bg-gradient-to-br from-custom-mint/30 to-custom-sage/20">
          <div className="container mx-auto max-w-7xl">
            <div className="h-10 bg-custom-green/20 rounded-full w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl max-w-xl mx-auto mb-16 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <MemberCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-custom-cream via-custom-mint/20 to-custom-sage/30 relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
      
      <Header cartCount={totalItems} onCartClick={() => setCartModalOpen(true)} />

      {/* Hero Section - Modern Glass Effect */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            {/* Logo with Advanced Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
              className="mx-auto mb-8 w-48 sm:w-64 md:w-72 relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-custom-green/20 rounded-full blur-2xl"
              />
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                src="/images/logos/logo.webp" 
                alt="Refresh Breeze Logo" 
                className="relative w-full h-auto drop-shadow-2xl cursor-pointer"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(7, 145, 8, 0.4))',
                }}
              />
            </motion.div>
            
            {/* Title with Gradient Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            >
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="bg-gradient-to-r from-custom-green via-green-600 to-custom-green bg-clip-text text-transparent"
                style={{ backgroundSize: '200% 200%' }}
              >
                Refresh Breeze
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-700 font-semibold mb-4"
            >
              Angin Segar Dari Tulungagung
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="max-w-2xl mx-auto text-gray-600 text-base md:text-lg leading-relaxed mb-10"
            >
              Hembusan segar yang siap menyejukan kalian semua. Berasal dari Tulungagung, Jawa Timur, kami hadir untuk membawa warna baru ke panggung idola Indonesia.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#member-section"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('member-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group bg-custom-green text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3"
              >
                <motion.i
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="fas fa-users"
                />
                <span>Lihat Member</span>
                <motion.i
                  className="fas fa-arrow-down"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#event-section"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('event-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="border-2 border-custom-green text-custom-green px-8 py-4 rounded-full text-lg font-bold hover:bg-custom-green hover:text-white transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <i className="fas fa-calendar-alt"></i>
                <span>Event Mendatang</span>
              </motion.a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-custom-green to-green-600 flex items-center justify-center text-white shadow-lg cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => document.getElementById('event-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <i className="fas fa-chevron-down text-xl"></i>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Event Section */}
      <section 
        id="event-section" 
        className="py-20 px-6 bg-custom-ivory"
        data-aos="fade-up"
      >
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-custom-green/10 text-custom-green rounded-full text-sm font-bold mb-4">
              JADWAL ACARA
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Event <span className="text-custom-green">Mendatang</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Jangan lewatkan kesempatan untuk bertemu langsung dengan kami!
            </p>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, idx) => (
                <Tilt
                  key={idx}
                  tiltMaxAngleX={3}
                  tiltMaxAngleY={3}
                  scale={1.02}
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                  glareColor="#079108"
                  glareBorderRadius="24px"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="group bg-gradient-to-br from-custom-cream to-custom-mint/20 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 border border-gray-100 h-full"
                  >
                  {/* Event Header */}
                  <div className="relative h-56 bg-gradient-to-br from-custom-green via-green-500 to-green-600 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/10"></div>
                    {/* Date Badge */}
                    <div className="relative z-10 text-center text-white">
                      <div className="text-7xl font-black leading-none mb-2 drop-shadow-2xl">
                        {event.tanggal}
                      </div>
                      <div className="text-2xl font-bold uppercase tracking-wider">
                        {event.bulan}
                      </div>
                      <div className="text-sm font-semibold opacity-75 mt-1">
                        {event.tahun}
                      </div>
                    </div>
                    
                    {/* Corner Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-tr-full"></div>
                    {/* Green accent corner */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/30 to-transparent rounded-br-full"></div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-custom-green transition-colors">
                      {event.nama}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-start gap-3">
                        <i className="fas fa-map-marker-alt text-custom-green w-5 mt-1 flex-shrink-0"></i>
                        <span className="font-medium">{event.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <i className="fas fa-clock text-custom-green w-5"></i>
                        <span><strong>Event:</strong> {event.event_time}</span>
                      </div>
                      {event.cheki_time && (
                        <div className="flex items-center gap-3">
                          <i className="fas fa-camera text-custom-green w-5"></i>
                          <span><strong>Cheki:</strong> {event.cheki_time}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="#checkout-section"
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="block w-full bg-custom-green text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all hover:shadow-lg text-center"
                      >
                        <motion.span className="inline-flex items-center gap-2">
                          <motion.i
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                            className="fas fa-ticket-alt"
                          />
                          <span>Pesan Cheki Sekarang</span>
                        </motion.span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </Tilt>
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-16 bg-gray-50 rounded-3xl"
              data-aos="fade-up"
            >
              <i className="fas fa-calendar-times text-gray-300 text-7xl mb-6"></i>
              <p className="text-gray-500 text-xl font-semibold">
                Belum ada event terjadwal saat ini
              </p>
              <p className="text-gray-400 mt-2">
                Pantau terus untuk update event terbaru!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-br from-custom-mint/30 to-custom-sage/20" data-aos="fade-up">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-gray-700 mb-2">
                Event <span className="text-gray-400">Sebelumnya</span>
              </h3>
              <p className="text-gray-500">Momen seru yang sudah kami lalui bersama</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event, idx) => (
                <div 
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 bg-custom-cream"
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                >
                  {/* Past Event Card */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                    {event.event_gallery && event.event_gallery.length > 0 ? (
                      <img 
                        src={event.event_gallery[0]} 
                        alt={event.nama}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                      />
                    ) : (
                      <i className="fas fa-image text-gray-400 text-5xl"></i>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                        <i className="fas fa-calendar"></i>
                        <span>{event.tanggal} {event.bulan} {event.tahun}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-1 line-clamp-2">
                        {event.nama}
                      </h4>
                      <p className="text-xs text-gray-300 flex items-center gap-1">
                        <i className="fas fa-map-marker-alt"></i>
                        {event.lokasi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to Order */}
      <section id="how-to-order" className="py-20 px-6 bg-custom-cream" data-aos="fade-up">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-custom-green/10 text-custom-green rounded-full text-sm font-bold mb-4">
              PANDUAN
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Cara <span className="text-custom-green">Order Cheki</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              6 langkah mudah menuju momen spesialmu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'search', num: '01', title: 'Pilih Member', desc: 'Pilih member favoritmu dan masukkan ke keranjang belanja.' },
              { icon: 'pen', num: '02', title: 'Isi Data Diri', desc: 'Lengkapi form konfirmasi pemesanan dengan data yang benar.' },
              { icon: 'university', num: '03', title: 'Transfer', desc: 'Transfer sesuai total nominal ke rekening yang tertera.' },
              { icon: 'check', num: '04', title: 'Konfirmasi', desc: 'Upload bukti transfer dan submit form pemesanan.' },
              { icon: 'ticket-alt', num: '05', title: 'Terima Tiket', desc: 'Tunggu email balasan berisi konfirmasi booking-mu.' },
              { icon: 'camera', num: '06', title: 'Sesi Foto!', desc: 'Tunjukkan bukti di venue dan nikmati momen cheki!', special: true },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`group relative bg-gradient-to-br ${step.special ? 'from-custom-green via-green-500 to-green-600 text-white' : 'from-white to-custom-mint/20'} p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 ${step.special ? 'border-custom-green' : 'border-custom-green/20'}`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                {/* Step Number */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${step.special ? 'bg-white text-custom-green' : 'bg-gradient-to-br from-custom-green to-green-600 text-white'} flex items-center justify-center text-xl font-black shadow-xl border-2 ${step.special ? 'border-custom-green' : 'border-white'}`}>
                  {step.num}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.special ? 'bg-white/20' : 'bg-gradient-to-br from-custom-green/10 to-green-500/10'} flex items-center justify-center mb-6 border-2 ${step.special ? 'border-white/30' : 'border-custom-green/20'}`}>
                  <i className={`fas fa-${step.icon} text-3xl ${step.special ? 'text-white' : 'text-custom-green'}`}></i>
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-black mb-3 ${step.special ? 'text-white' : 'text-gray-800'}`}>
                  {step.title}
                </h3>
                <p className={`${step.special ? 'text-white/90' : 'text-gray-600'} leading-relaxed`}>
                  {step.desc}
                </p>

                {/* Hover Effect */}
                <div className={`absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-custom-green via-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl shadow-lg`}></div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-custom-mint/50 to-custom-sage/50 rounded-2xl p-8 max-w-3xl">
              <i className="fas fa-info-circle text-custom-green text-4xl mb-4"></i>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Informasi Penting</h4>
              <p className="text-gray-600 leading-relaxed">
                Pastikan data yang kamu isi sudah benar. Konfirmasi pemesanan akan dikirim via email maksimal 1x24 jam setelah transfer.
                Untuk pertanyaan, hubungi admin melalui <strong className="text-custom-green">Instagram</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section id="member-section" className="py-20 px-6 bg-gradient-to-br from-custom-mint/30 to-custom-sage/20" data-aos="fade-up">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-custom-green/10 text-custom-green rounded-full text-sm font-bold mb-4">
              KENALAN YUK!
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Member <span className="text-custom-green">Refresh Breeze</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Pilih member favoritmu dan pesan sesi cheki eksklusif bersama mereka!
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member, idx) => {
              const isGroup = member.member_id === 'group'
              const price = isGroup 
                ? parseInt(config.harga_cheki_grup || 30000)
                : parseInt(config.harga_cheki_per_member || 25000)

              return (
                <Tilt
                  key={idx}
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  glareEnable={true}
                  glareMaxOpacity={0.2}
                  glareColor="#079108"
                  glarePosition="all"
                  glareBorderRadius="24px"
                  scale={1.02}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-custom-cream rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 cursor-pointer h-full"
                    onClick={() => {
                      setSelectedMember(member)
                      setSelectedGalleryIndex(0)
                    }}
                  >
                  {/* Member Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-custom-green via-green-500 to-green-600">
                    <img 
                      src={member.image_url || '/placeholder.svg'} 
                      alt={member.nama_panggung || member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.src = '/placeholder.svg' }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Price Badge with green border */}
                    <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-custom-green/30">
                      <div className="text-custom-green text-sm font-black">
                        {price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                      </div>
                    </div>

                    {/* Instagram Button - Shows on Hover */}
                    {member.instagram && (
                      <a
                        href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fab fa-instagram text-lg"></i>
                      </a>
                    )}
                    
                    {/* Green corner accent */}
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-custom-green/40 to-transparent rounded-tr-full"></div>
                    
                    {/* Gallery indicator */}
                    {member.gallery && member.gallery.length > 0 && (
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <i className="fas fa-images"></i>
                        <span>{member.gallery.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-black text-gray-800 mb-2 text-center">
                      {member.nama_panggung || member.name}
                    </h3>
                    {member.tagline && (
                      <p className="text-sm text-custom-green font-semibold text-center mb-3">
                        {member.tagline}
                      </p>
                    )}
                    
                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(member, price)
                      }}
                      className="w-full bg-custom-green text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                    >
                      <motion.i
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.3 }}
                        className="fas fa-cart-plus"
                      />
                      <span>Tambah</span>
                    </motion.button>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-custom-green/5 rounded-tl-full"></div>
                </motion.div>
              </Tilt>
              )
            })}
          </div>

          {/* Info Banner */}
          <div className="mt-16 bg-gradient-to-r from-custom-green to-green-600 rounded-3xl p-8 shadow-2xl border-2 border-custom-green/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
                  <i className="fas fa-shopping-bag text-white text-3xl"></i>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-black text-white mb-2">Sudah Pilih Member Favorit?</h4>
                <p className="text-white/90">
                  Tambahkan ke keranjang dan lanjutkan ke checkout untuk melengkapi pesananmu!
                </p>
              </div>
              <button
                onClick={() => setCartModalOpen(true)}
                className="bg-white text-custom-green px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <i className="fas fa-shopping-cart"></i>
                <span>Lihat Keranjang</span>
                {totalItems > 0 && (
                  <span className="bg-custom-green text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout-section" className="py-20 px-6 bg-custom-ivory" data-aos="fade-up">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-custom-green/10 text-custom-green rounded-full text-sm font-bold mb-4">
              CHECKOUT
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Konfirmasi <span className="text-custom-green">Pembayaran</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Lengkapi data dan lakukan pembayaran untuk memastikan pesananmu
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Payment Info & Cart - Left Side (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Payment Info Card */}
              <div className="bg-gradient-to-br from-custom-green to-green-600 p-8 rounded-3xl shadow-xl text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-university text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Transfer Pembayaran</h3>
                    <p className="text-white/80 text-sm">Kirim sesuai total nominal</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Bank</p>
                    <p className="text-2xl font-black">{config.payment_bank}</p>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Nomor Rekening</p>
                      <p className="text-3xl font-black tracking-wider">{config.payment_rekening}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(config.payment_rekening)
                        toast.success('Nomor rekening berhasil disalin! 📋', {
                          position: 'top-center',
                          autoClose: 2000,
                        })
                      }}
                      className="bg-white text-custom-green px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 flex items-center gap-2"
                    >
                      <i className="fas fa-copy"></i>
                      <span className="hidden sm:inline">Salin</span>
                    </button>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-1">Atas Nama</p>
                    <p className="text-xl font-bold">{config.payment_atas_nama}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-white/70 mb-1">Cheki Solo</p>
                    <p className="text-xl font-black">
                      {parseInt(config.harga_cheki_per_member || 25000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-white/70 mb-1">Cheki Group</p>
                    <p className="text-xl font-black">
                      {parseInt(config.harga_cheki_grup || 30000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="bg-custom-cream rounded-3xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                    <i className="fas fa-shopping-cart text-custom-green"></i>
                    Keranjang Belanja
                  </h2>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-sm text-red-500 hover:text-red-700 font-semibold"
                    >
                      Kosongkan
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <i className="fas fa-shopping-cart text-6xl mb-4 opacity-30"></i>
                      <p className="font-semibold">Keranjang masih kosong</p>
                      <p className="text-sm mt-2">Pilih member favoritmu dulu yuk!</p>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex gap-4 items-center bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-lg">{item.name}</p>
                          <p className="text-custom-green font-semibold">
                            {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateCartQuantity(idx, 'decrease')}
                            className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full font-bold hover:bg-gray-200 hover:border-custom-green transition-all"
                          >
                            -
                          </button>
                          <span className="font-black w-8 text-center text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(idx, 'increase')}
                            className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full font-bold hover:bg-gray-200 hover:border-custom-green transition-all"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="w-8 h-8 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all ml-2"
                          >
                            <i className="fas fa-trash-alt text-sm"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-lg">
                        {totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-black text-custom-green">
                      <span>Total Bayar</span>
                      <span>{totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form - Right Side (2 columns) */}
            <div className="lg:col-span-2">
              <div className="bg-custom-cream rounded-3xl shadow-lg border border-gray-100 p-8 sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-custom-green/10 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-file-invoice text-custom-green text-3xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">Form Konfirmasi</h2>
                    <p className="text-gray-500 text-sm">Isi data dengan benar</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Event Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <i className="fas fa-calendar-alt text-custom-green mr-2"></i>
                      Pilih Event
                    </label>
                    <select
                      value={selectedEvent || ''}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:ring-2 focus:ring-custom-green/20 transition-all outline-none"
                      required
                    >
                      <option value="">-- Pilih Event --</option>
                      {upcomingEvents.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.nama} - {event.tanggal} {event.bulan} {event.tahun}
                        </option>
                      ))}
                    </select>
                    {upcomingEvents.length === 0 && (
                      <p className="text-sm text-amber-600 mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        Belum ada event upcoming. Hubungi admin untuk info lebih lanjut.
                      </p>
                    )}
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <i className="fas fa-user text-custom-green mr-2"></i>
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkapmu"
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:ring-2 focus:ring-custom-green/20 transition-all outline-none"
                      required
                    />
                  </div>

                  {/* Kontak (IG/WA) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <i className="fas fa-id-card text-custom-green mr-2"></i>
                      Instagram atau WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="@instagram atau 08xxxxxxxxxx"
                      value={formData.kontak}
                      onChange={(e) => setFormData({...formData, kontak: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:ring-2 focus:ring-custom-green/20 transition-all outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <i className="fas fa-info-circle mr-1"></i>
                      Isi dengan username Instagram (@username) atau nomor WhatsApp
                    </p>
                  </div>

                  {/* Upload Bukti Transfer */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <i className="fas fa-receipt text-custom-green mr-2"></i>
                      Bukti Transfer
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, payment_proof: e.target.files[0]})}
                        className="hidden"
                        id="payment-proof-input"
                        required
                      />
                      <label
                        htmlFor="payment-proof-input"
                        className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-custom-green hover:bg-custom-green/5 transition-all"
                      >
                        <div className="text-center">
                          {formData.payment_proof ? (
                            <>
                              <i className="fas fa-check-circle text-custom-green text-4xl mb-2"></i>
                              <p className="text-sm font-semibold text-custom-green">
                                {formData.payment_proof.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Klik untuk ganti file</p>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-cloud-upload-alt text-gray-400 text-4xl mb-2"></i>
                              <p className="text-sm font-semibold text-gray-600">
                                Klik untuk upload bukti transfer
                              </p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG max 5MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || cart.length === 0}
                    className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      submitting || cart.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-custom-green to-green-600 text-white hover:shadow-2xl hover:scale-105'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Kirim Pesanan</span>
                      </>
                    )}
                  </button>

                  {cart.length === 0 && (
                    <p className="text-center text-sm text-red-500 font-semibold">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Keranjang masih kosong!
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-20 px-6 bg-gradient-to-br from-custom-mint/30 to-custom-sage/20" data-aos="fade-up">
        <div className="container mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-custom-green/10 text-custom-green rounded-full text-sm font-bold mb-4">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Ada <span className="text-custom-green">Pertanyaan?</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Temukan jawaban untuk pertanyaan yang sering ditanyakan
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={faq.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                <summary className="flex justify-between items-center cursor-pointer p-6 list-none select-none">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-custom-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="fas fa-question text-custom-green text-lg"></i>
                    </div>
                    <span className="font-bold text-gray-800 text-lg leading-relaxed pr-4">
                      {faq.tanya}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-custom-green/10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-open:rotate-180">
                    <i className="fas fa-chevron-down text-custom-green"></i>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <div className="pl-14 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.jawab}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-custom-cream rounded-2xl p-8 shadow-lg border border-gray-100">
              <i className="fas fa-comments text-custom-green text-4xl mb-4"></i>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Masih ada pertanyaan?</h4>
              <p className="text-gray-600 mb-6">
                Hubungi kami melalui media sosial untuk informasi lebih lanjut
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="https://instagram.com/refreshbreeze"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <i className="fab fa-instagram text-xl"></i>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Cart Button */}
      <FloatingButton
        onClick={() => setCartModalOpen(true)}
        icon="fas fa-shopping-cart"
        label="Lihat Keranjang"
        count={totalItems}
      />

      {/* Member Profile Modal */}
      <MemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        onAddToCart={(member) => {
          const isGroup = member.member_id === 'group'
          const price = isGroup 
            ? parseInt(config.harga_cheki_grup || 30000)
            : parseInt(config.harga_cheki_per_member || 25000)
          addToCart(member, price)
        }}
        galleryIndex={selectedGalleryIndex}
        onGalleryChange={setSelectedGalleryIndex}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        total={totalPrice}
      />
    </div>
  )
}

export default HomePage
