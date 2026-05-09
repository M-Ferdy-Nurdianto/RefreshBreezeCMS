import { motion } from 'framer-motion'
import { FaPlus } from 'react-icons/fa'
import { getMemberColor, formatMemberName } from '../../lib/memberUtils'

const MemberCard = ({ member, idx, addToCart, getMemberImage, hargaMember }) => {
  const accentColor = getMemberColor(member.nama_panggung)
  
  return (
    <motion.div 
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: idx * 0.1 }}
       whileHover={{ y: -8, scale: 1.02 }}
       className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer"
       onClick={() => addToCart('member', member)}
       style={{
         boxShadow: `0 4px 30px ${accentColor}20`
       }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl transition-all duration-500 group-hover:bg-white/90 group-hover:border-white/80"></div>
      
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `0 0 40px ${accentColor}40, inset 0 0 60px ${accentColor}10`
        }}
      ></div>

      <div className="absolute inset-3 top-3 bottom-24 rounded-2xl overflow-hidden bg-gradient-to-b from-white/20 to-white/40 backdrop-blur-sm border border-white/30">
         <img 
            src={getMemberImage(member)}
            alt={member.nama_panggung} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 p-2"
         />
         <div 
           className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{
             background: `linear-gradient(to top, ${accentColor}40, transparent 50%)`
           }}
         ></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
         <div className="flex items-center gap-2">
           <span 
             className="w-2 h-2 rounded-full"
             style={{ backgroundColor: accentColor }}
           ></span>
           <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 truncate">{formatMemberName(member.nama_panggung)}</h4>
         </div>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">2-Shot Ticket</p>
         <div className="flex items-center justify-between pt-1">
            <span 
              className="text-base font-black"
              style={{ color: accentColor }}
            >
              IDR {hargaMember.toLocaleString()}
            </span>
            <motion.div 
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-300"
              style={{ backgroundColor: accentColor }}
            >
               <FaPlus className="text-xs" />
            </motion.div>
         </div>
      </div>
    </motion.div>
  )
}

export default MemberCard
