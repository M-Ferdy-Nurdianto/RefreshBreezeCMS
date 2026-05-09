import { motion } from 'framer-motion'

const HeroSection = ({ members, activeMemberId, setActiveMemberId, navigate }) => {
  const getMemberStyle = (member) => ({
    objectPosition: `${member.posX}% ${member.posY}%`,
    transform: `scale(${member.scale}) translate(${member.translateX}px, ${member.translateY}px)`
  })

  return (
    <>
      {/* Desktop Hero */}
      <section className="relative h-[100vh] w-full hidden md:flex overflow-hidden">
        {members.map((member, idx) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: Math.abs(idx - 3) * 0.1, ease: "easeOut" }}
            className="hero-column relative group cursor-pointer"
            onClick={() => navigate('/members')}
          >
            <div className="absolute inset-0">
               <img 
                 src={member.photo} 
                 alt={member.name} 
                 className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
               />
               <div className={`absolute inset-0 ${member.color} mix-blend-multiply opacity-30 group-hover:opacity-0 transition-opacity duration-700`}></div>
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            <div className="absolute inset-x-0 bottom-24 flex justify-center z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
              <span className="vertical-rl text-orientation-mixed text-white font-black text-xl md:text-2xl tracking-[0.2em] opacity-80 drop-shadow-2xl">
                {member.name}
              </span>
            </div>
          </motion.div>
        ))}

        <div className="absolute inset-x-0 bottom-[25%] flex flex-col items-center justify-center z-20 pointer-events-none">
          <motion.div 
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.8 } } }}
            className="text-center"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 0.7, y: 0 } }} className="mb-1 text-[9px] tracking-[0.5em] font-bold text-white uppercase">
              Japanese Style Idol Group • Tulungagung
            </motion.div>
            <motion.h1 variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="text-3xl font-black tracking-[0.1em] text-white my-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              REFRESH BREEZE
            </motion.h1>
            <motion.div variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }} className="text-xs font-black tracking-[0.5em] text-accent-yellow uppercase">
              リフレッシュ・ブリーズ
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 w-full h-2 caution-pattern z-30 opacity-60"></div>
      </section>

      {/* Mobile Hero */}
      <section className="md:hidden relative bg-white flex flex-col pt-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-8 text-center bg-white">
          <p className="text-[8px] tracking-[0.5em] font-black text-[#079108]/60 uppercase mb-2">Japanese Style Idol Group • Tulungagung</p>
          <h1 className="text-4xl font-black tracking-tight text-[#079108] mb-1">REFRESH BREEZE</h1>
          <p className="text-xs font-black tracking-[0.4em] text-accent-yellow">リフレッシュ・ブリーズ</p>
        </motion.div>
        <div className="flex flex-col relative">
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, height: 80 }}
              animate={{ opacity: 1, height: activeMemberId === member.id ? 180 : 80 }}
              whileHover={{ height: 120 }}
              transition={{ height: { type: "spring", stiffness: 300, damping: 30 }, opacity: { delay: idx * 0.05 } }}
              onClick={() => setActiveMemberId(activeMemberId === member.id ? null : member.id)}
              className="relative overflow-hidden cursor-pointer group border-b border-white/5"
            >
              <img 
                src={member.photo} 
                alt={member.name}
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ${activeMemberId === member.id ? 'grayscale-0 scale-110 brightness-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'}`}
                style={getMemberStyle(member)}
              />
              <div className={`absolute inset-0 ${member.color} transition-opacity duration-700 z-10 ${activeMemberId === member.id ? 'opacity-0' : 'opacity-40 mix-blend-multiply group-hover:opacity-0'}`}></div>
            </motion.div>
          ))}
          <div className="h-2 w-full caution-pattern opacity-60"></div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
