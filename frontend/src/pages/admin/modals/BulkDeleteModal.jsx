import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { FaTimes, FaTrash } from 'react-icons/fa'

const BulkDeleteModal = ({ events, onClose, onConfirm }) => {
  const [deleteType, setDeleteType] = useState('all')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [weeks, setWeeks] = useState(1)
  const [months, setMonths] = useState(1)

  const handleSubmit = () => {
    let confirmText = ''
    let params = {}

    switch (deleteType) {
      case 'all':
        confirmText = 'Hapus SEMUA data pembelian? Ini akan menghapus seluruh orders dan tidak bisa dikembalikan!'
        break
      case 'event':
        if (!selectedEventId) {
          Swal.fire('Error', 'Pilih event terlebih dahulu', 'error')
          return
        }
        const event = events.find(e => e.id === selectedEventId)
        confirmText = `Hapus semua data pembelian dari event "${event?.nama}"?`
        params = { eventId: selectedEventId }
        break
      case 'weeks':
        confirmText = `Hapus data pembelian ${weeks} minggu terakhir?`
        params = { weeks }
        break
      case 'months':
        confirmText = `Hapus data pembelian ${months} bulan terakhir?`
        params = { months }
        break
    }

    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(deleteType, params)
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#111726] border border-white/10 text-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="sticky top-0 bg-[#161f33] border-b border-white/10 p-5 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Hapus Data Pembelian</h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 transition-colors">
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-300 text-xs leading-relaxed font-medium">
              <strong className="text-red-400 font-bold">Perhatian:</strong> Data yang dihapus tidak bisa dikembalikan setelah dikonfirmasi!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Pilih Opsi Penghapusan
            </label>
            <select
              value={deleteType}
              onChange={(e) => setDeleteType(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#182032] border border-white/10 text-white text-xs rounded-xl focus:border-red-500 focus:outline-none"
            >
              <option value="all">Hapus Semua Data</option>
              <option value="event">Hapus Per Event</option>
              <option value="weeks">Hapus Per Minggu</option>
              <option value="months">Hapus Per Bulan</option>
            </select>
          </div>

          {deleteType === 'event' && (
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Pilih Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#182032] border border-white/10 text-white text-xs rounded-xl focus:border-red-500 focus:outline-none"
              >
                <option value="">-- Pilih Event --</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.nama} - {event.bulan} {event.tahun}
                  </option>
                ))}
              </select>
            </div>
          )}

          {deleteType === 'weeks' && (
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Jumlah Minggu Terakhir
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#182032] border border-white/10 text-white text-xs rounded-xl focus:border-red-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Akan menghapus data {weeks} minggu terakhir
              </p>
            </div>
          )}

          {deleteType === 'months' && (
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Jumlah Bulan Terakhir
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#182032] border border-white/10 text-white text-xs rounded-xl focus:border-red-500 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Akan menghapus data {months} bulan terakhir
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-white/10 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white/10 text-zinc-300 rounded-xl font-bold text-xs hover:bg-white/20 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              <FaTrash /> Hapus Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkDeleteModal
