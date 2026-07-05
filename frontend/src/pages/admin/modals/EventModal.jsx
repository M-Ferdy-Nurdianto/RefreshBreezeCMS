import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { FaTimes } from 'react-icons/fa'
import api from '../../../lib/api'
import { formatMemberName } from '../../../lib/memberUtils'
import { showToast } from '../../../lib/toast'

const EventModal = ({ members, onClose, onSuccess, editingEvent }) => {
  const isEditingSpecial = editingEvent?.is_special === true || editingEvent?.type === 'special'
  const [eventType, setEventType] = useState(isEditingSpecial ? 'special' : 'regular')
  const [formData, setFormData] = useState(() => {
    if (editingEvent) {
      const existingLineup = editingEvent.event_lineup
        ?.filter(el => el.members?.member_id !== 'piya')
        .map(el => el.member_id) || []
      return {
        ...editingEvent,
        lineup: existingLineup,
        is_special: editingEvent.is_special || false,
        theme_name: editingEvent.theme_name || '',
        theme_color: editingEvent.theme_color || '#FF6B9D'
      }
    }
    return {
      nama: '', tanggal: '', bulan: '', tahun: new Date().getFullYear(),
      lokasi: '', event_time: '', cheki_time: '', is_past: false,
      is_special: false, theme_name: '', theme_color: '#FF6B9D', lineup: []
    }
  })
  const [submitting, setSubmitting] = useState(false)

  const presetColors = [
    '#FF6B9D', '#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'
  ]

  const toggleMemberInLineup = (memberId) => {
    setFormData(prev => ({
      ...prev,
      lineup: prev.lineup.includes(memberId)
        ? prev.lineup.filter(id => id !== memberId)
        : [...prev.lineup, memberId]
    }))
  }

  useEffect(() => {
    setFormData(prev => ({ ...prev, is_special: eventType === 'special' }))
  }, [eventType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingEvent) {
        // Clean payload: only send fields that exist in the events table
        const payload = {
          nama: formData.nama,
          tanggal: formData.tanggal,
          bulan: formData.bulan,
          tahun: formData.tahun,
          lokasi: formData.lokasi,
          event_time: formData.event_time,
          cheki_time: formData.cheki_time,
          is_past: formData.is_past,
          type: eventType,
          is_special: eventType === 'special',
          theme_name: eventType === 'special' ? formData.theme_name : null,
          theme_color: eventType === 'special' ? formData.theme_color : null,
          lineup: formData.lineup // Send the array of UUIDs
        }

        await api.patch(`/events/${editingEvent.id}`, payload)
        showToast.success('Event Updated!')
      } else {
        const payload = { 
          ...formData, 
          type: eventType, 
          is_special: eventType === 'special',
          theme_name: eventType === 'special' ? formData.theme_name : null,
          theme_color: eventType === 'special' ? formData.theme_color : null,
          lineup: formData.lineup 
        }
        await api.post('/events', payload)
        showToast.success('Event Created!')
      }
      onSuccess()
    } catch (error) {
      showToast.error(error.response?.data?.error || error.message, 'Gagal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-custom-green text-white">
          <h3 className="text-lg font-bold">{editingEvent ? 'Edit Event' : 'Tambah Event'}</h3>
          <button onClick={onClose} className="text-xl hover:text-gray-200"><FaTimes /></button>
        </div>

        <div className="flex border-b bg-gray-50">
          <button
            type="button"
            onClick={() => setEventType('regular')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${eventType === 'regular' ? 'bg-white border-b-2 border-custom-green text-custom-green' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📅 Event Regular
          </button>
          <button
            type="button"
            onClick={() => setEventType('special')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${eventType === 'special' ? 'bg-white border-b-2 border-pink-500 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🎀 Event Spesial
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1">
          <input
            type="text"
            placeholder="Nama Event *"
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            required
          />

          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Tgl"
              value={formData.tanggal}
              onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              min="1" max="31" required
            />
            <select
              value={formData.bulan}
              onChange={(e) => setFormData({...formData, bulan: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
              required
            >
              <option value="">Bulan</option>
              {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => (
                <option key={m} value={['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][i]}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Tahun"
              value={formData.tahun}
              onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              required
            />
          </div>

          {eventType === 'regular' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Lokasi *"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Jam Event (14:00 WIB)"
                  value={formData.event_time}
                  onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Jam Cheki (15:00 - 17:00 WIB)"
                value={formData.cheki_time}
                onChange={(e) => setFormData({...formData, cheki_time: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </>
          )}

          {eventType === 'special' && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 space-y-2">
              <input
                type="text"
                placeholder="Nama Tema (Valentine Edition)"
                value={formData.theme_name}
                onChange={(e) => setFormData({...formData, theme_name: e.target.value})}
                className="w-full px-3 py-2 border border-pink-200 rounded-lg text-sm"
                required
              />
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 mr-1">Warna:</span>
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, theme_color: color})}
                    className={`w-6 h-6 rounded-full ${formData.theme_color === color ? 'ring-2 ring-offset-1 ring-gray-800' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-pink-600">⚠️ Event spesial hanya tersedia untuk Pre-Order</p>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Lineup ({formData.lineup?.length || 0})</label>
            <div className="grid grid-cols-3 gap-1 border rounded-lg p-2 bg-gray-50">
              {(() => {
                const lineupOrder = ['cissi', 'acaa', 'channie', 'cally', 'sinta']
                return members
                  .filter(m => m.member_id !== 'group' && m.member_id !== 'piya' && m.hadir !== false)
                  .sort((a, b) => {
                    const iA = lineupOrder.indexOf(a.member_id)
                    const iB = lineupOrder.indexOf(b.member_id)
                    return (iA !== -1 ? iA : 99) - (iB !== -1 ? iB : 99)
                  })
                  .map((member) => (
                    <label key={member.id} className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.lineup?.includes(member.id) || false}
                        onChange={() => toggleMemberInLineup(member.id)}
                        className="w-3 h-3"
                      />
                      {formatMemberName(member.nama_panggung)}
                    </label>
                  ))
              })()}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:bg-gray-400 ${eventType === 'special' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-custom-green hover:bg-green-700'}`}
            >
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
