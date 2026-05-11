import React, { useRef } from 'react'
import { FaDownload, FaChevronLeft, FaExclamationTriangle } from 'react-icons/fa'
import { toPng } from 'html-to-image'

const DigitalReceipt = ({ data, payment, onBack, onDownload }) => {
  const receiptRef = useRef(null)
  if (!data) return null

  // Special theme color logic
  const accentColor = data.isSpecial ? (data.themeColor || '#FF6B9D') : '#079108'
  const isMerch = data.orderNumber?.startsWith('MERCH')

  // Styles for the typewriter/receipt look
  const receiptFontStyle = {
    fontFamily: '"Courier New", Courier, monospace',
    color: '#333',
    lineHeight: '1.4'
  }

  const handleDownload = async () => {
    if (receiptRef.current === null) return

    try {
      // Create a clone for capturing to ensure specific resolution and styles
      const node = receiptRef.current;
      
      // Hide buttons during capture
      const buttons = node.querySelector('.receipt-actions');
      if (buttons) buttons.style.display = 'none';

      const dataUrl = await toPng(node, {
        width: 655,
        style: {
          transform: 'none',
          width: '655px',
          height: 'auto',
          borderRadius: '0',
          margin: '0',
          padding: '40px 60px'
        },
        pixelRatio: 2,
        backgroundColor: '#fff',
      });

      if (buttons) buttons.style.display = 'flex';

      const link = document.createElement('a');
      const safeName = (data.nama || 'User').trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      link.download = `${safeName}_${data.orderNumber}.png`;
      link.href = dataUrl;
      link.click();
      
      if (onDownload) onDownload();
    } catch (err) {
      console.error('Oops, something went wrong!', err);
    }
  }

  const separator = "------------------------------------------------------------"

  const maskPhone = (phone) => {
    if (!phone) return '-';
    const str = String(phone).replace(/\s/g, '');
    if (str.length <= 4) return str;
    return '*'.repeat(Math.max(0, str.length - 4)) + str.slice(-4);
  };

  const formatContact = (contact) => {
    if (!contact) return '-';
    const str = String(contact).trim();
    // Check if it's likely a phone number (mostly digits)
    const isPhoneNumber = /^[\d\s\+\-\(\)]+$/.test(str) && str.replace(/\D/g, '').length >= 8;
    
    if (isPhoneNumber) {
      return maskPhone(str);
    }
    // Otherwise treat as username
    return str.startsWith('@') ? str : `@${str}`;
  };

  return (
    <div className="relative flex flex-col items-center py-12 px-4 min-h-screen bg-slate-50 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#079108]/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div 
        ref={receiptRef}
        className="relative z-10 bg-white shadow-2xl shadow-emerald-900/10 overflow-hidden flex flex-col ring-1 ring-gray-900/5" 
        style={{ 
          ...receiptFontStyle, 
          width: '655px', // <--- Atur Lebar Nota di sini
          maxWidth: '100%',
          minHeight: 'auto', // <--- Diubah jadi auto agar tidak kosong di bawah
          padding: '40px 60px'
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-1 mb-4 mt-2">
          <img src="/images/logos/logo.webp" alt="Refresh Breeze" className="h-16 object-contain mb-1" />
          <h2 className="text-2xl font-bold tracking-[0.1em] text-black uppercase">REFRESH BREEZE</h2>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Official Website</p>
        </div>

        {/* Order Badge */}
        <div className="mb-4 px-2">
          <div 
            className="w-full py-3 rounded-lg text-center shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <span className="text-white font-bold tracking-[0.2em] text-lg">{data.orderNumber}</span>
          </div>
        </div>

        {/* Dividers & Meta */}
        <div className="space-y-1 mb-4 px-2">
          <div className="text-gray-800 text-sm font-bold opacity-80">{separator}</div>
          <div className="flex justify-between items-center text-xs font-bold text-gray-700">
            <span>{data.createdAt}</span>
            <span>Admin</span>
          </div>
          <div className="text-gray-800 text-sm font-bold opacity-80">{separator}</div>
        </div>

        {/* Customer Info */}
        <div className="space-y-2 mb-4 px-4">
          <div className="flex text-sm">
            <span className="w-24 flex-shrink-0">Nama</span>
            <span className="mr-2">:</span>
            <span className="font-bold">{data.nama}</span>
          </div>
          {/* For Cheki order (Single Contact Field) */}
          {!isMerch && data.kontak && (
            <div className="flex text-sm">
              <span className="w-24 flex-shrink-0">Kontak</span>
              <span className="mr-2">:</span>
              <span>{formatContact(data.kontak)}</span>
            </div>
          )}
          {!isMerch && data.eventName && data.eventName !== '-' && (
            <div className="flex text-sm">
              <span className="w-24 flex-shrink-0">Event</span>
              <span className="mr-2">:</span>
              <span className="font-bold">{data.eventName}</span>
            </div>
          )}

          {/* For Merch order (Two Contact Fields) */}
          {isMerch && data.whatsapp && (
            <div className="flex text-sm">
              <span className="w-24 flex-shrink-0">WhatsApp</span>
              <span className="mr-2">:</span>
              <span>{maskPhone(data.whatsapp)}</span>
            </div>
          )}
          {isMerch && data.instagram && (
            <div className="flex text-sm">
              <span className="w-24 flex-shrink-0">Instagram</span>
              <span className="mr-2">:</span>
              <span>{data.instagram.startsWith('@') ? data.instagram : `@${data.instagram}`}</span>
            </div>
          )}
          <div className="flex flex-col text-sm pt-1">
            <div className="flex">
              <span className="w-24 flex-shrink-0">Catatan</span>
              <span className="mr-2">:</span>
            </div>
            <span className="italic text-gray-700 pl-4">{data.catatan || '-'}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="text-gray-800 text-sm font-bold opacity-80 mb-4 px-2">{separator}</div>

        {/* Items Section */}
        <div className="space-y-4 mb-4 px-4">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <h4 className="text-sm font-bold uppercase leading-tight mb-1" style={{ color: accentColor }}>
                {item.name} {item.size ? `(${item.size})` : ''}
              </h4>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 font-bold">
                  {item.quantity} x Rp {item.price?.toLocaleString('id-ID')}
                </p>
                <span className="text-sm font-bold" style={{ color: accentColor }}>
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="text-gray-800 text-sm font-bold opacity-80 mb-4 px-2">{separator}</div>

        {/* Summary */}
        <div className="space-y-2 mb-4 px-4">
          <div className="flex justify-between text-sm font-bold text-gray-700">
            <span>Total QTY:</span>
            <span>{data.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-700">
            <span>Sub Total</span>
            <span>Rp {data.total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
            <span className="text-2xl font-black">TOTAL</span>
            <span className="text-3xl font-black" style={{ color: accentColor }}>
              Rp {data.total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-2 mb-4 px-4 text-sm font-bold">
          <div className="flex justify-between">
            <span className="w-40 text-gray-700">Metode Bayar</span>
            <span className="text-right">Transfer</span>
          </div>
          <div className="flex justify-between">
            <span className="w-40 text-gray-700">Bank</span>
            <span className="text-right">BCA</span>
          </div>
          <div className="flex justify-between">
            <span className="w-40 text-gray-700">No. Rek</span>
            <span className="text-right">0902683273</span>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex justify-between">
              <span className="w-40 text-left text-gray-700">A/n</span>
              <span className="font-black uppercase text-gray-900">NATASYA ANGELINA PUTRI</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="text-gray-800 text-sm font-bold opacity-80 mb-4 px-2">{separator}</div>

        {/* Notes */}
        <div className="text-center space-y-2 mb-4 px-4">
          <div className="flex items-center justify-center gap-2 text-[#C68D00] text-[11px] font-bold">
            <FaExclamationTriangle className="text-xs" />
            <p>Catatan Pengambilan {isMerch ? 'Merchandise' : 'Solo/Spesial Cheki'}</p>
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-bold leading-relaxed px-4">
            {isMerch ? 'Merchandise' : 'Solo/Spesial Cheki'} bisa diambil di next event jika tidak datang, atau bisa dikirim dengan catatan ongkir ditanggung pembeli (Konfirmasi via Admin).
          </p>
        </div>

        {/* Divider */}
        <div className="text-gray-800 text-sm font-bold opacity-80 mb-6 px-2">{separator}</div>

        {/* Footer */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <p className="text-sm font-bold italic" style={{ color: accentColor }}>
            Terima kasih telah berbelanja
          </p>
          <p className="text-xs font-bold text-gray-500">
            IG: <span style={{ color: accentColor }}>@refreshbreeze</span>
          </p>
        </div>

        {/* Actions (Hidden on capture) */}
        <div className="receipt-actions flex gap-4 w-full mt-auto pt-8 pb-4 px-4 print:hidden">
          <button 
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <FaChevronLeft className="text-xs" />
            Kembali
          </button>
          <button 
            onClick={handleDownload}
            className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
          >
            <FaDownload className="text-xs" />
            Download Nota
          </button>
        </div>
      </div>
    </div>
  )
}

export default DigitalReceipt
