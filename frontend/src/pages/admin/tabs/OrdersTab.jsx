import React from 'react'
import Swal from 'sweetalert2'
import { FaShoppingCart, FaPlus, FaFileExcel, FaBox, FaEye, FaTrash } from 'react-icons/fa'
import RenderTable from '../components/RenderTable'

const OrdersTab = ({
  orders,
  events,
  loading,
  orderSubTab,
  setOrderSubTab,
  statusFilter,
  setStatusFilter,
  eventFilter,
  setEventFilter,
  dateFilter,
  setDateFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  searchQuery,
  setSearchQuery,
  onViewOrder,
  onDeleteOrder,
  onStatusChange,
  onShowOTSModal,
  onShowBulkDeleteModal,
  onExportExcel,
  onExportPdf,
  merchOrders,
  loadingMerchOrders,
  merchOrderSearch,
  setMerchOrderSearch,
  merchOrderStatusFilter,
  setMerchOrderStatusFilter,
  onMerchOrderStatusChange,
  onDeleteMerchOrder,
  onFetchMerchOrders,
  onExportMerchExcel,
  onExportMerchPdf
}) => {
  // Helper to check if order is from special event
  const isSpecialOrder = (order) => {
    const event = events.find(e => e.id === order.event_id)
    return event && (event.is_special || event.type === 'special')
  }

  // Filter Logic
  const specialOrders = orders.filter(o => isSpecialOrder(o))
  const otsOrders = orders.filter(o => o.is_ots && !isSpecialOrder(o))
  const poOrders = orders.filter(o => !o.is_ots && !isSpecialOrder(o))

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setOrderSubTab('all')}
            className={`flex-1 min-w-[120px] px-4 py-4 font-semibold transition-colors ${
              orderSubTab === 'all'
                ? 'bg-custom-green text-white border-b-4 border-green-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <FaShoppingCart /> All (Reg)
            </span>
          </button>
          <button
            onClick={() => setOrderSubTab('ots')}
            className={`flex-1 min-w-[120px] px-4 py-4 font-semibold transition-colors ${
              orderSubTab === 'ots'
                ? 'bg-orange-500 text-white border-b-4 border-orange-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              OTS
            </span>
          </button>
          <button
            onClick={() => setOrderSubTab('po')}
            className={`flex-1 min-w-[120px] px-4 py-4 font-semibold transition-colors ${
              orderSubTab === 'po'
                ? 'bg-blue-500 text-white border-b-4 border-blue-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              PO
            </span>
          </button>
          <button
            onClick={() => setOrderSubTab('special')}
            className={`flex-1 min-w-[120px] px-4 py-4 font-semibold transition-colors ${
              orderSubTab === 'special'
                ? 'bg-pink-500 text-white border-b-4 border-pink-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              Special
            </span>
          </button>
          <button
            onClick={() => { setOrderSubTab('merch'); onFetchMerchOrders() }}
            className={`flex-1 min-w-[120px] px-4 py-4 font-semibold transition-colors ${
              orderSubTab === 'merch'
                ? 'bg-custom-green text-white border-b-4 border-green-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <FaBox /> Merch
            </span>
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center text-sm text-blue-800">
        <span className="font-bold whitespace-nowrap">Panduan Status:</span>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white border border-gray-300"></span>
            <span><strong>Unchecked:</strong> Order baru</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-400"></span>
            <span><strong>Checked:</strong> Lunas (Valid)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-100 border border-green-400"></span>
            <span><strong>Completed:</strong> Selesai (Diambil)</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari nama atau order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Unchecked</option>
            <option value="checked">Checked</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green bg-white"
          >
            <option value="all">Semua Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.nama} - {event.bulan} {event.tahun}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green bg-white"
          >
            <option value="all">Semua Waktu</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {dateFilter === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end border-t pt-4">
          <button
            onClick={async () => {
              const { value: format } = await Swal.fire({
                title: 'Export Data',
                input: 'radio',
                inputOptions: {
                  'excel': '📊 Excel (.xlsx)',
                  'pdf': '📄 PDF Document'
                },
                inputValidator: (value) => {
                  if (!value) return 'Pilih format export!'
                },
                confirmButtonText: 'Lanjut →',
                confirmButtonColor: '#079108',
                showCancelButton: true,
                cancelButtonText: 'Batal'
              })

              if (!format) return

              const eventOptions = { 'current': '📋 Sesuai Filter di Layar' }
              events.forEach(ev => {
                eventOptions[`event_${ev.id}`] = `🎫 ${ev.nama} (${ev.bulan} ${ev.tahun})`
              })

              const { value: scope } = await Swal.fire({
                title: 'Pilih Cakupan Data',
                width: '600px',
                html: `
                  <div class="selection-grid">
                    <label class="selection-card active" id="card-current">
                      <input type="radio" name="export-scope" value="current" checked>
                      <span class="card-subtitle">Data Saat Ini</span>
                      <span class="card-title">Sesuai Filter di Layar</span>
                      <div class="card-check">✓</div>
                    </label>
                    ${events.map(ev => `
                      <label class="selection-card" id="card-${ev.id}">
                        <input type="radio" name="export-scope" value="event_${ev.id}">
                        <span class="card-subtitle">${ev.bulan} ${ev.tahun}</span>
                        <span class="card-title">${ev.nama}</span>
                        <div class="card-check">✓</div>
                      </label>
                    `).join('')}
                  </div>
                `,
                didOpen: () => {
                  const container = Swal.getHtmlContainer()
                  const cards = container.querySelectorAll('.selection-card')
                  cards.forEach(card => {
                    card.addEventListener('click', () => {
                      cards.forEach(c => c.classList.remove('active'))
                      card.classList.add('active')
                      card.querySelector('input').checked = true
                    })
                  })
                },
                preConfirm: () => {
                  const checked = Swal.getHtmlContainer().querySelector('input[name="export-scope"]:checked')
                  if (!checked) {
                    Swal.showValidationMessage('Silakan pilih salah satu!')
                    return false
                  }
                  return checked.value
                },
                confirmButtonText: format === 'excel' ? '📊 Download Excel' : '📄 Download PDF',
                confirmButtonColor: format === 'excel' ? '#079108' : '#EF4444',
                showCancelButton: true,
                cancelButtonText: 'Batal',
                customClass: {
                  popup: 'rounded-3xl',
                  title: 'text-xl font-black uppercase tracking-tight pt-8',
                  confirmButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-xs',
                  cancelButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-xs'
                }
              })

              if (!scope) return

              const isEvent = scope.startsWith('event_')
              const eventId = isEvent ? scope.replace('event_', '') : null

              if (format === 'excel') {
                await onExportExcel({ scope: isEvent ? 'event' : 'current', value: eventId })
              } else {
                await onExportPdf({ scope: isEvent ? 'event' : 'current', value: eventId })
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold active:scale-95"
          >
            <FaFileExcel /> Export Data
          </button>
          <button
            onClick={onShowBulkDeleteModal}
            className="bg-[#dc2626] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#b91c1c] transition-colors flex items-center gap-2"
          >
            <FaTrash /> Hapus Data
          </button>
        </div>
      </div>

      {/* Orders Tables */}
      {orderSubTab === 'special' && (
        <RenderTable
          data={specialOrders}
          title="Special Event Orders"
          icon={<span className="text-xl"></span>}
          emptyMessage="Tidak ada order special event"
          loading={loading}
          onView={onViewOrder}
          onDelete={onDeleteOrder}
          onStatusChange={onStatusChange}
        />
      )}

      {(orderSubTab === 'all' || orderSubTab === 'ots') && (
        <RenderTable
          data={otsOrders}
          title="Order OTS (On The Spot)"
          icon={<span className="text-xl"></span>}
          emptyMessage="Tidak ada data OTS"
          loading={loading}
          onView={onViewOrder}
          onDelete={onDeleteOrder}
          onStatusChange={onStatusChange}
          action={
            <button
              onClick={onShowOTSModal}
              className="bg-custom-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
            >
              <FaPlus /> Order OTS
            </button>
          }
        />
      )}

      {(orderSubTab === 'all' || orderSubTab === 'po') && (
        <RenderTable
          data={poOrders}
          title="Pre-Order (Online)"
          icon={<span className="text-xl"></span>}
          emptyMessage="Tidak ada data Pre-Order"
          loading={loading}
          onView={onViewOrder}
          onDelete={onDeleteOrder}
          onStatusChange={onStatusChange}
        />
      )}

      {orderSubTab === 'merch' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">Order Merch</h3>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const { value: format } = await Swal.fire({
                    title: 'Export Merch Data',
                    input: 'radio',
                    inputOptions: { 'excel': '📊 Excel', 'pdf': '📄 PDF' },
                    inputValidator: v => !v && 'Pilih format!',
                    confirmButtonText: 'Download',
                    confirmButtonColor: '#079108',
                    showCancelButton: true
                  })
                  if (format === 'excel') await onExportMerchExcel()
                  else if (format === 'pdf') await onExportMerchPdf()
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2 text-sm"
              >
                <FaFileExcel /> Export Merch
              </button>
              <button
                onClick={onFetchMerchOrders}
                className="bg-custom-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Cari nama / WA / order..."
              value={merchOrderSearch}
              onChange={e => setMerchOrderSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onFetchMerchOrders()}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green flex-1 min-w-[180px]"
            />
            <select
              value={merchOrderStatusFilter}
              onChange={e => setMerchOrderStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="checked">Checked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={onFetchMerchOrders} className="bg-custom-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">Cari</button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-custom-green text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Pembeli</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Catatan</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingMerchOrders ? (
                    <tr><td colSpan="7" className="text-center py-10 text-gray-400">Loading...</td></tr>
                  ) : merchOrders.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-10 text-gray-400">Belum ada order merch</td></tr>
                  ) : (
                    merchOrders.map((order) => (
                      <tr key={order.id} className={`border-b hover:bg-gray-50 transition-colors ${
                        order.status === 'pending' ? '' : order.status === 'checked' ? 'bg-blue-50/30' : order.status === 'completed' ? 'bg-green-50/30' : 'bg-red-50/30'
                      }`}>
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-800 text-sm">{order.order_number}</p>
                          <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800 text-sm">{order.nama_lengkap || '-'}</p>
                          <p className="text-xs text-gray-500">WA: {order.whatsapp}</p>
                          {order.instagram && <p className="text-xs text-gray-500">IG: {order.instagram}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            {order.merch_order_items?.map((item, i) => (
                              <p key={i} className="text-xs text-gray-600">
                                {item.item_name} {item.size && <span className="text-gray-400 font-normal">({item.size})</span>} <span className="font-bold text-custom-green">x{item.quantity}</span>
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-custom-green">Rp {order.total_harga.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px]">
                          <p className="truncate" title={order.catatan}>{order.catatan || '-'}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={order.status}
                            onChange={e => onMerchOrderStatusChange(order.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-bold border border-gray-200 focus:ring-2 focus:ring-custom-green ${
                              order.status === 'pending' ? 'bg-white text-gray-600' :
                              order.status === 'checked' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="checked">Checked</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            {order.payment_proof_url && (
                              <a href={order.payment_proof_url} target="_blank" rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg"
                                title="Lihat Bukti Bayar"
                              ><FaEye /></a>
                            )}
                            <button onClick={() => onDeleteMerchOrder(order.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersTab
