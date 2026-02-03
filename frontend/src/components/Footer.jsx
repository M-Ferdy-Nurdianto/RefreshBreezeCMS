import { FaYoutube, FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-custom-green via-green-600 to-green-700 text-center py-16 mt-20 border-t-4 border-custom-green relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          className="text-4xl md:text-5xl font-black text-white mb-4 tracking-widest drop-shadow-lg"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          REFRESH BREEZE
        </div>
        <p 
          className="text-white/90 text-base md:text-lg mb-8 font-medium"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          Angin Segar dari Tulungagung 🌿
        </p>
        
        <div 
          className="flex justify-center gap-6 mb-8"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
        >
          <a
            href="https://www.youtube.com/@refreshbreeze"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-custom-green p-4 rounded-2xl text-4xl transition-all transform hover:scale-110 hover:rotate-6 shadow-lg"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.instagram.com/refbreeze/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-pink-600 p-4 rounded-2xl text-4xl transition-all transform hover:scale-110 hover:-rotate-6 shadow-lg"
          >
            <FaInstagram />
          </a>
        </div>

        <div className="h-px bg-white/30 max-w-xl mx-auto mb-6"></div>

        <p className="text-white/80 text-sm mb-3">© 2026 Refresh Breeze. All rights reserved.</p>
        
        {/* Hidden Admin Link */}
        <Link 
          to="/admin/login"
          className="inline-block text-xs text-white/50 hover:text-white transition-colors hover:underline"
        >
          Staff Access
        </Link>
      </div>
    </footer>
  )
}

export default Footer
