import { motion } from 'framer-motion'
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa'

const ShopPreviewSection = ({ merchPreview, shopMembers = [], navigate, getAssetPath }) => {
  const sanitizeName = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  
  const getShopPhoto = (member, fallbackId) => {
    if (member?.is_secret) {
      if (member.silhouette_image_url) {
        if (member.silhouette_image_url.startsWith('http://') || member.silhouette_image_url.startsWith('https://')) return member.silhouette_image_url
        if (member.silhouette_image_url.startsWith('/')) return getAssetPath(member.silhouette_image_url)
        return getAssetPath(`/images/members/${member.silhouette_image_url}`)
      }
      return getAssetPath('/images/members/placeholder.svg')
    }
    if (member?.shop_image_url) {
      if (member.shop_image_url.startsWith('http://') || member.shop_image_url.startsWith('https://')) return member.shop_image_url
      if (member.shop_image_url.startsWith('/')) return getAssetPath(member.shop_image_url)
      return getAssetPath(`/images/shop/${member.shop_image_url}`)
    }
    if (member?.image_url && (member.image_url.startsWith('http://') || member.image_url.startsWith('https://'))) {
      return member.image_url
    }
    const clean = member?.member_id ? String(member.member_id).toLowerCase().replace(/[^a-z0-9]/g, '') : fallbackId
    return getAssetPath(`/images/shop/${clean}.webp`)
  }

  // Ambil hingga 3 member terdepan dari database shop members
  const member1 = shopMembers[0]
  const member2 = shopMembers[1]
  const member3 = shopMembers[2]

  const photo1 = getShopPhoto(member1, 'aca')
  const photo2 = getShopPhoto(member2, 'sinta')
  const photo3 = getShopPhoto(member3, 'cally')
  const label1 = member1?.nama_panggung ? `${member1.nama_panggung} Cheki` : 'Official Cheki'

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white relative">
      <div className="container mx-auto max-w-7xl px-4">
           <div className="text-center mb-16">
               <h2 className="text-4xl md:text-6xl font-black text-dark overflow-hidden">
                  <motion.span initial={{ y: "100%" }} whileInView={{ y: 0 }} transition={{ duration: 0.5 }} className="inline-block">OFFICIAL MERCH</motion.span>
               </h2>
               <p className="mt-4 text-gray-500 font-light">Dapatkan merchandise resmi Refresh Breeze</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
               <div onClick={() => navigate('/shop')} className="sm:col-span-2 lg:col-span-2 bg-[#0a0f1d] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden group cursor-pointer text-white h-[280px] sm:h-[350px] md:h-[400px] flex flex-col justify-end">
                  <img src={getAssetPath('/images/members/group.webp')} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4"><span className="bg-[#079108] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Best Seller</span></div>
                      <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-2 sm:mb-4">Group Cheki</h3>
                      <div className="flex items-center justify-between"><p className="text-gray-300 max-w-sm text-sm">Abadikan momen bersama seluruh member dalam satu frame eksklusif.</p><span className="w-12 h-12 rounded-full bg-white text-dark flex items-center justify-center group-hover:scale-110 transition-transform"><FaShoppingCart /></span></div>
                  </div>
               </div>

               <div onClick={() => navigate('/shop')} className="bg-gray-100 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden group cursor-pointer h-[280px] sm:h-[350px] md:h-[400px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#079108] rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div><h3 className="text-2xl font-black text-dark uppercase mb-2">Member Cheki</h3><p className="text-gray-500 text-sm font-bold">2-Shot Polaroid</p></div>
                  <div className="relative h-48 w-full">
                      {/* Kartu 1 (Depan) - Polaroid Asli Kanvas Putih */}
                      <div className="polaroid-card absolute bottom-0 right-0 w-32 h-44 p-1.5 pb-9 shadow-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 z-30 rounded-sm">
                        <div className="w-full h-full overflow-hidden bg-gray-100 rounded-xs">
                          <img 
                            src={photo1} 
                            alt={member1?.nama_panggung || 'Member'}
                            loading="lazy" 
                            className="w-full h-full object-contain scale-[1.25] grayscale group-hover:grayscale-0 transition-all duration-700 origin-top pt-1" 
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = getAssetPath('/images/shop/aca.webp')
                            }}
                          />
                        </div>
                        <p className="absolute bottom-2 left-0 w-full text-center text-[7.5px] font-black text-gray-500 tracking-[0.18em] uppercase select-none truncate px-1">
                          {label1}
                        </p>
                      </div>

                      {/* Kartu 2 (Tengah) - Polaroid Asli Kanvas Putih */}
                      <div className="polaroid-card absolute bottom-2 right-12 w-30 h-40 p-1.5 pb-8 shadow-xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-20 rounded-sm">
                        <div className="w-full h-full overflow-hidden bg-gray-100 rounded-xs">
                          <img 
                            src={photo2} 
                            alt={member2?.nama_panggung || 'Member'}
                            loading="lazy" 
                            className="w-full h-full object-contain scale-[1.25] grayscale group-hover:grayscale-0 transition-all duration-700 origin-top pt-1" 
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = getAssetPath('/images/shop/sinta.webp')
                            }}
                          />
                        </div>
                      </div>

                      {/* Kartu 3 (Belakang) - Polaroid Asli Kanvas Putih */}
                      <div className="polaroid-card absolute bottom-4 right-24 w-28 h-36 p-1.5 pb-8 shadow-lg transform -rotate-12 group-hover:-rotate-20 transition-transform duration-500 z-10 opacity-80 group-hover:opacity-100 rounded-sm">
                        <div className="w-full h-full overflow-hidden bg-gray-100 rounded-xs">
                          <img 
                            src={photo3} 
                            alt={member3?.nama_panggung || 'Member'}
                            loading="lazy" 
                            className="w-full h-full object-contain scale-[1.25] grayscale group-hover:grayscale-0 transition-all duration-700 origin-top pt-1" 
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = getAssetPath('/images/shop/cally.webp')
                            }}
                          />
                        </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-2 text-dark font-black text-xs uppercase tracking-widest group-hover:text-[#079108] transition-colors">Browse All <FaArrowRight /></div>
               </div>
           </div>

           {merchPreview.length > 0 && (
           <div className="mt-16 sm:mt-20">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 bg-[#079108] rounded-xl flex items-center justify-center shadow-lg shadow-[#079108]/20"><FaShoppingCart className="text-white" /></div>
               <div><h3 className="text-2xl font-black uppercase tracking-wide">Merchandise</h3><p className="text-xs text-gray-400 font-semibold mt-0.5">Merchandise resmi Refresh Breeze – tersedia sekarang!</p></div>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
               {merchPreview.map((item, idx) => (
                 <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -6 }} onClick={() => navigate('/shop')} className="group bg-white rounded-[1.5rem] shadow-lg hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100">
                   {item.gambar_url && <div className="w-full bg-gradient-to-br from-emerald-50 to-gray-100 overflow-hidden"><img src={item.gambar_url} alt={item.nama} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700" loading="lazy" /></div>}
                   <div className="p-4"><h4 className="font-black text-sm uppercase tracking-tight text-gray-900 leading-tight truncate">{item.nama}</h4>{item.deskripsi && <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{item.deskripsi}</p>}<p className="text-base font-black text-[#079108] mt-2">IDR {item.harga.toLocaleString()}</p></div>
                 </motion.div>
               ))}
             </div>
             <div className="text-center mt-10">
               <button onClick={() => navigate('/shop')} className="px-10 py-4 bg-[#079108] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#068007] transition-all shadow-xl shadow-[#079108]/20 hover:scale-105">Visit Store</button>
             </div>
           </div>
           )}
      </div>
    </section>
  )
}

export default ShopPreviewSection
