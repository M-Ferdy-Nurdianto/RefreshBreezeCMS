import { motion } from 'framer-motion'
import { FaUsers, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa'
import Header from '../components/Header'

const StoryPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-4 py-32 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          {/* Animated Icon */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-[#079108]/10 rounded-full flex items-center justify-center mx-auto text-[#079108] mb-8 shadow-[0_0_30px_rgba(7,145,8,0.2)]"
          >
            <FaUsers className="text-4xl" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-widest text-dark uppercase">
              OUR STORY
            </h1>
            <div className="w-32 h-1.5 bg-[#079108] mx-auto rounded-full shadow-[0_0_15px_rgba(7,145,8,0.4)]"></div>
          </div>

          <div className="max-w-xl mx-auto space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black mb-4 tracking-widest animate-pulse uppercase">
              Profile Update in Progress
            </div>
            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">UNDER MAINTENANCE</h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              Halaman Tentang Kami sedang dalam pembaruan konten. Kami sedang menyiapkan rangkuman perjalanan terbaik kami untuk Anda.
            </p>
          </div>

          {/* Social Links to stay updated */}
          <div className="pt-12 space-y-8">
            <h3 className="text-xs font-black tracking-[0.4em] text-gray-400 uppercase">Stay Updated</h3>
            <div className="flex justify-center gap-6 sm:gap-8">
              {[
                { icon: <FaInstagram />, href: 'https://instagram.com/refbreeze', label: 'Instagram' },
                { icon: <FaTwitter />, href: 'https://twitter.com/ref_breeze', label: 'Twitter' },
                { icon: <FaYoutube />, href: 'https://youtube.com/@RefreshBreeze', label: 'YouTube' },
                { icon: <FaTiktok />, href: 'https://tiktok.com/@refbreeze', label: 'TikTok' },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-xl text-gray-400 hover:text-[#079108] hover:bg-[#079108]/5 transition-all shadow-sm hover:shadow-lg"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="fixed top-1/2 left-0 w-64 h-64 bg-[#079108] rounded-full blur-[120px] opacity-5 -translate-x-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#079108] rounded-full blur-[150px] opacity-5 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </main>
    </div>
  )
}

export default StoryPage
