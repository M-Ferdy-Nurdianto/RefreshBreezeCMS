import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { supabase } from '../lib/supabase'
import { showToast } from '../lib/toast'
import Swal from 'sweetalert2'

import OrdersTab from './admin/tabs/OrdersTab'
import RecapTab from './admin/tabs/RecapTab'
import EventsTab from './admin/tabs/EventsTab'
import MerchTab from './admin/tabs/MerchTab'
import SettingsTab from './admin/tabs/SettingsTab'

import OrderDetailModal from './admin/modals/OrderDetailModal'
import OTSOrderModal from './admin/modals/OTSOrderModal'
import BulkDeleteModal from './admin/modals/BulkDeleteModal'
import EventModal from './admin/modals/EventModal'

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

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('admin_active_tab') || 'orders')
  const [orderSubTab, setOrderSubTab] = useState(() => localStorage.getItem('admin_order_subtab') || 'all')
  const [orders, setOrders] = useState([])
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('admin_status_filter') || 'all')
  const [otsFilter, setOtsFilter] = useState(() => localStorage.getItem('admin_ots_filter') || 'all')
  const [eventFilter, setEventFilter] = useState(() => localStorage.getItem('admin_event_filter') || 'all')
  const [recapEventFilter, setRecapEventFilter] = useState(() => localStorage.getItem('admin_recap_event_filter') || 'all')
  const [dateFilter, setDateFilter] = useState(() => localStorage.getItem('admin_date_filter') || 'all')
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('admin_search_query') || '')
  const [dateFrom, setDateFrom] = useState(() => localStorage.getItem('admin_date_from') || '')
  const [dateTo, setDateTo] = useState(() => localStorage.getItem('admin_date_to') || '')

  const [showOTSModal, setShowOTSModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)

  const [hargaPerMember, setHargaPerMember] = useState('25000')
  const [hargaGrup, setHargaGrup] = useState('30000')
  const [configLoading, setConfigLoading] = useState(false)

  const [merch, setMerch] = useState([])
  const [merchOrders, setMerchOrders] = useState([])
  const [showMerchForm, setShowMerchForm] = useState(false)
  const [editingMerch, setEditingMerch] = useState(null)
  const [merchForm, setMerchForm] = useState({ nama: '', deskripsi: '', harga: '', stok: '', available: true, sizes: [], size_chart_urls: [] })
  const [merchImageFile, setMerchImageFile] = useState(null)
  const [merchImagePreview, setMerchImagePreview] = useState('')
  const [merchSizeChartFiles, setMerchSizeChartFiles] = useState([null])
  const [merchSizeChartPreviews, setMerchSizeChartPreviews] = useState([''])
  const [availableSizes, setAvailableSizes] = useState('')
  const [merchSaving, setMerchSaving] = useState(false)
  const merchFileInputRef = useRef(null)
  const sizeChart1InputRef = useRef(null)

  const [merchOrderStatusFilter, setMerchOrderStatusFilter] = useState('all')
  const [merchOrderSearch, setMerchOrderSearch] = useState('')
  const [loadingMerchOrders, setLoadingMerchOrders] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchAll()

    let subscription = null
    if (supabase) {
      subscription = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          fetchOrders()
          if (payload.eventType === 'INSERT' && payload.new.created_by === 'customer') {
            showToast.info(payload.new.nama_lengkap, 'Order Baru!')
          }
        })
        .subscribe()
    }

    return () => {
      if (supabase && subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('admin_active_tab', activeTab)
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [statusFilter, otsFilter, eventFilter, dateFilter, dateFrom, dateTo, searchQuery, activeTab, orderSubTab])

  useEffect(() => {
    localStorage.setItem('admin_order_subtab', orderSubTab)
  }, [orderSubTab])

  useEffect(() => {
    localStorage.setItem('admin_status_filter', statusFilter)
    localStorage.setItem('admin_ots_filter', otsFilter)
    localStorage.setItem('admin_event_filter', eventFilter)
    localStorage.setItem('admin_recap_event_filter', recapEventFilter)
    localStorage.setItem('admin_date_filter', dateFilter)
    localStorage.setItem('admin_search_query', searchQuery)
    if (dateFrom) localStorage.setItem('admin_date_from', dateFrom)
    else localStorage.removeItem('admin_date_from')
    if (dateTo) localStorage.setItem('admin_date_to', dateTo)
    else localStorage.removeItem('admin_date_to')
  }, [statusFilter, otsFilter, eventFilter, recapEventFilter, dateFilter, searchQuery, dateFrom, dateTo])

  const checkAuth = () => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin/login')
    }
  }

  const fetchAll = () => {
    fetchOrders()
    fetchMembers()
    fetchEvents()
    fetchConfig()
    fetchMerch()
    fetchMerchOrders()
  }

  const buildOrderParams = () => {
    const params = {}

    if (statusFilter !== 'all') params.status = statusFilter

    if (orderSubTab === 'ots') params.is_ots = 'true'
    else if (orderSubTab === 'po') params.is_ots = 'false'
    else if (otsFilter !== 'all') params.is_ots = otsFilter

    if (eventFilter !== 'all') params.event_id = eventFilter
    if (searchQuery) params.search = searchQuery

    if (dateFilter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      params.dateFrom = weekAgo.toISOString()
    } else if (dateFilter === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      params.dateFrom = monthAgo.toISOString()
    } else if (dateFilter === 'custom' && dateFrom) {
      params.dateFrom = new Date(dateFrom).toISOString()
      if (dateTo) params.dateTo = new Date(dateTo).toISOString()
    }

    return params
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = buildOrderParams()
      const response = await api.get('/orders', { params })
      setOrders(response.data.data || [])
    } catch (error) {
      console.error(error)
      if (error.response?.status === 401) {
        navigate('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members')
      setMembers(res.data.data?.filter(m => m.member_id !== 'yanyee' && m.member_id !== 'piya' && m.hadir !== false) || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchConfig = async () => {
    try {
      const res = await api.get('/config')
      const configData = res.data.data || {}
      if (configData.harga_cheki_per_member) setHargaPerMember(configData.harga_cheki_per_member)
      if (configData.harga_cheki_grup) setHargaGrup(configData.harga_cheki_grup)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchMerch = async () => {
    try {
      const res = await api.get('/merchandise')
      setMerch(res.data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchMerchOrders = async () => {
    try {
      setLoadingMerchOrders(true)
      const params = {}
      if (merchOrderStatusFilter !== 'all') params.status = merchOrderStatusFilter
      if (merchOrderSearch) params.search = merchOrderSearch
      const res = await api.get('/merch-orders', { params })
      setMerchOrders(res.data.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingMerchOrders(false)
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#079108',
      cancelButtonText: 'Batal'
    }).then(r => {
      if (r.isConfirmed) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        navigate('/admin/login')
      }
    })
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      showToast.success('Status updated!')
      fetchOrders()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal Update Status', text: error.response?.data?.error || error.message })
    }
  }

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Hapus Order?',
      text: 'Data tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/orders/${orderId}`)
      Swal.fire('Deleted!', 'Order telah dihapus.', 'success')
      fetchOrders()
    } catch (error) {
      Swal.fire('Error!', error.message, 'error')
    }
  }

  const handleBulkDelete = async (deleteType, params = {}) => {
    try {
      const response = await api.post('/orders/bulk-delete', { deleteType, ...params })
      showToast.success(response.data.message)
      fetchOrders()
      setShowBulkDeleteModal(false)
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.error || error.message, 'error')
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setShowEventModal(true)
  }

  const handleDeleteEvent = async (eventId, eventName) => {
    const result = await Swal.fire({
      title: 'Hapus Event?',
      text: `Apakah Anda yakin ingin menghapus event "${eventName}"? Semua order terkait akan kehilangan referensi event.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/events/${eventId}`)
      showToast.success('Event berhasil dihapus')
      fetchEvents()
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.error || error.message, 'error')
    }
  }

  const handleTogglePast = async (eventId, currentStatus) => {
    try {
      await api.patch(`/events/${eventId}`, { is_past: !currentStatus })
      fetchEvents()
      showToast.cart(
        'Status updated',
        '✅',
        !currentStatus ? 'Event ditandai selesai!' : 'Event diaktifkan kembali!'
      )
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: error.message })
    }
  }

  const updateConfig = async (updates) => {
    try {
      setConfigLoading(true)
      await api.patch('/config', updates)
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Konfigurasi berhasil diupdate', confirmButtonColor: '#079108' })
      fetchConfig()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal!', text: error.response?.data?.error || 'Gagal update konfigurasi', confirmButtonColor: '#079108' })
    } finally {
      setConfigLoading(false)
    }
  }

  const viewOrderDetail = (order) => {
    setSelectedOrder(order)
    setShowOrderDetailModal(true)
  }

  const handleExportExcel = async ({ scope, value }) => {
    const params = buildOrderParams()
    await generateExcel({ scope, value, params, events, api })
  }

  const handleExportPdf = async ({ scope, value }) => {
    const params = buildOrderParams()
    await generatePDF({ scope, value, params, events, api })
  }

  const handleExportMerchExcel = async () => {
    await generateMerchExcel({ statusFilter: merchOrderStatusFilter, searchQuery: merchOrderSearch })
  }

  const handleExportMerchPdf = async () => {
    await generateMerchPDF({ api, statusFilter: merchOrderStatusFilter, searchQuery: merchOrderSearch })
  }

  const parseHarga = (input) => {
    if (!input) return ''
    let str = String(input).trim().toLowerCase()
    str = str.replace(/^(rp\.?\s*|idr\.?\s*)/i, '')
    if (/^\d{1,3}(\.\d{3})+$/.test(str)) {
      str = str.replace(/\./g, '')
    }
    str = str.replace(',', '.')
    let multiplier = 1
    if (/k$/i.test(str)) { multiplier = 1000; str = str.replace(/k$/i, '') }
    else if (/rb$/i.test(str)) { multiplier = 1000; str = str.replace(/rb$/i, '') }
    else if (/ribu$/i.test(str)) { multiplier = 1000; str = str.replace(/ribu$/i, '') }
    else if (/jt$/i.test(str)) { multiplier = 1000000; str = str.replace(/jt$/i, '') }
    else if (/juta$/i.test(str)) { multiplier = 1000000; str = str.replace(/juta$/i, '') }
    const num = parseFloat(str)
    if (Number.isNaN(num)) return ''
    return Math.round(num * multiplier)
  }

  const [merchHargaRaw, setMerchHargaRaw] = useState('')

  const handleHargaChange = (val) => {
    setMerchHargaRaw(val)
    const parsed = parseHarga(val)
    if (parsed !== '') {
      setMerchForm(f => ({ ...f, harga: parsed }))
    } else if (val === '') {
      setMerchForm(f => ({ ...f, harga: '' }))
    }
  }

  const openMerchForm = (item = null) => {
    if (item) {
      setEditingMerch(item)
      setMerchForm({
        nama: item.nama,
        deskripsi: item.deskripsi || '',
        harga: item.harga,
        stok: item.stok ?? '',
        available: item.available,
        sizes: item.sizes || [],
        size_chart_urls: item.size_chart_urls || []
      })
      setMerchHargaRaw(String(item.harga))
      setMerchImagePreview(item.gambar_url || '')
      setAvailableSizes(Array.isArray(item.sizes) ? item.sizes.join(', ') : '')
      setMerchSizeChartPreviews([
        item.size_chart_urls?.[0] || ''
      ])
    } else {
      setEditingMerch(null)
      setMerchForm({ nama: '', deskripsi: '', harga: '', stok: '', available: true, sizes: [], size_chart_urls: [] })
      setMerchHargaRaw('')
      setMerchImagePreview('')
      setAvailableSizes('')
      setMerchSizeChartPreviews([''])
    }
    setMerchImageFile(null)
    setMerchSizeChartFiles([null])
    setShowMerchForm(true)
  }

  const closeMerchForm = () => {
    setShowMerchForm(false)
    setEditingMerch(null)
    setMerchImageFile(null)
    setMerchImagePreview('')
    setMerchSizeChartFiles([null])
    setMerchSizeChartPreviews([''])
    setAvailableSizes('')
  }

  const handleMerchImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMerchImageFile(file)
    setMerchImagePreview(URL.createObjectURL(file))
  }

  const handleToggleSize = (size) => {
    const currentSizes = availableSizes.split(',').map(s => s.trim()).filter(s => s !== '')
    if (currentSizes.includes(size)) {
      setAvailableSizes(currentSizes.filter(s => s !== size).join(', '))
    } else {
      setAvailableSizes([...currentSizes, size].join(', '))
    }
  }

  const handleSizeChartChange = (e, index) => {
    const file = e.target.files[0]
    if (!file) return
    const newFiles = [...merchSizeChartFiles]
    newFiles[index] = file
    setMerchSizeChartFiles(newFiles)

    const newPreviews = [...merchSizeChartPreviews]
    newPreviews[index] = URL.createObjectURL(file)
    setMerchSizeChartPreviews(newPreviews)
  }

  const compressMerchImage = (file) => new Promise((resolve) => {
    const MAX_PX = 800
    const QUALITY = 0.82
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > MAX_PX || height > MAX_PX) {
        if (width > height) { height = Math.round(height * MAX_PX / width); width = MAX_PX }
        else { width = Math.round(width * MAX_PX / height); height = MAX_PX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', QUALITY)
    }
    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })

  const handleMerchSubmit = async (e) => {
    e.preventDefault()
    if (!merchForm.nama || !merchForm.harga) return alert('Nama dan harga wajib diisi')
    setMerchSaving(true)
    try {
      let gambar_url = editingMerch?.gambar_url || ''
      let size_chart_urls = [...(editingMerch?.size_chart_urls || [null])]
      if (size_chart_urls.length < 1) size_chart_urls = [size_chart_urls[0] || null]

      if (merchImageFile) {
        const compressed = await compressMerchImage(merchImageFile)
        const formData = new FormData()
        formData.append('file', compressed, 'merch.jpg')
        const uploadRes = await api.post('/upload/merch-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        gambar_url = uploadRes.data.data.url
      }

      if (merchSizeChartFiles[0]) {
        const compressed = await compressMerchImage(merchSizeChartFiles[0])
        const formData = new FormData()
        formData.append('file', compressed, 'size_chart.jpg')
        const uploadRes = await api.post('/upload/merch-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        size_chart_urls[0] = uploadRes.data.data.url
      }

      if (merchSizeChartPreviews[0] === '' && !merchSizeChartFiles[0]) {
        size_chart_urls[0] = null
      }

      const payload = {
        nama: merchForm.nama,
        deskripsi: merchForm.deskripsi || null,
        harga: parseInt(merchForm.harga, 10),
        stok: merchForm.stok !== '' ? parseInt(merchForm.stok, 10) : 0,
        gambar_url: gambar_url || null,
        available: merchForm.available,
        sizes: availableSizes.split(',').map(s => s.trim()).filter(s => s !== ''),
        size_chart_urls: size_chart_urls.filter(url => url !== null)
      }

      if (editingMerch) {
        await api.put(`/merchandise/${editingMerch.id}`, payload)
      } else {
        await api.post('/merchandise', payload)
      }

      closeMerchForm()
      fetchMerch()
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menyimpan merchandise')
    } finally {
      setMerchSaving(false)
    }
  }

  const handleDeleteMerch = async (id, nama) => {
    const result = await Swal.fire({
      title: `Hapus "${nama}"?`,
      text: 'Data merchandise ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    })
    if (!result.isConfirmed) return
    try {
      await api.delete(`/merchandise/${id}`)
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Merchandise berhasil dihapus', timer: 1500, showConfirmButton: false })
      fetchMerch()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal!', text: error.response?.data?.error || 'Gagal menghapus' })
    }
  }

  const handleToggleMerchAvailability = async (item, newValue = null) => {
    const isAvailable = newValue !== null ? (newValue === 'aktif') : !item.available
    const previousValue = item.available
    setMerch(prev => prev.map(m => (m.id === item.id ? { ...m, available: isAvailable } : m)))
    try {
      await api.put(`/merchandise/${item.id}`, { available: isAvailable })
      fetchMerch()
    } catch (error) {
      setMerch(prev => prev.map(m => (m.id === item.id ? { ...m, available: previousValue } : m)))
      Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal update ketersediaan' })
    }
  }

  const handleMerchOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/merch-orders/${orderId}/status`, { status: newStatus })
      fetchMerchOrders()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal update status' })
    }
  }

  const handleDeleteMerchOrder = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Order Merch?',
      text: 'Order ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    })
    if (!result.isConfirmed) return
    try {
      await api.delete(`/merch-orders/${id}`)
      Swal.fire({ icon: 'success', title: 'Berhasil!', timer: 1500, showConfirmButton: false })
      fetchMerchOrders()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal menghapus' })
    }
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 md:sticky md:top-0 md:h-screen md:overflow-hidden bg-white border-r border-gray-200 p-6 flex flex-col">
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

      <main className="flex-1 p-4 md:p-10 md:h-screen md:overflow-y-auto">
        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            events={events}
            loading={loading}
            orderSubTab={orderSubTab}
            setOrderSubTab={setOrderSubTab}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            eventFilter={eventFilter}
            setEventFilter={setEventFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewOrder={viewOrderDetail}
            onDeleteOrder={handleDeleteOrder}
            onStatusChange={handleStatusChange}
            onShowOTSModal={() => setShowOTSModal(true)}
            onShowBulkDeleteModal={() => setShowBulkDeleteModal(true)}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            merchOrders={merchOrders}
            loadingMerchOrders={loadingMerchOrders}
            merchOrderSearch={merchOrderSearch}
            setMerchOrderSearch={setMerchOrderSearch}
            merchOrderStatusFilter={merchOrderStatusFilter}
            setMerchOrderStatusFilter={setMerchOrderStatusFilter}
            onMerchOrderStatusChange={handleMerchOrderStatusChange}
            onDeleteMerchOrder={handleDeleteMerchOrder}
            onFetchMerchOrders={fetchMerchOrders}
            onExportMerchExcel={handleExportMerchExcel}
            onExportMerchPdf={handleExportMerchPdf}
          />
        )}

        {activeTab === 'events' && (
          <EventsTab
            events={events}
            onCreateEvent={() => { setEditingEvent(null); setShowEventModal(true) }}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onTogglePast={handleTogglePast}
          />
        )}

        {activeTab === 'merch' && (
          <MerchTab
            merch={merch}
            showMerchForm={showMerchForm}
            editingMerch={editingMerch}
            merchForm={merchForm}
            setMerchForm={setMerchForm}
            merchHargaRaw={merchHargaRaw}
            handleHargaChange={handleHargaChange}
            availableSizes={availableSizes}
            setAvailableSizes={setAvailableSizes}
            merchImagePreview={merchImagePreview}
            merchFileInputRef={merchFileInputRef}
            handleMerchImageChange={handleMerchImageChange}
            setMerchImageFile={setMerchImageFile}
            setMerchImagePreview={setMerchImagePreview}
            merchSizeChartPreviews={merchSizeChartPreviews}
            setMerchSizeChartPreviews={setMerchSizeChartPreviews}
            setMerchSizeChartFiles={setMerchSizeChartFiles}
            sizeChart1InputRef={sizeChart1InputRef}
            merchSaving={merchSaving}
            openMerchForm={openMerchForm}
            closeMerchForm={closeMerchForm}
            handleMerchSubmit={handleMerchSubmit}
            handleSizeChartChange={handleSizeChartChange}
            handleToggleSize={handleToggleSize}
            onToggleMerchAvailability={handleToggleMerchAvailability}
            handleDeleteMerch={handleDeleteMerch}
          />
        )}

        {activeTab === 'recap' && (
          <RecapTab
            orders={orders}
            events={events}
            recapEventFilter={recapEventFilter}
            setRecapEventFilter={setRecapEventFilter}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            hargaPerMember={hargaPerMember}
            setHargaPerMember={setHargaPerMember}
            hargaGrup={hargaGrup}
            setHargaGrup={setHargaGrup}
            configLoading={configLoading}
            updateConfig={updateConfig}
          />
        )}
      </main>

      {showOrderDetailModal && selectedOrder && (
        <OrderDetailModal
          isOpen={showOrderDetailModal}
          onClose={() => setShowOrderDetailModal(false)}
          order={selectedOrder}
          events={events}
        />
      )}

      {showOTSModal && (
        <OTSOrderModal
          members={members}
          events={events}
          onClose={() => setShowOTSModal(false)}
          onSuccess={() => {
            setShowOTSModal(false)
            fetchOrders()
          }}
        />
      )}

      {showBulkDeleteModal && (
        <BulkDeleteModal
          events={events}
          onClose={() => setShowBulkDeleteModal(false)}
          onConfirm={handleBulkDelete}
        />
      )}

      {showEventModal && (
        <EventModal
          members={members}
          editingEvent={editingEvent}
          onClose={() => {
            setShowEventModal(false)
            setEditingEvent(null)
          }}
          onSuccess={() => {
            setShowEventModal(false)
            setEditingEvent(null)
            fetchEvents()
          }}
        />
      )}
    </div>
  )
}

export default AdminPage
