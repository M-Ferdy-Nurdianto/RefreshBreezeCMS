import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2'

export const stripEmoji = (text) => String(text || '').replace(/[^a-zA-Z0-9\s()]/gu, '').trim()

export const generateExcel = async ({ scope, value, params, events, api }) => {
  try {
    const exportParams = { ...params }

    if (scope === 'event') {
      exportParams.event_id = value
    } else if (scope === 'month') {
      const date = new Date(value)
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      exportParams.dateFrom = firstDay.toISOString()
      exportParams.dateTo = lastDay.toISOString()
    }

    const queryString = new URLSearchParams(exportParams).toString()
    const token = localStorage.getItem('admin_token')
    const apiUrl = import.meta.env.MODE === 'production' ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

    Swal.fire({ title: 'Downloading Excel...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

    const response = await fetch(`${apiUrl}/orders/export/excel?${queryString}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Export gagal')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const safeSuffix = (() => {
      if (scope === 'event' && value) {
        const ev = events.find(e => e.id === value)
        return ev ? `${ev.nama}_${ev.tanggal}_${ev.bulan}_${ev.tahun}` : `Event_${value}`
      }
      if (scope === 'month') return `Bulan_${value}`
      return 'Filtered'
    })().replace(/[^a-zA-Z0-9_\-]/g, '_')

    a.download = `RefreshBreeze_Orders_${safeSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    Swal.fire({ icon: 'success', title: 'Excel berhasil didownload!', timer: 2000, showConfirmButton: false })
  } catch (error) {
    console.error('Error exporting:', error)
    Swal.fire({ icon: 'error', title: 'Export Gagal', text: error.message })
  }
}

export const generateMerchExcel = async ({ statusFilter, searchQuery }) => {
  try {
    const params = {}
    if (statusFilter !== 'all') params.status = statusFilter
    if (searchQuery) params.search = searchQuery

    const queryString = new URLSearchParams(params).toString()
    const token = localStorage.getItem('admin_token')
    const apiUrl = import.meta.env.MODE === 'production' ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')

    Swal.fire({ title: 'Downloading Merch Excel...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

    const response = await fetch(`${apiUrl}/merch-orders/export/excel?${queryString}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Export gagal')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RefreshBreeze_Merch_Orders_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    Swal.fire({ icon: 'success', title: 'Excel Merch berhasil didownload!', timer: 2000, showConfirmButton: false })
  } catch (error) {
    console.error('Error exporting merch:', error)
    Swal.fire({ icon: 'error', title: 'Export Gagal', text: error.message })
  }
}

export const generateMerchPDF = async ({ api, statusFilter, searchQuery }) => {
  try {
    Swal.fire({ title: 'Generating Merch PDF...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

    const params = {}
    if (statusFilter !== 'all') params.status = statusFilter
    if (searchQuery) params.search = searchQuery

    const res = await api.get('/merch-orders', { params })
    const orders = res.data.data

    if (!orders || orders.length === 0) throw new Error('Tidak ada data untuk diexport.')

    const doc = new jsPDF()
    doc.setFillColor(7, 145, 8)
    doc.rect(0, 0, 210, 24, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('REFRESH BREEZE - LAPORAN MERCHANDISE', 105, 16, { align: 'center' })

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 35)

    const tableBody = orders.map((order, index) => [
      index + 1,
      order.order_number,
      order.nama_lengkap || '-',
      `WA: ${order.whatsapp}${order.instagram ? '\nIG: ' + order.instagram : ''}`,
      order.merch_order_items?.map(i => `${i.item_name} ${i.size ? `(${i.size}) ` : ''}x${i.quantity}`).join('\n') || '-',
      `Rp ${order.total_harga.toLocaleString('id-ID')}`,
      order.status
    ])

    const itemSummary = {}
    const globalSizeSummary = {}
    let totalQty = 0
    let totalRevenue = 0

    orders.forEach(order => {
      totalRevenue += order.total_harga
      order.merch_order_items?.forEach(item => {
        const name = item.item_name
        const size = item.size || 'No Size'
        const qty = item.quantity

        if (!itemSummary[name]) itemSummary[name] = { qty: 0, revenue: 0, sizes: {} }
        itemSummary[name].qty += qty
        itemSummary[name].revenue += (qty * item.harga)
        if (!itemSummary[name].sizes[size]) itemSummary[name].sizes[size] = 0
        itemSummary[name].sizes[size] += qty

        if (size !== 'No Size') {
          if (!globalSizeSummary[size]) globalSizeSummary[size] = 0
          globalSizeSummary[size] += qty
        }
        totalQty += qty
      })
    })

    autoTable(doc, {
      startY: 45,
      head: [['#', 'Order #', 'Nama', 'Kontak', 'Items', 'Total', 'Status']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [7, 145, 8], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: { 0: { cellWidth: 10 }, 4: { cellWidth: 50 }, 5: { halign: 'right' } }
    })

    let currentY = doc.lastAutoTable.finalY + 15
    if (Object.keys(globalSizeSummary).length > 0) {
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.text('REKAP TOTAL PER UKURAN (SIZE)', 14, currentY)
      const sizeBody = Object.entries(globalSizeSummary).sort().map(([size, qty]) => [`Ukuran ${size}`, `${qty} pcs`])
      autoTable(doc, { startY: currentY + 5, head: [['Ukuran', 'Total Terjual']], body: sizeBody, theme: 'grid', headStyles: { fillColor: [30, 41, 59], textColor: 255 }, styles: { fontSize: 9 }, tableWidth: 80, margin: { left: 14 } })
      currentY = doc.lastAutoTable.finalY + 15
    }

    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.text('RINGKASAN PENJUALAN PER PRODUK', 14, currentY)
    const summaryRows = []
    Object.keys(itemSummary).forEach(name => {
      const product = itemSummary[name]
      summaryRows.push([ { content: name, styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } }, { content: product.qty, styles: { fontStyle: 'bold', fillColor: [248, 250, 252], halign: 'center' } }, { content: `Rp ${product.revenue.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold', fillColor: [248, 250, 252], halign: 'right' } } ])
      Object.entries(product.sizes).sort().forEach(([size, qty]) => { summaryRows.push([ { content: `   • Ukuran ${size}`, styles: { fontStyle: 'italic', textColor: [100, 116, 139] } }, { content: qty, styles: { halign: 'center', textColor: [100, 116, 139] } }, '' ]) })
    })
    summaryRows.push([ { content: 'TOTAL KESELURUHAN', styles: { fontStyle: 'bold', fillColor: [255, 255, 0] } }, { content: totalQty, styles: { fontStyle: 'bold', fillColor: [255, 255, 0], halign: 'center' } }, { content: `Rp ${totalRevenue.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold', fillColor: [255, 255, 0], halign: 'right' } } ])
    autoTable(doc, { startY: currentY + 5, head: [['Nama Produk', 'Terjual', 'Total Rupiah']], body: summaryRows, theme: 'grid', headStyles: { fillColor: [50, 50, 50], textColor: 255 }, styles: { fontSize: 9 }, columnStyles: { 1: { cellWidth: 30 }, 2: { cellWidth: 40 } } })

    doc.save(`RefreshBreeze_Merch_Orders_${new Date().toISOString().slice(0, 10)}.pdf`)
    Swal.fire({ icon: 'success', title: 'PDF Merch Berhasil!', timer: 1500, showConfirmButton: false })
  } catch (error) { Swal.fire({ icon: 'error', title: 'Gagal PDF Merch', text: error.message }) }
}

export const generatePDF = async ({ api, scope, value, params, events }) => {
  try {
    Swal.fire({ title: 'Generating PDF...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
    const exportParams = { ...params }
    if (scope === 'event') exportParams.event_id = value
    else if (scope === 'month') {
      const date = new Date(value); const firstDay = new Date(date.getFullYear(), date.getMonth(), 1); const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      exportParams.dateFrom = firstDay.toISOString(); exportParams.dateTo = lastDay.toISOString()
    }

    const res = await api.get('/orders', { params: exportParams })
    const orders = res.data.data
    if (!orders || orders.length === 0) throw new Error('Tidak ada data untuk diexport.')

    let eventName = ''; if (scope === 'event' && value) { const foundEvent = events.find(e => e.id === value); eventName = foundEvent ? `${foundEvent.nama} - ${foundEvent.bulan} ${foundEvent.tahun}` : 'Event' }
    const paidOrders = orders.filter(o => o.status === 'checked' || o.status === 'completed')
    let totalRevenue = 0; let totalItems = 0; const memberStats = {}

    paidOrders.forEach(order => {
      totalRevenue += order.total_harga || 0
      order.order_items?.forEach(item => {
        totalItems += item.quantity || 0
        let name = stripEmoji(item.item_name.replace('Cheki ', '').replace(' (Pre-Order)', ''))
        if (name.toLowerCase().includes('all member') || name.toLowerCase().includes('group')) name = 'All Member (Group)'
        if (!memberStats[name]) memberStats[name] = { total: 0, po: 0, ots: 0 }
        memberStats[name].total += item.quantity || 0
        if (order.is_ots) memberStats[name].ots += item.quantity || 0
        else memberStats[name].po += item.quantity || 0
      })
    })

    const totalPolaroid = paidOrders.filter(o => o.status === 'completed').reduce((sum, order) => sum + (order.order_items?.reduce((pSum, item) => {
      const isCheki = item.item_name.toLowerCase().includes('cheki') || item.item_name.toLowerCase().includes('polaroid')
      return pSum + (isCheki ? (item.quantity || 0) : 0)
    }, 0) || 0), 0)

    const doc = new jsPDF()
    doc.setFillColor(7, 145, 8); doc.rect(0, 0, 210, 24, 'F'); doc.setTextColor(255, 255, 255); doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.text('REFRESH BREEZE - LAPORAN PENJUALAN', 105, 16, { align: 'center' })
    doc.setTextColor(0, 0, 0); doc.setFontSize(10); doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 35)

    let scopeLabel = 'Sesuai Filter Aktif'; if (scope === 'event') scopeLabel = eventName; else if (scope === 'month') { const [y, m] = value.split('-'); const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']; scopeLabel = `${monthNames[parseInt(m) - 1]} ${y}` }
    doc.text(`Cakupan Data: ${scopeLabel}`, 14, 40)
    doc.setFillColor(240, 253, 244); doc.roundedRect(14, 45, 182, 35, 3, 3, 'F'); doc.setDrawColor(34, 197, 94); doc.roundedRect(14, 45, 182, 35, 3, 3, 'S')
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 101, 52); doc.text('RINGKASAN (Checked/Completed Orders)', 20, 55)
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 0, 0); doc.text(`Total Omzet: Rp ${totalRevenue.toLocaleString('id-ID')}`, 20, 65); doc.text(`Order Terbayar: ${paidOrders.length} dari ${orders.length}`, 100, 65); doc.text(`Total Polaroid: ${totalPolaroid} pcs`, 20, 72)

    const memberBody = Object.entries(memberStats).sort((a, b) => b[1].total - a[1].total).map(([name, stats]) => [stripEmoji(name), `${stats.po} pcs`, `${stats.ots} pcs`, `${stats.total} pcs`])
    autoTable(doc, { startY: 85, head: [['Nama Member', 'Pre-Order', 'On The Spot', 'Total']], body: memberBody, theme: 'grid', headStyles: { fillColor: [7, 145, 8], textColor: 255 }, styles: { fontSize: 9 } })

    doc.save(`RefreshBreeze_Sales_${scopeLabel.replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`)
    Swal.fire({ icon: 'success', title: 'PDF Berhasil!', timer: 1500, showConfirmButton: false })
  } catch (error) { Swal.fire({ icon: 'error', title: 'Gagal PDF', text: error.message }) }
}
