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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Harga</h2>

        <div className="space-y-6">
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
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors"
                placeholder="25000"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
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
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors"
                placeholder="30000"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Harga untuk cheki grup (semua member)
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Pengaturan Harga OTS</h3>
            
            <div className="space-y-6">
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors"
                    placeholder="25000"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-custom-green focus:outline-none transition-colors"
                    placeholder="30000"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Harga untuk cheki OTS grup (semua member)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview Harga:</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cheki Per Member:</span>
                <span className="font-bold text-custom-green">
                  {parseInt(hargaPerMember || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cheki Grup:</span>
                <span className="font-bold text-custom-green">
                  {parseInt(hargaGrup || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                <span className="text-gray-600">OTS Per Member:</span>
                <span className="font-bold text-custom-green">
                  {parseInt(hargaOtsPerMember || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">OTS Grup:</span>
                <span className="font-bold text-custom-green">
                  {parseInt(hargaOtsGrup || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={configLoading}
            className="w-full bg-gradient-to-r from-custom-green to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {configLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
