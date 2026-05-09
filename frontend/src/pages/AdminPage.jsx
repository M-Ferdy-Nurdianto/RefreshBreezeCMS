import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { supabase } from '../lib/supabase'
import Swal from 'sweetalert2'
import ExportModal from '../components/ExportModal'

// Tabs
import OrdersTab from './admin/tabs/OrdersTab'
import RecapTab from './admin/tabs/RecapTab'
import EventsTab from './admin/tabs/EventsTab'
import MerchTab from './admin/tabs/MerchTab'
import SettingsTab from './admin/tabs/SettingsTab'

// Modals
import OrderDetailModal from './admin/modals/OrderDetailModal'
import OTSOrderModal from './admin/modals/OTSOrderModal'
import BulkDeleteModal from './admin/modals/BulkDeleteModal'
import EventModal from './admin/modals/EventModal'

// Utils
import { generateExcel, generateMerchExcel, generateMerchPDF, generatePDF } from '../lib/exportUtils'

import {
  FaSignOutAlt,
  FaShoppingCart,
  FaCalendar,
  FaChartBar,
  FaBox,
  FaEdit
} from 'react-icons/fa'

const AdminPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [orderSubTab, setOrderSubTab] = useState('all')
  const [orders, setOrders] = useState([])
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({})
  const [configLoading, setConfigLoading] = useState(false)
  
  const [showExportModal, setShowExportModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [otsFilter, setOtsFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [recapEventFilter, setRecapEventFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [showOTSModal, setShowOTSModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)

  const [merch, setMerch] = useState([])
  const [merchOrders, setMerchOrders] = useState([])
  const [merchOrderStatusFilter, setMerchOrderStatusFilter] = useState('all')
  const [merchOrderSearch, setMerchOrderSearch] = useState('')
  const [loadingMerchOrders, setLoadingMerchOrders] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchAll()
    
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        fetchOrders()
        if (payload.eventType === 'INSERT' && payload.new.created_by === 'customer') {
          Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Order Baru!', text: `${payload.new.nama_lengkap}`, showConfirmButton: false, timer: 3000 })
        }
      }).subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  useEffect(() => { if (activeTab === 'orders') fetchOrders() }, [statusFilter, otsFilter, eventFilter, dateFilter, searchQuery, activeTab, orderSubTab])

  const checkAuth = () => { if (!localStorage.getItem('admin_token')) navigate('/admin/login') }
  
  const fetchAll = () => {
    fetchOrders(); fetchMembers(); fetchEvents(); fetchConfig(); fetchMerch(); fetchMerchOrders();
  }

  const fetchOrders = async () => {
    try {
      setLoading(true); const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (orderSubTab === 'ots') params.is_ots = 'true'
      else if (orderSubTab === 'po') params.is_ots = 'false'
      else if (otsFilter !== 'all') params.is_ots = otsFilter
      if (eventFilter !== 'all') params.event_id = eventFilter
      if (searchQuery) params.search = searchQuery
      if (dateFilter === 'custom' && dateFrom) { params.dateFrom = new Date(dateFrom).toISOString(); if (dateTo) params.dateTo = new Date(dateTo).toISOString() }
      const response = await api.get('/orders', { params })
      setOrders(response.data.data || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const fetchMembers = async () => { try { const res = await api.get('/members'); setMembers(res.data.data?.filter(m => m.member_id !== 'yanyee') || []) } catch (e) {} }
  const fetchEvents = async () => { try { const res = await api.get('/events'); setEvents(res.data.data || []) } catch (e) {} }
  const fetchConfig = async () => { try { const res = await api.get('/config'); setConfig(res.data.data || {}) } catch (e) {} }
  const fetchMerch = async () => { try { const res = await api.get('/merchandise'); setMerch(res.data.data || []) } catch (e) {} }
  const fetchMerchOrders = async () => {
    try {
      setLoadingMerchOrders(true); const params = {}
      if (merchOrderStatusFilter !== 'all') params.status = merchOrderStatusFilter
      if (merchOrderSearch) params.search = merchOrderSearch
      const res = await api.get('/merch-orders', { params })
      setMerchOrders(res.data.data || [])
    } catch (e) {} finally { setLoadingMerchOrders(false) }
  }

  const handleLogout = () => {
    Swal.fire({ title: 'Logout?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#079108' }).then(r => {
      if (r.isConfirmed) { localStorage.removeItem('admin_token'); navigate('/admin/login') }
    })
  }

  const handleExport = (data) => {
    const params = { status: statusFilter, is_ots: otsFilter, event_id: eventFilter, search: searchQuery }
    if (data.format === 'excel') generateExcel({ ...data, params, events, api })
    else generatePDF({ ...data, params, events, api })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Refresh<span className="text-[#079108]">Breeze</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'orders', label: 'Orders', icon: FaShoppingCart },
            { id: 'events', label: 'Events', icon: FaCalendar },
            { id: 'merch', label: 'Merchandise', icon: FaBox },
            { id: 'recap', label: 'Recap', icon: FaChartBar },
            { id: 'settings', label: 'Settings', icon: FaEdit },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black transition-all ${activeTab === item.id ? 'bg-[#079108] text-white shadow-lg shadow-[#079108]/20' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <item.icon className="text-lg" />
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-10 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 transition-all">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeTab === 'orders' && (
          <OrdersTab 
            orders={orders} orderSubTab={orderSubTab} setOrderSubTab={setOrderSubTab} loading={loading}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter} otsFilter={otsFilter} setOtsFilter={setOtsFilter}
            eventFilter={eventFilter} setEventFilter={setEventFilter} dateFilter={dateFilter} setDateFilter={setDateFilter}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} events={events}
            onViewDetail={(o) => { setSelectedOrder(o); setShowOrderDetailModal(true); }}
            onDelete={(id) => api.delete(`/orders/${id}`).then(() => fetchOrders())}
            onStatusChange={(id, s) => api.patch(`/orders/${id}/status`, { status: s }).then(() => fetchOrders())}
            onBulkDelete={() => setShowBulkDeleteModal(true)}
            onOTS={() => setShowOTSModal(true)}
            onExport={() => setShowExportModal(true)}
          />
        )}
        {activeTab === 'events' && (
          <EventsTab 
            events={events} onEdit={(e) => { setEditingEvent(e); setShowEventModal(true); }}
            onDelete={(id) => api.delete(`/events/${id}`).then(() => fetchEvents())}
            onCreate={() => { setEditingEvent(null); setShowEventModal(true); }}
          />
        )}
        {activeTab === 'merch' && (
          <MerchTab 
            merch={merch} merchOrders={merchOrders} loading={loadingMerchOrders}
            statusFilter={merchOrderStatusFilter} setStatusFilter={setMerchOrderStatusFilter}
            searchQuery={merchOrderSearch} setSearchQuery={setMerchOrderSearch}
            onFetchMerch={fetchMerch} onFetchOrders={fetchMerchOrders}
            onExportExcel={() => generateMerchExcel({ statusFilter: merchOrderStatusFilter, searchQuery: merchOrderSearch })}
            onExportPDF={() => generateMerchPDF({ api, statusFilter: merchOrderStatusFilter, searchQuery: merchOrderSearch })}
          />
        )}
        {activeTab === 'recap' && <RecapTab orders={orders} events={events} members={members} filter={recapEventFilter} setFilter={setRecapEventFilter} />}
        {activeTab === 'settings' && <SettingsTab config={config} onUpdate={(u) => api.patch('/config', u).then(() => fetchConfig())} />}
      </main>

      {/* Shared Modals */}
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} onExport={handleExport} events={events} />
      <OrderDetailModal isOpen={showOrderDetailModal} onClose={() => setShowOrderDetailModal(false)} order={selectedOrder} />
      <OTSOrderModal isOpen={showOTSModal} onClose={() => setShowOTSModal(false)} members={members} events={events} onRefresh={fetchOrders} />
      <BulkDeleteModal isOpen={showBulkDeleteModal} onClose={() => setShowBulkDeleteModal(false)} onConfirm={(t, p) => api.post('/orders/bulk-delete', { deleteType: t, ...p }).then(() => fetchOrders())} events={events} />
      <EventModal isOpen={showEventModal} onClose={() => setShowEventModal(false)} event={editingEvent} onRefresh={fetchEvents} members={members} />
    </div>
  )
}

export default AdminPage
