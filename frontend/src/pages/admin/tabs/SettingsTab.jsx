import React from 'react'
import { FaSave, FaCalculator, FaTags, FaInfoCircle, FaWrench, FaShieldAlt, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle, FaTrash } from 'react-icons/fa'

// Helper to format string into thousand separator (e.g. "30000" -> "30.000")
const formatThousand = (val) => {
  if (val === undefined || val === null || val === '') return ''
  const numStr = String(val).replace(/\D/g, '')
  if (!numStr) return ''
  return Number(numStr).toLocaleString('id-ID')
}

const SettingsTab = ({
  hargaPerMember, setHargaPerMember,
  hargaGrup, setHargaGrup,
  hargaOtsPerMember, setHargaOtsPerMember,
  hargaOtsGrup, setHargaOtsGrup,
  maintenanceMode, setMaintenanceMode,
  maintenanceMessage, setMaintenanceMessage,
  maintenanceEstimatedEnd, setMaintenanceEstimatedEnd,
  configLoading, updateConfig,
  onShowBulkDeleteModal,
  onPurgeOldPayments
}) => {
  const handleSaveSettings = () => {
    updateConfig({
      harga_cheki_per_member: String(hargaPerMember).replace(/\D/g, ''),
      harga_cheki_grup: String(hargaGrup).replace(/\D/g, ''),
      harga_ots_per_member: String(hargaOtsPerMember).replace(/\D/g, ''),
      harga_ots_grup: String(hargaOtsGrup).replace(/\D/g, ''),
      maintenance_mode: maintenanceMode ? 'true' : 'false',
      maintenance_message: maintenanceMessage || '',
      maintenance_estimated_end: maintenanceEstimatedEnd || ''
    })
  }

  const handleToggleMaintenance = async () => {
    const nextState = !maintenanceMode
    setMaintenanceMode(nextState)
    await updateConfig({
      maintenance_mode: nextState ? 'true' : 'false',
      maintenance_message: maintenanceMessage || '',
      maintenance_estimated_end: maintenanceEstimatedEnd || ''
    }, true)
  }

  const handleBlurMaintenanceDetails = async () => {
    await updateConfig({
      maintenance_message: maintenanceMessage || '',
      maintenance_estimated_end: maintenanceEstimatedEnd || ''
    }, true)
  }

  // Handle formatted input change
  const handleInputChange = (setter) => (e) => {
    const rawDigits = e.target.value.replace(/\D/g, '')
    setter(rawDigits)
  }

  // Numeric values for calculation
  const numPoMember = parseInt(String(hargaPerMember).replace(/\D/g, '') || '0', 10)
  const numPoGroup = parseInt(String(hargaGrup).replace(/\D/g, '') || '0', 10)
  const numOtsMember = parseInt(String(hargaOtsPerMember).replace(/\D/g, '') || '0', 10)
  const numOtsGroup = parseInt(String(hargaOtsGrup).replace(/\D/g, '') || '0', 10)

  // Simulation: Fan orders 3 individual chekis + 1 group cheki
  const simQtyIndividual = 3
  const simPoTotal = (numPoMember * simQtyIndividual) + numPoGroup
  const simOtsTotal = (numOtsMember * simQtyIndividual) + numOtsGroup

  // Difference between PO & OTS per member
  const otsMarkupPerMember = numOtsMember - numPoMember
  const otsMarkupGroup = numOtsGroup - numPoGroup

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
          Pengaturan <span className="text-[#079108]">Sistem & Harga</span>
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          Kelola mode pemeliharaan website serta konfigurasi harga tiket 2-Shot Cheki.
        </p>
      </div>

      {/* Maintenance Mode Card */}
      <div className="bg-[#111726]/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-xl border ${maintenanceMode ? 'bg-[#079108]/10 border-[#079108]/30 text-[#079108]' : 'bg-zinc-800 border-white/10 text-zinc-400'}`}>
              <FaWrench className="text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Mode Pemeliharaan Website (MT Barrier)</h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${
                  maintenanceMode 
                    ? 'bg-[#079108]/20 text-[#079108] border border-[#079108]/30 shadow-[0_0_10px_rgba(7,145,8,0.2)]' 
                    : 'bg-zinc-800 text-zinc-400 border border-white/10'
                }`}>
                  {maintenanceMode ? (
                    <>
                      <FaExclamationTriangle className="text-[10px]" />
                      <span>Aktif</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-[10px]" />
                      <span>Website Live</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Saklar instan. Saat dinyalakan, pengunjung website publik langsung melihat layar barrier maintenance. Halaman admin tetap dapat diakses normal.
              </p>
            </div>
          </div>

          {/* Instant Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className={`text-xs font-bold uppercase tracking-wider ${maintenanceMode ? 'text-[#079108]' : 'text-zinc-400'}`}>
              {maintenanceMode ? 'MT Aktif' : 'MT Nonaktif'}
            </span>
            <button
              type="button"
              disabled={configLoading}
              onClick={handleToggleMaintenance}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none disabled:opacity-50 ${
                maintenanceMode ? 'bg-[#079108] shadow-[0_0_15px_rgba(7,145,8,0.5)]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                  maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Maintenance Detail Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
          <div>
            <label className="block text-xs text-zinc-300 font-medium mb-1.5">
              Pesan Pengumuman untuk Pengunjung
            </label>
            <textarea
              rows={3}
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              onBlur={handleBlurMaintenanceDetails}
              placeholder="Contoh: Sori ya, web-nya belum bisa dipakai buat sementara. Kita lagi benerin beberapa bagian biar pas kalian order tiket atau cek jadwal, prosesnya lebih lancar. Pantengin Instagram buat kabar terbarunya."
              className="w-full px-4 py-2.5 bg-[#182032] border border-white/10 rounded-xl focus:border-[#079108] focus:outline-none transition-colors text-white text-xs resize-none placeholder:text-zinc-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Pesan otomatis tersimpan saat Anda selesai mengetik (klik di luar kolom).
            </p>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-medium mb-1.5">
              Estimasi Waktu Selesai (Opsional)
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={maintenanceEstimatedEnd}
                onChange={(e) => setMaintenanceEstimatedEnd(e.target.value)}
                onBlur={handleBlurMaintenanceDetails}
                className="w-full px-4 py-2.5 bg-[#182032] border border-white/10 rounded-xl focus:border-[#079108] focus:outline-none transition-colors text-white text-xs [color-scheme:dark]"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Jika diisi, countdown timer digital otomatis muncul di layar barrier pengunjung.
            </p>

            <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <FaShieldAlt className="text-emerald-400 shrink-0" />
              <span>Jalur Login Admin (/admin/login) selalu aman dan dapat diakses.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom 1: PO (Kiri) - Dot Cyan konsisten dengan Recap */}
        <div className="bg-[#111726]/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
            <h3 className="text-base font-bold text-white">Harga Pre-Order (PO)</h3>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-medium mb-1.5">
              Harga cheki per member
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">
                Rp
              </span>
              <input
                type="text"
                value={formatThousand(hargaPerMember)}
                onChange={handleInputChange(setHargaPerMember)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#182032] border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-white font-bold text-sm"
                placeholder="25.000"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Harga untuk cheki per member individual di sesi PO online
            </p>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-medium mb-1.5">
              Harga cheki grup (semua member)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">
                Rp
              </span>
              <input
                type="text"
                value={formatThousand(hargaGrup)}
                onChange={handleInputChange(setHargaGrup)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#182032] border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-white font-bold text-sm"
                placeholder="30.000"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Harga untuk cheki 2-Shot bersama seluruh member grup
            </p>
          </div>
        </div>

        {/* Kolom 2: OTS (Tengah) - Dot Amber/Oranye konsisten dengan Recap */}
        <div className="bg-[#111726]/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
            <h3 className="text-base font-bold text-white">Harga OTS (On The Spot)</h3>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-medium mb-1.5">
              Harga OTS per member
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">
                Rp
              </span>
              <input
                type="text"
                value={formatThousand(hargaOtsPerMember)}
                onChange={handleInputChange(setHargaOtsPerMember)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#182032] border border-white/10 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-white font-bold text-sm"
                placeholder="25.000"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Harga untuk cheki OTS per member yang dibeli di venue
            </p>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 font-medium mb-1.5">
              Harga OTS grup (semua member)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">
                Rp
              </span>
              <input
                type="text"
                value={formatThousand(hargaOtsGrup)}
                onChange={handleInputChange(setHargaOtsGrup)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#182032] border border-white/10 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-white font-bold text-sm"
                placeholder="30.000"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Harga untuk cheki OTS grup yang dibeli di kasir venue
            </p>
          </div>
        </div>

        {/* Kolom 3: Simulasi Transaksi & Simpan (Kanan) */}
        <div className="bg-[#111726]/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 flex flex-col justify-between h-full gap-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#079108] shadow-[0_0_8px_#079108]"></span>
              <h3 className="text-base font-bold text-white">Simulasi & Perbandingan</h3>
            </div>

            {/* Simulasi Transaksi Riil */}
            <div className="bg-[#161f33] rounded-xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <FaCalculator className="text-[#079108]" />
                <span>Simulasi Belanja Fan</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Contoh jika 1 fan membeli <strong className="text-white">3 Cheki Member + 1 Cheki Grup</strong>:
              </p>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#111726] border border-white/5">
                  <span className="text-cyan-300 font-medium">Total Pre-Order (PO):</span>
                  <span className="font-bold text-white">
                    Rp {simPoTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[#111726] border border-white/5">
                  <span className="text-amber-300 font-medium">Total On-The-Spot (OTS):</span>
                  <span className="font-bold text-white">
                    Rp {simOtsTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Selisih PO vs OTS */}
            <div className="bg-[#161f33] rounded-xl p-4 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <FaTags className="text-[#00e5e5]" />
                <span>Selisih Harga PO vs OTS</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Tiket per Member:</span>
                  <span className={`font-semibold ${otsMarkupPerMember > 0 ? 'text-amber-300' : 'text-zinc-400'}`}>
                    {otsMarkupPerMember > 0 ? `+Rp ${otsMarkupPerMember.toLocaleString('id-ID')} di OTS` : 'Harga sama'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Tiket Grup:</span>
                  <span className={`font-semibold ${otsMarkupGroup > 0 ? 'text-amber-300' : 'text-zinc-400'}`}>
                    {otsMarkupGroup > 0 ? `+Rp ${otsMarkupGroup.toLocaleString('id-ID')} di OTS` : 'Harga sama'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={configLoading}
            className="w-full bg-[#079108] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(7,145,8,0.3)] hover:bg-[#067a07] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
          >
            <FaSave className="text-sm" />
            {configLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DANGER ZONE & STORAGE MANAGEMENT (Pembersihan Data & Storage)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#111726]/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-red-500/20 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <FaTrash className="text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Manajemen Data & <span className="text-red-400">Pembersihan Storage</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Pembersihan berkas bukti pembayaran Supabase Storage dan penghapusan data transaksi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Purge Bukti Pembayaran Lama (> 1 Bulan) */}
          <div className="bg-[#161f33] rounded-xl p-5 border border-white/10 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
                <h4 className="text-sm font-bold text-white">Auto-Purge Bukti Bayar (&gt; 1 Bulan)</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Event yang sudah lewat 1 bulan otomatis di-hide. File foto bukti transfer di Supabase Storage otomatis dibersihkan agar kuota storage selalu lega. Anda juga bisa memicu pembersihannya secara manual sekarang.
              </p>
            </div>

            <button
              type="button"
              onClick={onPurgeOldPayments}
              className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <FaWrench className="text-xs" />
              <span>Bersihkan Bukti Bayar &gt; 1 Bulan Sekarang</span>
            </button>
          </div>

          {/* Card 2: Hapus Data Pembelian (Reset Bersih 0 / Per Event) */}
          <div className="bg-[#161f33] rounded-xl p-5 border border-red-500/30 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                <h4 className="text-sm font-bold text-white">Hapus Data Pembelian (Reset Bersih 0)</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hapus seluruh transaksi order (full reset 0) atau per event. Seluruh data di database beserta <strong className="text-red-300">file foto fisik di Supabase Storage</strong> akan langsung terhapus bersih tanpa sisa.
              </p>
            </div>

            <button
              type="button"
              onClick={onShowBulkDeleteModal}
              className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-red-300 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <FaTrash className="text-xs" />
              <span>Buka Opsi Hapus Data Pembelian</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
