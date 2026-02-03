import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes, FaShoppingCart, FaDownload } from 'react-icons/fa'

const Header = ({ cartCount = 0, onCartClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Event', href: '#event-section' },
    { name: 'Cara Order', href: '#how-to-order' },
    { name: 'Member', href: '#member-section' },
    { name: 'Konfirmasi', href: '#checkout-section' },
    { name: 'FAQ', href: '#faq-section' },
  ]

  const handleNavClick = (href) => {
    setMobileMenuOpen(false)
    setTimeout(() => {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <header className="sticky top-0 bg-gradient-to-r from-custom-cream via-custom-mint/10 to-custom-cream shadow-lg z-50 border-b-2 border-custom-green/20 backdrop-blur-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-custom-green to-green-600 bg-clip-text text-transparent tracking-wider hover:scale-105 transition-transform"
          data-aos="fade-right"
          data-aos-duration="800"
        >
          REFRESH BREEZE
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="text-gray-600 hover:text-custom-green font-medium transition-colors border-b-2 border-transparent hover:border-custom-green pb-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* APK Download Button */}
            <a
              href="/app/RefreshBreeze.apk"
              download
              className="hidden sm:flex bg-gradient-to-r from-custom-green to-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold items-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
              data-aos="fade-left"
              data-aos-duration="800"
            >
              <FaDownload />
              <span>App</span>
            </a>

            {/* Cart Icon */}
            {onCartClick && (
              <button
                onClick={onCartClick}
                className="relative px-2 py-2 transition-all hover:bg-custom-green/10 rounded-xl group"
                data-aos="fade-left"
                data-aos-duration="800"
                data-aos-delay="100"
              >
                <FaShoppingCart className="text-2xl text-custom-green group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-black shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-custom-green text-2xl p-1"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-custom-cream to-custom-mint/20 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out p-6 pt-20 border-l-4 border-custom-green ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute top-4 left-4 text-xl font-extrabold bg-gradient-to-r from-custom-green to-green-600 bg-clip-text text-transparent">MENU</div>
        <div className="space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(link.href)
              }}
              className="block py-3 px-3 text-lg text-gray-800 hover:bg-custom-mint/50 rounded-lg transition-colors font-semibold"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="absolute bottom-6 w-[calc(100%-48px)]">
          <a
            href="/app/RefreshBreeze.apk"
            download
            className="w-full bg-custom-green text-white px-4 py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg"
          >
            <FaDownload /> Download App
          </a>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default Header
