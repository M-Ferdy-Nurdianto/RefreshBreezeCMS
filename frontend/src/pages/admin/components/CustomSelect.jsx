import React, { useState, useRef, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...', 
  className = '',
  variant = 'filter' // 'filter' or 'status'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = 160 // Estimated max height
      setOpenUp(spaceBelow < menuHeight)
    }
  }, [isOpen])

  const handleSelect = (val) => {
    onChange({ target: { value: val } })
    setIsOpen(false)
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative inline-block w-full custom-dropdown-container" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2 border-transparent outline-none ${
          variant === 'filter' 
            ? 'bg-slate-100/50 text-slate-700 hover:bg-slate-100 hover:border-slate-200 min-w-[140px]' 
            : `cursor-pointer ${className}`
        }`}
      >
        <span className="truncate">{selectedOption?.label || value}</span>
        <FaChevronDown className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-full min-w-[160px] bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-[999] animate-in fade-in slide-in-from-${openUp ? 'bottom' : 'top'}-2 duration-200`}
        >
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 py-2 text-xs transition-colors
                  ${opt.value === value 
                    ? 'bg-[#079108]/10 text-[#079108] font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomSelect
