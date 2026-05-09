import React from 'react'
import { FaDownload, FaTimes, FaEye } from 'react-icons/fa'

const OrderDetailModal = ({ order, events, onClose }) => {
  const generateReceipt = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const W = 500
    const pad = 30
    const lineH = 22

    const selectedEvent = events.find(e => e.id === order.event_id)
    const eventName = selectedEvent?.nama || order.event_name || '-'

    const items = order.order_items || []

    const logo = new Image()
    logo.src = '/images/logos/logo.webp'

    logo.onload = () => {
      let totalLines = 0
      totalLines += 8
      totalLines += 1
      totalLines += items.length
      totalLines += 3
      totalLines += 6
      if (order.catatan) totalLines += 2
      totalLines += 2
      totalLines += 3

      const H = 100 + (pad * 2) + (totalLines * lineH) + 100
      canvas.width = W
      canvas.height = H

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, W, H)

      let y = pad + 20

      const drawText = (text, x, size, color = '#000000', align = 'left', weight = 'normal', font = 'Courier New') => {
        ctx.fillStyle = color
        ctx.font = `${weight} ${size}px ${font}`
        ctx.textAlign = align
        ctx.fillText(text, x, y)
      }

      const drawDashedLine = () => {
        ctx.setLineDash([5, 5])
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(pad, y)
        ctx.lineTo(W - pad, y)
        ctx.stroke()
        ctx.setLineDash([])
        y += lineH
      }

      const logoW = 80
      const logoH = 80 * (logo.height / logo.width)
      ctx.drawImage(logo, (W - logoW) / 2, y, logoW, logoH)
      y += logoH + 20

      drawText('REFRESH BREEZE', W / 2, 24, '#000000', 'center', 'bold')
      y += lineH + 5
      drawText('Official Store', W / 2, 14, '#000000', 'center', 'normal')
      y += lineH + 5

      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      const boxW = 280
      const boxH = 34
      ctx.strokeRect((W - boxW) / 2, y, boxW, boxH)
      y += 24
      drawText(order.order_number, W / 2, 16, '#000000', 'center', 'bold')
      y += lineH + 10

      drawDashedLine()

      const dateStr = new Date(order.created_at).toLocaleString('id-ID')
      drawText(dateStr, pad, 12, '#000000', 'left', 'normal')
      drawText('Admin', W - pad, 12, '#000000', 'right', 'normal')
      y += lineH
      drawText(`Event: ${eventName}`, pad, 12, '#000000', 'left', 'normal')
      y += lineH

      drawDashedLine()

      items.forEach(item => {
        drawText(item.item_name, pad, 12, '#000000', 'left', 'bold')
        y += lineH - 4

        drawText(`${item.quantity} x ${item.price.toLocaleString('id-ID')}`, pad + 20, 12, '#000000', 'left', 'normal')
        drawText(`Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`, W - pad, 12, '#000000', 'right', 'normal')
        y += lineH + 4
      })

      drawDashedLine()

      drawText('Total QTY:', pad, 12, '#000000', 'left', 'normal')
      const totalQty = items.reduce((acc, i) => acc + i.quantity, 0)
      drawText(totalQty.toString(), W - pad, 12, '#000000', 'right', 'normal')
      y += lineH

      drawText('Sub Total', pad, 12, '#000000', 'left', 'normal')
      drawText(`Rp ${order.total_harga.toLocaleString('id-ID')}`, W - pad, 12, '#000000', 'right', 'normal')
      y += lineH + 5

      drawText('TOTAL', pad, 20, '#000000', 'left', 'bold')
      drawText(`Rp ${order.total_harga.toLocaleString('id-ID')}`, W - pad, 20, '#000000', 'right', 'bold')
      y += lineH + 10

      drawText('Metode Bayar', pad, 12, '#000000', 'left', 'normal')
      drawText(order.is_ots ? 'Cash/QRIS' : 'Transfer', W - pad, 12, '#000000', 'right', 'normal')
      y += lineH

      if (!order.is_ots) {
        drawText('Bank', pad, 12, '#000000', 'left', 'normal')
        drawText('BCA', W - pad, 12, '#000000', 'right', 'normal')
        y += lineH
        drawText('No. Rek', pad, 12, '#000000', 'left', 'normal')
        drawText('8162015779', W - pad, 12, '#000000', 'right', 'normal')
        y += lineH
        drawText('A/n', pad, 12, '#000000', 'left', 'normal')
        drawText('REYHAN ALFA SUKMAJATI', W - pad, 12, '#000000', 'right', 'normal')
        y += lineH
      }

      drawDashedLine()

      drawText('Nama  :', pad, 12, '#000000', 'left', 'normal')
      drawText(order.nama_lengkap || '-', pad + 80, 12, '#000000', 'left', 'bold')
      y += lineH
      drawText('Kontak:', pad, 12, '#000000', 'left', 'normal')
      const kontak = order.whatsapp && order.whatsapp !== '-' ? order.whatsapp : order.instagram
      drawText(kontak || '-', pad + 80, 12, '#000000', 'left', 'normal')
      y += lineH

      if (order.catatan) {
        drawText('Catatan:', pad, 12, '#000000', 'left', 'normal')
        y += lineH
        const words = order.catatan.split(' ')
        let line = ''
        words.forEach(word => {
          if (ctx.measureText(line + word).width > W - (pad * 2)) {
            drawText(line, pad, 12, '#000000', 'left', 'italic')
            line = word + ' '
            y += lineH
          } else {
            line += word + ' '
          }
        })
        drawText(line, pad, 12, '#000000', 'left', 'italic')
        y += lineH
      }

      drawDashedLine()

      y += 10
      drawText('Terima kasih telah berbelanja', W / 2, 14, '#000000', 'center', 'normal')
      y += lineH
      drawText('IG: @refreshbreeze', W / 2, 14, '#000000', 'center', 'bold')
      y += lineH

      const link = document.createElement('a')
      link.download = `Nota_${order.order_number}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    logo.onerror = () => {
      alert('Gagal memuat logo. Pastikan koneksi internet aman.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center bg-custom-green text-white">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold">Detail Order - {order.order_number}</h3>
            <button
              onClick={generateReceipt}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 transition-colors"
              title="Download Nota"
            >
              <FaDownload /> Nota
            </button>
          </div>
          <button onClick={onClose} className="text-2xl hover:text-gray-200">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <p className="font-semibold">{order.nama_lengkap}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="font-semibold">{order.whatsapp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Instagram</p>
              <p className="font-semibold">{order.instagram || '-'}</p>
            </div>
            <div></div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-bold mb-2">Order Items:</h4>
            <div className="space-y-2">
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span>{item.item_name} x {item.quantity}</span>
                  <span className="font-bold text-custom-green">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-extrabold text-2xl text-custom-green">
                Rp {order.total_harga?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {order.catatan && (
            <div className="border-t pt-4">
              <h4 className="font-bold mb-2">📝 Catatan:</h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.catatan}</p>
              </div>
            </div>
          )}

          {order.payment_proof_url && (
            <div className="border-t pt-4">
              <h4 className="font-bold mb-2">Bukti Transfer:</h4>
              <a
                href={order.payment_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={order.payment_proof_url}
                  alt="Payment Proof"
                  className="w-full max-w-md mx-auto rounded-lg border shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                />
              </a>
              <a
                href={order.payment_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm"
              >
                <FaEye className="inline mr-1" /> Lihat di Google Drive
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal
