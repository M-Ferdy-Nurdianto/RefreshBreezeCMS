import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target) &&
        !e.target.closest('.custom-dropdown-portal-menu')
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close the dropdown on scroll to prevent the floating effect
  useEffect(() => {
    if (!isOpen) return
    const handleScroll = () => {
      setIsOpen(false)
    }
    window.addEventListener('scroll', handleScroll, { capture: true })
    
    // Also listen to horizontal scroll on the table container if present
    const tableContainers = document.querySelectorAll('.overflow-x-auto')
    tableContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true })
      tableContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll)
      })
    }
  }, [isOpen])

  // Calculate coordinates synchronously before painting to prevent flickering
  useLayoutEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = 160 // Estimated max height
      const shouldOpenUp = spaceBelow < menuHeight
      setOpenUp(shouldOpenUp)

      setCoords({
        top: shouldOpenUp 
          ? rect.top + window.scrollY 
          : rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [isOpen])

  const handleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = 160 // Estimated max height
      const shouldOpenUp = spaceBelow < menuHeight
      setOpenUp(shouldOpenUp)

      setCoords({
        top: shouldOpenUp 
          ? rect.top + window.scrollY 
          : rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
    setIsOpen(!isOpen)
  }

  const handleSelect = (val) => {
    onChange({ target: { value: val } })
    setIsOpen(false)
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative inline-block w-full custom-dropdown-container" ref={containerRef}>
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2 border-transparent outline-none ${
          variant === 'filter' 
            ? 'bg-slate-100/50 text-slate-700 hover:bg-slate-100 hover:border-slate-200 min-w-[140px]' 
            : `cursor-pointer ${className}`
        }`}
      >
        <span className="truncate">{selectedOption?.label || value}</span>
        <FaChevronDown className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div 
          className={`absolute bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-[9999] custom-dropdown-portal-menu animate-in fade-in slide-in-from-${openUp ? 'bottom' : 'top'}-2 duration-200`}
          style={{
            position: 'absolute',
            top: `${openUp ? coords.top - 4 : coords.top + 4}px`,
            left: `${coords.left}px`,
            width: `${Math.max(coords.width, 160)}px`, // minimum width 160px for elegant layout
            transform: openUp ? 'translateY(-100%)' : 'none',
          }}
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
        </div>,
        document.body
      )}
    </div>
  )
}

export default CustomSelect
