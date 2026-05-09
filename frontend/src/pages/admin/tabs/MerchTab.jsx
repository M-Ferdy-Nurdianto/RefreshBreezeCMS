import React from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCloudUploadAlt, FaImage } from 'react-icons/fa'

const MerchTab = ({
  merch,
  showMerchForm,
  editingMerch,
  merchForm,
  setMerchForm,
  merchHargaRaw,
  handleHargaChange,
  availableSizes,
  setAvailableSizes,
  merchImagePreview,
  merchFileInputRef,
  handleMerchImageChange,
  setMerchImageFile,
  setMerchImagePreview,
  merchSizeChartPreviews,
  setMerchSizeChartPreviews,
  setMerchSizeChartFiles,
  sizeChart1InputRef,
  merchSaving,
  openMerchForm,
  closeMerchForm,
  handleMerchSubmit,
  handleSizeChartChange,
  handleToggleSize,
  onToggleMerchAvailability,
  handleDeleteMerch
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Manajemen Merchandise</h2>
      {!showMerchForm && (
        <button
          onClick={() => openMerchForm()}
          className="bg-custom-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <FaPlus /> Tambah Merch
        </button>
      )}
    </div>

    {showMerchForm && (
      <div className="bg-white rounded-xl shadow-lg border-2 border-custom-green/30 overflow-hidden">
        <div className="bg-custom-green/10 px-6 py-4 border-b border-custom-green/20 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{editingMerch ? '✏️ Edit Merchandise' : '➕ Tambah Merchandise Baru'}</h3>
          <button onClick={closeMerchForm} className="text-gray-400 hover:text-gray-600 p-1"><FaTimes size={18} /></button>
        </div>
        <form onSubmit={handleMerchSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk *</label>
                <input required value={merchForm.nama} onChange={e => setMerchForm({...merchForm, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green focus:outline-none"
                  placeholder="Contoh: Kaos Refresh Breeze"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea value={merchForm.deskripsi} onChange={e => setMerchForm({...merchForm, deskripsi: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green focus:outline-none resize-none"
                  placeholder="Deskripsi produk (opsional)" rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp) *</label>
                  <input required value={merchHargaRaw} onChange={e => handleHargaChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green focus:outline-none"
                    placeholder='135k, rp150, 75rb, 1.5jt'
                  />
                  {merchForm.harga && merchHargaRaw && !/^\d+$/.test(merchHargaRaw) && (
                    <p className="text-xs text-custom-green mt-1 font-semibold">= Rp {Number(merchForm.harga).toLocaleString('id-ID')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stok <span className="text-xs text-gray-400">(opsional)</span></label>
                  <input type="number" min="0" value={merchForm.stok} onChange={e => setMerchForm({...merchForm, stok: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green focus:outline-none"
                    placeholder="Kosongkan jika PO"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="merch-available" checked={merchForm.available}
                  onChange={e => setMerchForm({...merchForm, available: e.target.checked})}
                  className="w-4 h-4 accent-custom-green"
                />
                <label htmlFor="merch-available" className="text-sm font-semibold text-gray-700">Tampilkan di Shop (Aktif)</label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ukuran Tersedia</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].map(sz => {
                    const isActive = availableSizes.split(',').map(s => s.trim()).includes(sz)
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
                          isActive
                            ? 'bg-custom-green border-custom-green text-white shadow-md'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {sz}
                      </button>
                    )
                  })}
                </div>
                <input value={availableSizes} onChange={e => setAvailableSizes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-green focus:outline-none"
                  placeholder="Atau ketik sendiri (dipisahkan koma)"
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">Toggles di atas akan menambah/menghapus dari input ini.</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Foto Produk</label>
              <div
                onClick={() => merchFileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-custom-green hover:bg-green-50/30 transition-all min-h-[200px] flex flex-col items-center justify-center gap-3"
              >
                {merchImagePreview ? (
                  <img src={merchImagePreview} alt="Preview" className="max-h-[200px] max-w-full object-contain rounded-lg" />
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-4xl text-gray-300" />
                    <p className="text-sm text-gray-400">Klik untuk upload foto</p>
                    <p className="text-xs text-gray-300">JPG, PNG (max 10MB)</p>
                  </>
                )}
              </div>
              <input ref={merchFileInputRef} type="file" accept="image/*" onChange={handleMerchImageChange} className="hidden" />
              {merchImagePreview && (
                <button type="button" onClick={() => { setMerchImageFile(null); setMerchImagePreview(''); if (merchFileInputRef.current) merchFileInputRef.current.value = '' }}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >✕ Hapus Foto</button>
              )}

              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Size Chart <span className="text-xs text-gray-400">(Opsional)</span></label>
                <div className="space-y-2">
                  <div
                    onClick={() => sizeChart1InputRef.current?.click()}
                    className="border border-dashed border-gray-300 rounded-lg p-2 text-center cursor-pointer hover:border-custom-green hover:bg-green-50/30 transition-all min-h-[120px] flex flex-col items-center justify-center gap-1"
                  >
                    {merchSizeChartPreviews[0] ? (
                      <img src={merchSizeChartPreviews[0]} alt="Size Chart" className="max-h-[100px] max-w-full object-contain rounded" />
                    ) : (
                      <>
                        <FaImage className="text-2xl text-gray-300" />
                        <p className="text-xs text-gray-400">Upload Size Chart</p>
                      </>
                    )}
                  </div>
                  {merchSizeChartPreviews[0] && (
                    <button type="button" onClick={() => {
                      setMerchSizeChartPreviews([''])
                      setMerchSizeChartFiles([null])
                      if (sizeChart1InputRef.current) sizeChart1InputRef.current.value = ''
                    }}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold w-full text-center"
                    >✕ Hapus Size Chart</button>
                  )}
                </div>
                <input ref={sizeChart1InputRef} type="file" accept="image/*" onChange={(e) => handleSizeChartChange(e, 0)} className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={closeMerchForm} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300">Batal</button>
            <button type="submit" disabled={merchSaving}
              className="px-6 py-2 bg-custom-green text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
            >
              {merchSaving ? 'Menyimpan...' : (editingMerch ? '💾 Update' : '➕ Tambah')}
            </button>
          </div>
        </form>
      </div>
    )}

    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Produk</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Harga</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Stok</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Tersedia</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {merch.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-10 text-gray-400">Belum ada merchandise. Klik &quot;Tambah Merch&quot; untuk menambahkan.</td></tr>
            ) : (
              merch.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-50 overflow-hidden flex-shrink-0 flex items-center justify-center border border-green-100">
                        {item.gambar_url ? <img src={item.gambar_url} alt={item.nama} className="w-full h-full object-cover" /> : <span className="text-green-300 text-xl">📦</span>}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.nama}</p>
                        {item.deskripsi && <p className="text-xs text-gray-500 max-w-xs truncate whitespace-pre-line">{item.deskripsi}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-custom-green">Rp {item.harga.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${!item.stok ? 'text-gray-400' : item.stok <= 5 ? 'text-orange-500' : 'text-gray-700'}`}>
                      {!item.stok ? 'PO' : item.stok}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleMerchAvailability(item)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        item.available ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'
                      }`}
                    >
                      {item.available ? '● Aktif' : '✗ Nonaktif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openMerchForm(item)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
                      <button onClick={() => handleDeleteMerch(item.id, item.nama)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg"><FaTrash /></button>
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
)

export default MerchTab
