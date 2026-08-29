import React from 'react'

const SettingsTab = ({
  hargaPerMember, setHargaPerMember,
  hargaGrup, setHargaGrup,
  hargaOtsPerMember, setHargaOtsPerMember,
  hargaOtsGrup, setHargaOtsGrup,
  configLoading, updateConfig
}) => {
  const handleSaveSettings = () => {
    updateConfig({
      harga_cheki_per_member: hargaPerMember,
      harga_cheki_grup: hargaGrup,
      harga_ots_per_member: hargaOtsPerMember,
      harga_ots_grup: hargaOtsGrup
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Harga</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola konfigurasi harga Cheki Pre-Order (PO) dan On-The-Spot (OTS)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom 1: PO (Kiri) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-custom-green"></span>
            <h3 className="text-lg font-bold text-gray-800">Harga Pre-Order (PO)</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga Cheki Per Member
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="number"
                value={hargaPerMember}
                onChange={(e) => setHargaPerMember(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors text-gray-800 font-medium"
                placeholder="25000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Harga untuk cheki per member individual
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga Cheki Grup (All Member)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="number"
                value={hargaGrup}
                onChange={(e) => setHargaGrup(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors text-gray-800 font-medium"
                placeholder="30000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Harga untuk cheki grup (semua member)
            </p>
          </div>
        </div>

        {/* Kolom 2: OTS (Tengah) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h3 className="text-lg font-bold text-gray-800">Harga OTS (On The Spot)</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga OTS Per Member
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="number"
                value={hargaOtsPerMember}
                onChange={(e) => setHargaOtsPerMember(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors text-gray-800 font-medium"
                placeholder="25000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Harga untuk cheki OTS per member individual
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga OTS Grup (All Member)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="number"
                value={hargaOtsGrup}
                onChange={(e) => setHargaOtsGrup(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors text-gray-800 font-medium"
                placeholder="30000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              Harga untuk cheki OTS grup (semua member)
            </p>
          </div>
        </div>

        {/* Kolom 3: Preview & Simpan (Kanan) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 flex flex-col justify-between h-full gap-5">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <h3 className="text-lg font-bold text-gray-800">Preview & Konfirmasi</h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pre-Order (PO)</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per Member:</span>
                    <span className="font-bold text-custom-green">
                      {parseInt(hargaPerMember || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grup:</span>
                    <span className="font-bold text-custom-green">
                      {parseInt(hargaGrup || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">On The Spot (OTS)</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Per Member:</span>
                    <span className="font-bold text-custom-green">
                      {parseInt(hargaOtsPerMember || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grup:</span>
                    <span className="font-bold text-custom-green">
                      {parseInt(hargaOtsGrup || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={configLoading}
            className="w-full bg-gradient-to-r from-custom-green to-green-600 text-white py-3.5 px-4 rounded-xl font-bold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {configLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
