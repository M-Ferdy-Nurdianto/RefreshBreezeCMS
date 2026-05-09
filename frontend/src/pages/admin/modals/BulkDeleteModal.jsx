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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Hapus Data Pembelian</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              ⚠️ <strong>Perhatian:</strong> Data yang dihapus tidak bisa dikembalikan!
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pilih Jenis Hapus
            </label>
            <select
              value={deleteType}
              onChange={(e) => setDeleteType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Hapus Semua Data</option>
              <option value="event">Hapus Per Event</option>
              <option value="weeks">Hapus Per Minggu</option>
              <option value="months">Hapus Per Bulan</option>
            </select>
          </div>

          {deleteType === 'event' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Minggu Terakhir
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Akan menghapus data {weeks} minggu terakhir
              </p>
            </div>
          )}

          {deleteType === 'months' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Bulan Terakhir
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Akan menghapus data {months} bulan terakhir
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#dc2626] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#b91c1c] flex items-center justify-center gap-2"
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
