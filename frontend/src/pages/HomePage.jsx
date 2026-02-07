
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaMinus, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowRight, FaShoppingCart, FaPlay, FaInstagram, FaTwitter, FaYoutube, FaSpotify, FaExternalLinkAlt, FaQuestionCircle } from 'react-icons/fa'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../lib/api'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { getAssetPath } from '../lib/pathUtils'

const HomePage = () => {
  const navigate = useNavigate()
  const [hoveredMember, setHoveredMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [activeMemberId, setActiveMemberId] = useState(null)

  // ---------------------------------------------------------------------------
  // HERO DATA
  // ---------------------------------------------------------------------------

  const initialMembers = [
    { id: 'cally', name: 'CALLY', color: 'bg-[#9BBF9B]', photo: getAssetPath('/images/hero/cally.webp?v=32'), posX: 27, posY: 28, scale: 1.8, translateX: 18, translateY: 0 },
    { id: 'yanyee', name: 'YANYEE', color: 'bg-[#7EAE7E]', photo: getAssetPath('/images/hero/yanyee.webp?v=32'), posX: 50, posY: 32, scale: 2, translateX: -26, translateY: -10 },
    { id: 'channie', name: 'CHANNIE', color: 'bg-[#6A9F6A]', photo: getAssetPath('/images/hero/channie.webp?v=32'), posX: 39, posY: 30, scale: 2.1, translateX: -8, translateY: 8 },
    { id: 'aca', name: 'ACA', color: 'bg-[#4A90B5]', photo: getAssetPath('/images/hero/aca.webp?v=32'), posX: 0, posY: 23, scale: 2.1, translateX: 18, translateY: 0 },
    { id: 'cissi', name: 'CISSI', color: 'bg-[#5A8F5A]', photo: getAssetPath('/images/hero/cissi.webp?v=32'), posX: 26, posY: 25, scale: 2.1, translateX: -27, translateY: 5 },
    { id: 'sinta', name: 'SINTA', color: 'bg-[#4C804C]', photo: getAssetPath('/images/hero/sinta.webp?v=32'), posX: 48, posY: 31, scale: 2, translateX: 18, translateY: 6 },
    { id: 'piya', name: 'PIYA', color: 'bg-[#3E723E]', photo: getAssetPath('/images/hero/piya.webp?v=32'), posX: 50, posY: 30, scale: 2.1, translateX: 5, translateY: 9 },
  ]

  const members = initialMembers




  const getMemberStyle = (member) => ({
    objectPosition: `${member.posX}% ${member.posY}%`,
    transform: `scale(${member.scale}) translate(${member.translateX}px, ${member.translateY}px)`
  })



  const [events, setEvents] = useState([])

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
    const fetchData = async () => {
        try {
            const [eventsRes, faqsRes] = await Promise.all([
                api.get('/events'),
                api.get('/faqs')
            ])

            if (eventsRes.data.success) {
                // Filter upcoming and sort by date
                const upcoming = eventsRes.data.data
                    .filter(e => !e.is_past)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3) // Take top 3
                setEvents(upcoming)
            }
            if (faqsRes.data.success) {
                setFaqs(faqsRes.data.data)
            }
        } catch (error) {
            console.error('Failed to fetch home data:', error)
        } finally {
            setLoading(false)
        }
    }
    fetchData()
  }, [])
  
  return (
    <div className="min-h-screen bg-white text-dark overflow-x-hidden relative">
      <div className="noise-bg opacity-10"></div>
      <Header />

      {/* Hero Section - Desktop: 7 columns, Mobile: Stacked with horizontal scroll members */}
      
      {/* Desktop Hero (7 columns) */}
      <section className="relative h-[100vh] w-full hidden md:flex overflow-hidden">
        {members.map((member, idx) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: Math.abs(idx - 3) * 0.1,
              ease: "easeOut"
            }}
            onMouseEnter={() => setHoveredMember(member.id)}
            onMouseLeave={() => setHoveredMember(null)}
            className="hero-column relative group cursor-pointer"
            onClick={() => navigate('/members')}
          >
            <div className="absolute inset-0">
               <img 
                 src={member.photo} 
                 alt={member.name} 
                 className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
               />
               <div className={`absolute inset-0 ${member.color} mix-blend-multiply opacity-30 group-hover:opacity-0 transition-opacity duration-700`}></div>
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>

            <div className="absolute inset-x-0 bottom-24 flex justify-center z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
              <span className="vertical-rl text-orientation-mixed text-white font-black text-xl md:text-2xl tracking-[0.2em] opacity-80 drop-shadow-2xl">
                {member.name}
              </span>
            </div>
          </motion.div>
        ))}

        <div className="absolute inset-x-0 bottom-[25%] flex flex-col items-center justify-center z-20 pointer-events-none">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.8 }
              }
            }}
            className="text-center"
          >
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 0.7, y: 0 } }}
              className="mb-1 text-[9px] tracking-[0.5em] font-bold text-white uppercase"
            >
              Japanese Style Idol Group • Tulungagung
            </motion.div>
            
            <motion.h1 
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
              className="text-3xl font-black tracking-[0.1em] text-white my-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              REFRESH BREEZE
            </motion.h1>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
              className="text-xs font-black tracking-[0.5em] text-accent-yellow uppercase"
            >
              リフレッシュ・ブリーズ
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 w-full h-2 caution-pattern z-30 opacity-60"></div>
      </section>

      {/* Mobile Hero - Option C: Top Header Focus */}
      <section className="md:hidden relative bg-white flex flex-col pt-16">
        {/* Branding Section at the Top */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-8 text-center bg-white"
        >
          <p className="text-[8px] tracking-[0.5em] font-black text-[#079108]/60 uppercase mb-2">
            Japanese Style Idol Group • Tulungagung
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#079108] mb-1">
            REFRESH BREEZE
          </h1>
          <p className="text-xs font-black tracking-[0.4em] text-accent-yellow">
            リフレッシュ・ブリーズ
          </p>
        </motion.div>

        {/* Member Strips Column - Full Width */}
        <div className="flex flex-col relative">
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, height: 80 }}
              animate={{ 
                opacity: 1,
                height: activeMemberId === member.id ? 180 : 80 
              }}
              whileHover={{ height: 120 }}
              transition={{ 
                height: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { delay: idx * 0.05 }
              }}
              onClick={() => setActiveMemberId(activeMemberId === member.id ? null : member.id)}
              className="relative overflow-hidden cursor-pointer group border-b border-white/5"
            >
              <img 
                src={member.photo} 
                alt={member.name}
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ${activeMemberId === member.id ? 'grayscale-0 scale-110 brightness-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'}`}
                style={getMemberStyle(member)}
              />
              <div className={`absolute inset-0 ${member.color} transition-opacity duration-700 z-10 ${activeMemberId === member.id ? 'opacity-0' : 'opacity-40 mix-blend-multiply group-hover:opacity-0'}`}></div>
            </motion.div>
          ))}
          
          {/* Bottom Hard Break - Caution Pattern */}
          <div className="h-2 w-full caution-pattern opacity-60"></div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-32 container mx-auto max-w-7xl px-4 relative z-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-8 h-1 bg-[#079108]"></div>
               <span className="text-[#079108] font-black tracking-[0.4em] text-xs uppercase">ABOUT US</span>
               <div className="w-8 h-1 bg-[#079108]"></div>
             </div>
             <h2 className="text-3xl md:text-5xl font-black tracking-tight text-dark uppercase mb-6">
               OUR <span className="text-[#079108]">STORY</span>
             </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border-2 border-dashed border-[#079108]/30 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black tracking-widest animate-pulse uppercase">
              Update in Progress
            </div>
            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">UNDER MAINTENANCE</h3>
            <p className="text-gray-500 text-lg leading-relaxed font-light max-w-2xl mx-auto">
              Kami sedang memperbarui rangkuman perjalanan Refresh Breeze untuk memberikan Anda pengalaman yang lebih berkesan. Halaman "Our Story" akan segera kembali dengan konten yang lebih segar!
            </p>
            <button 
              onClick={() => navigate('/story')}
              className="px-10 py-4 bg-gradient-to-r from-[#079108] to-emerald-500 text-white font-black tracking-[0.2em] text-xs uppercase rounded-full hover:shadow-2xl hover:scale-105 transition-all"
            >
              See Maintenance Status
            </button>
          </div>
        </motion.div>
      </section>

      {/* SCHEDULE SECTION */}
      <section className="py-12 sm:py-16 md:py-24 bg-[#079108]/5 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 sm:mb-16 gap-6 md:gap-8 text-center md:text-left">
                <div className="w-full">
                     <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-dark tracking-tighter uppercase mb-2 sm:mb-4">
                        Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#079108] to-[#a3e635]">Live</span>
                     </h2>
                     <p className="text-gray-500 font-bold max-w-lg uppercase tracking-[0.1em] opacity-80 mx-auto md:mx-0 text-xs sm:text-sm">
                        Jangan lewatkan penampilan seru kami di event terdekat!
                     </p>
                </div>
                <button 
                  onClick={() => navigate('/schedule')}
                  className="w-full md:w-auto px-8 py-4 md:py-3 rounded-full border-2 border-[#4A90B5]/20 text-[#4A90B5] font-black text-xs uppercase tracking-widest hover:bg-[#4A90B5] hover:text-white hover:border-[#4A90B5] transition-all"
                >
                    View Full Schedule
                </button>
            </div>

            {events.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Event (First One) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0a0f1d] text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden group cursor-pointer border border-[#079108]/30 hover:border-[#079108] hover:shadow-[0_0_50px_rgba(7,145,8,0.3)] transition-all"
                        onClick={() => navigate('/schedule')}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#079108] blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="inline-block px-4 py-2 bg-[#079108] rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(7,145,8,0.5)]">
                                    NEXT STAGE
                                </div>
                                {(events[0].is_special || events[0].nama.toLowerCase().includes('valentine')) && (
                                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF6B9D] to-[#FFD700] rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(255,107,157,0.4)]">
                                        PO ONLY
                                    </div>
                                )}
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black leading-tight mb-6 tracking-tight">
                                {events[0].nama}
                            </h3>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 sm:gap-4 text-gray-400 group-hover:text-white transition-colors">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#079108] shrink-0">
                                        <FaCalendarAlt size={16} />
                                    </div>
                                    <span className="font-bold tracking-wide text-sm sm:text-base">{events[0].tanggal} {events[0].bulan} {events[0].tahun}</span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 text-gray-400 group-hover:text-white transition-colors">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#079108] shrink-0">
                                        <FaClock size={16} />
                                    </div>
                                    <span className="font-bold tracking-wide text-sm sm:text-base">{events[0].event_time}</span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 text-gray-400 group-hover:text-white transition-colors">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#079108] shrink-0">
                                        <FaMapMarkerAlt size={16} />
                                    </div>
                                    <span className="font-bold tracking-wide text-sm sm:text-base line-clamp-1">{events[0].lokasi}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-[#a3e635] font-black text-xs uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
                                VIEW DETAILS <FaArrowRight />
                            </div>
                        </div>
                    </motion.div>

                    {/* Other Events List */}
                    <div className="space-y-6">
                        {events.slice(1).map((event, idx) => {
                            const isSpecial = event.nama.toLowerCase().includes('valentine') || event.is_special;
                            return (
                                <motion.div 
                                    key={event.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-1 rounded-[2.5rem] transition-all duration-500 overflow-hidden ${
                                        isSpecial 
                                        ? 'bg-gradient-to-r from-[#FF6B9D] via-pink-400 to-[#FFD700] p-[2px] shadow-[0_0_30px_rgba(255,107,157,0.2)]' 
                                        : 'bg-[#0a0f1d]/50 hover:bg-[#0a0f1d]'
                                    }`}
                                >
                                    <div 
                                        className={`bg-[#0a0f1d] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.4rem] border border-white/5 hover:border-[#079108]/50 transition-all cursor-pointer group flex items-center gap-4 sm:gap-6`}
                                        onClick={() => navigate('/schedule')}
                                    >
                                        <div className="text-center min-w-[50px] sm:min-w-[70px] relative">
                                            {isSpecial && (
                                                <div className="absolute -inset-4 bg-pink-500/20 blur-xl rounded-full"></div>
                                            )}
                                            <span className={`block text-2xl sm:text-3xl font-black relative ${isSpecial ? 'text-[#FF6B9D]' : 'text-[#079108]'}`}>{event.tanggal}</span>
                                            <span className="block text-[8px] sm:text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] relative">{event.bulan}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                                {isSpecial && (
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        <span className="text-[7px] sm:text-[8px] font-black bg-gradient-to-r from-[#FF6B9D] to-[#FFD700] text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-pink-500/30">SPECIAL</span>
                                                        <span className="text-[7px] sm:text-[8px] font-black bg-white/10 text-[#FF6B9D] border border-[#FF6B9D]/30 px-2 py-0.5 rounded-full uppercase tracking-widest">PO ONLY</span>
                                                    </div>
                                                )}
                                                <h4 className="text-base sm:text-xl font-black text-white group-hover:text-[#079108] transition-colors truncate">
                                                    {event.nama}
                                                </h4>
                                            </div>
                                            <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] sm:tracking-[0.2em] truncate">{event.lokasi}</p>
                                        </div>
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${isSpecial ? 'bg-pink-500/10 text-[#FF6B9D]' : 'bg-white/5 text-gray-500'} group-hover:bg-[#079108] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(7,145,8,0.5)]`}>
                                            <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform size-4 sm:size-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {events.length === 1 && (
                             <div className="h-full bg-[#0a0f1d]/30 border-2 border-dashed border-white/5 rounded-[2.5rem] flex items-center justify-center p-12">
                                <p className="text-gray-600 font-bold text-sm tracking-widest uppercase opacity-50">More events coming soon</p>
                             </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
                    <p className="text-gray-400 font-black tracking-widest uppercase opacity-50">No upcoming events scheduled</p>
                </div>
            )}
        </div>
      </section>

      {/* SHOP PREVIEW SECTION */}
      <section className="py-12 sm:py-16 md:py-24 bg-white relative">
        <div className="container mx-auto max-w-7xl px-4">
             <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-6xl font-black text-dark overflow-hidden">
                    <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        OFFICIAL MERCH
                    </motion.span>
                 </h2>
                 <p className="mt-4 text-gray-500 font-light">Dapatkan merchandise resmi Refresh Breeze</p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                 {/* Main Feature: Group Cheki */}
                 <div 
                    onClick={() => navigate('/shop')}
                    className="sm:col-span-2 lg:col-span-2 bg-[#0a0f1d] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden group cursor-pointer text-white h-[280px] sm:h-[350px] md:h-[400px] flex flex-col justify-end"
                 >
                    <img 
                        src={getAssetPath('/images/members/group.webp')} 
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#079108] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Best Seller</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-2 sm:mb-4">Group Cheki</h3>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-300 max-w-sm text-sm">Abadikan momen bersama seluruh member dalam satu frame eksklusif.</p>
                            <span className="w-12 h-12 rounded-full bg-white text-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaShoppingCart />
                            </span>
                        </div>
                    </div>
                 </div>

                 {/* Secondary Feature: Random Member / General */}
                 <div 
                    onClick={() => navigate('/shop')}
                    className="bg-gray-100 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden group cursor-pointer h-[280px] sm:h-[350px] md:h-[400px] flex flex-col justify-between"
                 >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#079108] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    
                    <div>
                        <h3 className="text-2xl font-black text-dark uppercase mb-2">Member Cheki</h3>
                        <p className="text-gray-500 text-sm font-bold">2-Shot Polaroid</p>
                    </div>

                    <div className="relative h-48 w-full">
                         {/* Polaroid Stacked Effect */}
                        {/* Aca (Front) - Main Subject */}
                        <div className="absolute bottom-0 right-0 w-32 h-44 bg-white p-1.5 pb-10 shadow-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 z-30 border border-gray-100">
                          <div className="w-full h-full overflow-hidden bg-gray-50/50 rounded-sm">
                            <img 
                              src={getAssetPath('/images/shop/aca.webp')} 
                              loading="lazy" 
                              className="w-full h-full object-contain scale-[1.3] grayscale group-hover:grayscale-0 transition-all duration-700 origin-top pt-2" 
                            />
                          </div>
                          <p className="absolute bottom-2 left-0 w-full text-center text-[7px] font-black text-gray-400 tracking-[0.2em] uppercase">Official Cheki</p>
                        </div>

                        {/* Sinta (Middle) */}
                        <div className="absolute bottom-2 right-12 w-30 h-40 bg-white p-1.5 pb-8 shadow-xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-20 border border-gray-100">
                          <div className="w-full h-full overflow-hidden bg-gray-50/50 rounded-sm">
                            <img 
                              src={getAssetPath('/images/shop/sinta.webp')} 
                              loading="lazy" 
                              className="w-full h-full object-contain scale-[1.3] grayscale group-hover:grayscale-0 transition-all duration-700 origin-top pt-2" 
                            />
                          </div>
                        </div>

                        {/* Cally (Back) */}
                        <div className="absolute bottom-4 right-24 w-28 h-36 bg-white p-1.5 pb-8 shadow-lg transform -rotate-12 group-hover:-rotate-20 transition-transform duration-500 z-10 border border-gray-100 opacity-80 group-hover:opacity-100">
                          <div className="w-full h-full overflow-hidden bg-gray-50/50 rounded-sm">
                            <img 
                              src={getAssetPath('/images/shop/cally.webp')} 
                              loading="lazy" 
                              className="w-full h-full object-contain scale-[1.3] grayscale group-hover:grayscale-0 transition-all duration-700 origin-top pt-2" 
                            />
                          </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-dark font-black text-xs uppercase tracking-widest group-hover:text-[#079108] transition-colors">
                        Browse All <FaArrowRight />
                    </div>
                 </div>
             </div>

             <div className="text-center mt-12">
                 <button 
                    onClick={() => navigate('/shop')}
                    className="px-10 py-4 bg-[#079108] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#068007] transition-all shadow-xl shadow-[#079108]/20 hover:scale-105"
                 >
                    Visit Store
                 </button>
             </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-12 sm:py-16 md:py-24 bg-[#079108]/5 text-dark overflow-hidden relative">
         <div className={`absolute top-0 left-0 w-full h-full bg-[url('${getAssetPath('/noise.png')}')] opacity-5`}></div>
         <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 sm:mb-16 gap-4 md:gap-6 text-center md:text-left">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-dark">
                   Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#079108] to-emerald-400">Media</span>
                </h2>
                <button 
                  onClick={() => navigate('/media')}
                  className="w-full md:w-auto px-6 py-3 rounded-full border border-gray-200 text-gray-500 hover:text-dark font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                   View Gallery <FaArrowRight />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[
                    { 
                      type: 'video', 
                      title: 'JEWEL KISS - 恋華 (Lovers Flower)', 
                      thumb: 'https://img.youtube.com/vi/77iP-nJ4b8Q/sddefault.jpg', 
                      url: 'https://youtu.be/77iP-nJ4b8Q?si=CfZ3haCys12C7ONg'
                    },
                    { 
                      type: 'video', 
                      title: 'FRUiTY - LOVE SONG FOR YOU', 
                      thumb: 'https://img.youtube.com/vi/Twin7LVhnHI/sddefault.jpg', 
                      url: 'https://youtu.be/Twin7LVhnHI?si=r-REpbjFgJkvrv7r'
                    },
                    { 
                      type: 'video', 
                      title: 'MARY ANGEL - LIKE A ANGEL', 
                      thumb: 'https://img.youtube.com/vi/dKcq3tR69sM/sddefault.jpg', 
                      url: 'https://youtu.be/dKcq3tR69sM?si=DnheTptSVN-FK-cl'
                    },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group aspect-video relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                        onClick={() => navigate('/media')}
                    >
                        <img 
                           src={item.thumb}
                           alt={item.title}
                           loading="lazy"
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                           onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' }}
                        />
                         <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 shadow-2xl">
                                   <FaPlay className="ml-1" />
                              </div>
                         </div>
                         <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                             <p className="text-xs font-bold truncate text-white">{item.title}</p>
                         </div>
                    </motion.div>
                ))}
            </div>
         </div>
      </section>




      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 container mx-auto max-w-3xl px-4 relative z-40">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase text-dark">
            Help Center
          </h2>
          <div className="w-20 h-1 bg-[#079108] mx-auto opacity-50"></div>
        </div>

        <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={faq.id || idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`transition-all duration-300 border-2 border-[#079108]/20 hover:border-[#079108] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(7,145,8,0.1)] ${openFaq === idx ? 'border-[#079108] shadow-md' : ''}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-6 px-6 text-left flex items-center justify-between gap-6 group relative overflow-hidden"
                >
                  <span className={`text-base md:text-lg font-bold transition-colors ${openFaq === idx ? 'text-dark' : 'text-gray-500 group-hover:text-[#079108]'}`}>
                    {faq.tanya}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === idx ? 'bg-[#079108] text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-[#079108]/10 group-hover:text-[#079108]'}`}>
                    {openFaq === idx ? <FaMinus size={10} /> : <FaPlus size={10} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 pt-2 text-gray-500 text-sm md:text-base font-medium leading-relaxed pl-8 md:pl-10">
                        {faq.jawab}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>
      </section>



      <Footer />
    </div>
  )
}

export default HomePage
