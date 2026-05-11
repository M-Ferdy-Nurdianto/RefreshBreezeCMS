import React, { useState } from 'react'
import { FaEye, FaTrash, FaImage } from 'react-icons/fa'
import CustomSelect from './CustomSelect'

const RenderTable = ({ data, title, icon, emptyMessage, action, loading, onView, onDelete, onStatusChange }) => {
  const scrollContainerRef = React.useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleSliderChange = (e) => {
    if (scrollContainerRef.current) {
      const value = e.target.value
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
      scrollContainerRef.current.scrollLeft = (value / 100) * maxScroll
      setScrollProgress(value)
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const maxScroll = scrollWidth - clientWidth
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100)
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          {icon} {title}
          <span className="text-sm font-normal text-gray-500 ml-2">({data.length} items)</span>
        </h3>
        {action}
      </div>

      <div className="relative">
        <div className="md:hidden px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Geser untuk melihat detail</span>
            <span className="flex-1 border-t border-gray-300"></span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={scrollProgress}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-custom-green"
          />
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto"
          onScroll={handleScroll}
        >
          <table className="w-full min-w-[1000px]">
            <thead className="bg-custom-green text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Items</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Bukti Bayar</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Total</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Tanggal</th>
                <th className="px-4 py-3 text-center text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <i className="fas fa-spinner animate-spin text-3xl text-custom-green"></i>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((order) => {
                  const isSpecial = order.events?.type === 'special' || !!order.events?.theme_color
                  const themeColor = isSpecial ? order.events?.theme_color : order.is_merch ? '#079108' : null

                  return (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={themeColor ? { borderLeft: `4px solid ${themeColor}` } : {}}
                    >
                      <td className="px-4 py-3 text-sm font-mono">
                        {order.order_number}
                        {isSpecial && (
                          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: themeColor }}>
                            Special
                          </div>
                        )}
                        {order.is_merch && (
                          <div className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                            Merch
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-semibold">{order.nama_lengkap}</div>
                        <div className="text-xs text-blue-600 font-medium">{order.whatsapp && order.whatsapp !== '-' ? `WA: ${order.whatsapp}` : order.instagram && order.instagram !== '-' ? `IG: ${order.instagram}` : ''}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="space-y-1">
                          {order.order_items?.map((item, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-medium">{item.item_name}</span>
                              <span className="text-gray-500"> x{item.quantity}</span>
                            </div>
                          )) || <span className="text-gray-400">No items</span>}
                          {order.catatan && (
                            <div className="mt-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 max-w-[250px] truncate" title={order.catatan}>
                              📝 {order.catatan}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {!order.is_ots && order.payment_proof_url ? (
                          <a
                            href={order.payment_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                          >
                            <FaImage /> Lihat
                          </a>
                        ) : order.is_ots ? (
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            order.payment_proof_url === 'QR' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {order.payment_proof_url || 'Cash'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-custom-green">
                        Rp {order.total_harga?.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3">
                        <CustomSelect
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value)}
                          variant="status"
                          className={
                            order.status === 'pending' ? 'bg-white text-gray-600 border-gray-300' :
                            order.status === 'checked' ? 'bg-blue-100 text-blue-700 border-blue-400' :
                            'bg-green-100 text-green-700 border-green-400'
                          }
                          options={[
                            { value: 'pending', label: 'Unchecked' },
                            { value: 'checked', label: 'Checked' },
                            { value: 'completed', label: 'Completed' }
                          ]}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onView(order)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            title="Detail"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => onDelete(order.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RenderTable
