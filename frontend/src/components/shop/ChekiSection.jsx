import { motion } from 'framer-motion'
import { FaTicketAlt, FaPlus } from 'react-icons/fa'
import MemberCard from './MemberCard'
import Skeleton from '../Skeleton'

const ChekiSection = ({ 
  loading, 
  members, 
  hargaGrup, 
  hargaMember, 
  addToCart, 
  getMemberImage, 
  getAssetPath,
  selectedEvent
}) => {
  const isMemberInLineup = (memberId) => {
    if (!selectedEvent || !selectedEvent.event_lineup || selectedEvent.event_lineup.length === 0) return true;
    return selectedEvent.event_lineup.some(l => String(l.member_id) === String(memberId));
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-gray-700 to-[#079108] bg-clip-text text-transparent">
           Shop Tickets
         </h1>
         <p className="text-gray-500 font-medium text-sm sm:text-base">Dapatkan tiket cheki eksklusif bersama member favoritmu!</p>
         <div className="absolute -bottom-4 left-0 w-16 sm:w-24 h-1.5 bg-gradient-to-r from-[#079108] to-emerald-300 rounded-full"></div>
      </motion.div>

      {/* Group Cheki Hero Banner */}
      <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-56 sm:h-64 md:h-72 lg:h-96 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20 group cursor-pointer"
          onClick={() => addToCart('group')}
      >
          <div className="absolute inset-0">
              <img 
                 src={getAssetPath('/images/members/group.webp')} 
                 alt="Group Cheki" 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#079108]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center items-start z-10">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-[#079108] to-emerald-500 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-lg shadow-[#079108]/30"
              >
                 ✨ Best Value
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white uppercase tracking-tight mb-2 sm:mb-3 drop-shadow-2xl">
                 Group Cheki
              </h2>
              <p className="text-gray-300 font-medium max-w-md text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-8 hidden sm:block">
                 Foto eksklusif bersama seluruh member Refresh Breeze dalam satu frame.
              </p>
              <div className="flex items-center gap-4 sm:gap-8">
                 <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white">IDR {hargaGrup.toLocaleString()}</span>
                 <motion.button 
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-white text-[#079108] w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-white/20 group-hover:bg-[#079108] group-hover:text-white transition-colors duration-300"
                 >
                    <FaPlus className="text-lg" />
                 </motion.button>
              </div>
          </div>
      </motion.div>

      {/* Member Solo Cheki Section */}
      <div className="space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#079108] to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-[#079108]/20">
              <FaTicketAlt className="text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wide">Member Cheki</h3>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
           {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-white/50 backdrop-blur-sm border border-white/50 p-4">
                   <Skeleton className="w-full h-full rounded-2xl" />
                </div>
              ))
           ) : (
              members.map((member, idx) => (
                <MemberCard 
                  key={member.id}
                  member={member}
                  idx={idx}
                  addToCart={addToCart}
                  getMemberImage={getMemberImage}
                  hargaMember={hargaMember}
                  inLineup={isMemberInLineup(member.id)}
                />
              ))
           )}
         </div>
      </div>
    </div>
  )
}

export default ChekiSection
