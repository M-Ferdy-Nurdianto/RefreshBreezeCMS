import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../lib/api'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { getAssetPath } from '../lib/pathUtils'

// Refactored Components
import HeroSection from '../components/home/HeroSection'
import AboutSection from '../components/home/AboutSection'
import ScheduleSection from '../components/home/ScheduleSection'
import ShopPreviewSection from '../components/home/ShopPreviewSection'
import MediaSection from '../components/home/MediaSection'
import FAQSection from '../components/home/FAQSection'

const HomePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [activeMemberId, setActiveMemberId] = useState(null)
  const [events, setEvents] = useState([])
  const [merchPreview, setMerchPreview] = useState([])

  const members = [
    { id: 'cissi', name: 'CISSI', color: 'bg-[#5A8F5A]', photo: getAssetPath('/images/hero/cissi.webp?v=32'), posX: 26, posY: 25, scale: 2.1, translateX: -27, translateY: 5 },
    { id: 'channie', name: 'CHANNIE', color: 'bg-[#6A9F6A]', photo: getAssetPath('/images/hero/channie.webp?v=32'), posX: 39, posY: 30, scale: 2.1, translateX: -8, translateY: 8 },
    { id: 'sinta', name: 'SINTA', color: 'bg-[#4C804C]', photo: getAssetPath('/images/hero/sinta.webp?v=32'), posX: 48, posY: 31, scale: 2, translateX: 18, translateY: 6 },
    { id: 'aca', name: 'ACA', color: 'bg-[#4A90B5]', photo: getAssetPath('/images/hero/aca.webp?v=32'), posX: 0, posY: 23, scale: 2.1, translateX: 18, translateY: 0 },
    { id: 'piya', name: 'PIYA', color: 'bg-[#3E723E]', photo: getAssetPath('/images/hero/piya.webp?v=32'), posX: 50, posY: 30, scale: 2.1, translateX: 5, translateY: 9 },
    { id: 'cally', name: 'CALLY', color: 'bg-[#9BBF9B]', photo: getAssetPath('/images/hero/cally.webp?v=32'), posX: 27, posY: 28, scale: 1.8, translateX: 18, translateY: 0 },
  ]

  useEffect(() => {
    AOS.init({ duration: 1000, once: true })
    const fetchData = async () => {
        try {
            const [eventsRes, faqsRes] = await Promise.all([ api.get('/events'), api.get('/faqs') ])
            if (eventsRes.data.success) {
                const upcoming = eventsRes.data.data
                    .filter(e => !e.is_past)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3)
                setEvents(upcoming)
            }
            if (faqsRes.data.success) setFaqs(faqsRes.data.data)
            try {
                const merchRes = await api.get('/merchandise?available=true')
                if (merchRes.data.success) setMerchPreview(merchRes.data.data.slice(0, 4))
            } catch (_) {}
        } catch (error) {
            console.error('Failed to fetch home data:', error)
        } finally {
            setLoading(false)
        }
    }
    fetchData()
  }, [])
  
  if (loading) return null // Or a loader

  return (
    <div className="min-h-screen bg-white text-dark overflow-x-hidden relative">
      <div className="noise-bg opacity-10"></div>
      <Header />
      
      <HeroSection 
        members={members} activeMemberId={activeMemberId} setActiveMemberId={setActiveMemberId} navigate={navigate} 
      />
      
      <AboutSection navigate={navigate} getAssetPath={getAssetPath} />
      
      <ScheduleSection events={events} navigate={navigate} />
      
      <ShopPreviewSection merchPreview={merchPreview} navigate={navigate} getAssetPath={getAssetPath} />
      
      <MediaSection navigate={navigate} getAssetPath={getAssetPath} />
      
      <FAQSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />

      <Footer />
    </div>
  )
}

export default HomePage
