import React from 'react'
import { FaSave, FaCalculator, FaTags, FaInfoCircle } from 'react-icons/fa'

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
  configLoading, updateConfig
}) => {
  const handleSaveSettings = () => {
    updateConfig({
      harga_cheki_per_member: String(hargaPerMember).replace(/\D/g, ''),
      harga_cheki_grup: String(hargaGrup).replace(/\D/g, ''),
      harga_ots_per_member: String(hargaOtsPerMember).replace(/\D/g, ''),
      harga_ots_grup: String(hargaOtsGrup).replace(/\D/g, '')
    })
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
          Pengaturan <span className="text-[#079108]">Harga</span>
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          Kelola konfigurasi harga tiket 2-Shot Cheki Pre-Order (PO) dan On-The-Spot (OTS).
        </p>
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
    </div>
  )
}

export default SettingsTab
