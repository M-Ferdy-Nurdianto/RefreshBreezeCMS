import React from 'react'
import { FaFilter, FaShoppingCart, FaCheck } from 'react-icons/fa'
import CustomSelect from '../components/CustomSelect'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const stripEmoji = (text) => String(text || '').replace(/[^a-zA-Z0-9\s()]/gu, '').trim()

const RecapTab = ({ orders, events, recapEventFilter, setRecapEventFilter }) => {
  const filteredRecapOrders = (recapEventFilter === 'all'
    ? orders
    : orders.filter(o => o.event_id === recapEventFilter))
    .filter(o => o.status === 'checked' || o.status === 'completed')

  const totalRevenue = filteredRecapOrders.reduce((sum, order) => sum + (order.total_harga || 0), 0)

  const totalPolaroidRecap = filteredRecapOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => {
      return sum + (order.order_items?.reduce((pSum, item) => {
        const isCheki = item.item_name.toLowerCase().includes('cheki') || item.item_name.toLowerCase().includes('polaroid')
        return pSum + (isCheki ? (item.quantity || 0) : 0)
      }, 0) || 0)
    }, 0)

  const memberStats = {}

  filteredRecapOrders.forEach(order => {
    order.order_items?.forEach(item => {
      let memberName = stripEmoji(item.item_name.replace('Cheki ', '').replace(' (Pre-Order)', ''))

      if (memberName.toLowerCase().includes('all member') || memberName.toLowerCase().includes('group')) {
        memberName = 'All Member (Group)'
      }

      if (!memberStats[memberName]) {
        memberStats[memberName] = { quantity: 0, revenue: 0, poQty: 0, otsQty: 0 }
      }

      memberStats[memberName].quantity += item.quantity || 0
      memberStats[memberName].revenue += (item.price || 0) * (item.quantity || 0)

      if (order.is_ots) {
        memberStats[memberName].otsQty += item.quantity || 0
      } else {
        memberStats[memberName].poQty += item.quantity || 0
      }
    })
  })

  const labels = Object.keys(memberStats)
  const poData = labels.map(name => memberStats[name].poQty)
  const otsData = labels.map(name => memberStats[name].otsQty)
  const revenueData = labels.map(name => memberStats[name].revenue)

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Statistik Penjualan per Member' },
    },
    scales: {
      x: { beginAtZero: true }
    }
  }

  const quantityChartData = {
    labels,
    datasets: [
      {
        label: 'Pre-Order',
        data: poData,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'OTS',
        data: otsData,
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
      }
    ]
  }

  const revenueChartData = {
    labels,
    datasets: [
      {
        label: 'Total Pendapatan (Rp)',
        data: revenueData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      }
    ]
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rekapitulasi Penjualan</h2>

        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <CustomSelect
            value={recapEventFilter}
            onChange={(e) => setRecapEventFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Semua Event' },
              ...events.map(ev => ({ value: ev.id, label: `${ev.nama} - ${ev.bulan} ${ev.tahun}` }))
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Orders', value: filteredRecapOrders.length, color: 'bg-blue-500', icon: <FaShoppingCart /> },
          { label: 'Order OTS', value: filteredRecapOrders.filter(o => o.is_ots).length, color: 'bg-orange-500', icon: <span className="text-xl">🏪</span> },
          { label: 'Pre-Order', value: filteredRecapOrders.filter(o => !o.is_ots).length, color: 'bg-blue-600', icon: <span className="text-xl">📦</span> },
          { label: 'Unchecked', value: filteredRecapOrders.filter(o => o.status === 'pending').length, color: 'bg-gray-400', icon: <span className="text-xl">⏳</span> },
          { label: 'Completed', value: filteredRecapOrders.filter(o => o.status === 'completed').length, color: 'bg-green-600', icon: <FaCheck /> },
          { label: 'Total Polaroid', value: `${totalPolaroidRecap} pcs`, color: 'bg-emerald-600', icon: <span className="text-xl">📸</span> },
          { label: 'Total Pemasukan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, color: 'bg-custom-green', icon: <span className="text-xl font-bold">Rp</span>, wide: true }
        ].map((stat, index) => (
          <div key={index} className={`bg-white p-4 rounded-xl shadow-md ${stat.wide ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${stat.color} rounded-full flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
            <div className={`${typeof stat.value === 'string' && stat.value.length > 10 ? 'text-xl' : 'text-3xl'} font-bold text-gray-800`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Total Cheki per Member</h3>
          <Bar options={chartOptions} data={quantityChartData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Total Rupiah per Member</h3>
          <Bar
            options={{
              ...chartOptions,
              plugins: { ...chartOptions.plugins, title: { display: false } }
            }}
            data={revenueChartData}
          />
        </div>
      </div>
    </div>
  )
}

export default RecapTab
