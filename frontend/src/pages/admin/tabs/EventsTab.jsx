import React from 'react'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const EventsTab = ({ events, onCreateEvent, onEditEvent, onDeleteEvent, onTogglePast }) => {
  const isEventPast = (event) => {
    if (event.is_past) return true

    const months = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
      'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    }

    const eventDate = new Date(event.tahun, months[event.bulan] || 0, event.tanggal)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return eventDate < today
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <button
          onClick={onCreateEvent}
          className="bg-custom-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <FaPlus /> Tambah Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Lokasi</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Lineup</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">Belum ada event</td>
                </tr>
              ) : (
                events.map((event) => {
                  const past = isEventPast(event)
                  return (
                    <tr key={event.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{event.nama}</span>
                          {event.is_special && (
                            <span
                              className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
                              style={{ backgroundColor: event.theme_color || '#FF6B9D' }}
                            >
                              {event.theme_name || 'Special'}
                            </span>
                          )}
                        </div>
                        {event.event_time && <p className="text-xs text-gray-500">{event.event_time}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {event.tanggal} {event.bulan} {event.tahun}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{event.lokasi}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{event.event_lineup?.length || 0} member</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onTogglePast(event.id, event.is_past)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            past
                              ? 'bg-gray-200 text-gray-600 hover:bg-green-100 hover:text-green-700'
                              : 'bg-green-100 text-green-700 hover:bg-gray-200 hover:text-gray-600'
                          }`}
                          title={past ? 'Klik untuk aktifkan' : 'Klik untuk tandai selesai'}
                        >
                          {past ? '✓ Selesai' : '● Aktif'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEditEvent(event)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => onDeleteEvent(event.id, event.nama)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
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

export default EventsTab
