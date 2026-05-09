import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { FaTimes } from 'react-icons/fa'
import api from '../../../lib/api'
import { formatMemberName } from '../../../lib/memberUtils'

const OTSOrderModal = ({ members, events, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    event_id: '',
    payment_method: 'Cash',
    items: []
  })
  const [submitting, setSubmitting] = useState(false)

  const addItem = (member) => {
    const isGroup = member.member_id === 'group'
    const price = isGroup ? 30000 : 25000

    const existing = formData.items.find(item => item.member_id === member.id)
    if (existing) {
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.member_id === member.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      })
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, {
          member_id: member.id,
          name: `Cheki ${formatMemberName(member.nama_panggung)}`,
          price: price,
          quantity: 1
        }]
      })
    }
  }

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/orders/ots', formData)
      Swal.fire({
        icon: 'success',
        title: 'Order OTS Berhasil!',
        confirmButtonColor: '#079108'
      })
      onSuccess()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.error || error.message,
        confirmButtonColor: '#079108'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center bg-custom-green text-white">
          <h3 className="text-xl font-bold">Order OTS (On The Spot)</h3>
          <button onClick={onClose} className="text-2xl hover:text-gray-200">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <select
                value={formData.event_id}
                onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green bg-white"
                required
              >
                <option value="">-- Pilih Event *--</option>
                {events.filter(e => !e.is_special).map(event => (
                  <option key={event.id} value={event.id}>
                    {event.nama} - {event.tanggal} {event.bulan} {event.tahun}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Nama Lengkap *"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-custom-green"
                required
              />

              <div>
                <label className="block text-sm font-semibold mb-2">Metode Pembayaran *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: 'Cash'})}
                    className={`px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                      formData.payment_method === 'Cash'
                        ? 'bg-custom-green text-white border-custom-green'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-custom-green'
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: 'QR'})}
                    className={`px-4 py-3 rounded-lg font-semibold border-2 transition-all ${
                      formData.payment_method === 'QR'
                        ? 'bg-custom-green text-white border-custom-green'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-custom-green'
                    }`}
                  >
                    📱 QR Code
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-2">Items:</h4>
                {formData.items.length === 0 ? (
                  <p className="text-gray-400 text-sm">Pilih member di sebelah kanan</p>
                ) : (
                  <div className="space-y-2">
                    <div className="max-h-[120px] overflow-y-auto space-y-2 pr-2">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-sm">{item.name} x {item.quantity}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-custom-green">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-l pl-6">
              <h4 className="font-bold mb-4">Pilih Member:</h4>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => addItem(member)}
                    className="p-3 border rounded-lg hover:border-custom-green hover:bg-custom-mint/20 transition-colors text-left"
                  >
                    <div className="text-sm font-semibold">{formatMemberName(member.nama_panggung)}</div>
                    <div className="text-xs text-gray-500">
                      Rp {(member.member_id === 'group' ? 30000 : 25000).toLocaleString('id-ID')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse md:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || formData.items.length === 0}
              className="flex-1 bg-custom-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OTSOrderModal
