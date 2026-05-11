import { toast } from 'react-toastify'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa'

const toastStyles = {
  success: {
    icon: <FaCheckCircle className="text-emerald-500" />,
    accent: 'emerald',
    label: 'Success'
  },
  error: {
    icon: <FaExclamationCircle className="text-rose-500" />,
    accent: 'rose',
    label: 'Error'
  },
  info: {
    icon: <FaInfoCircle className="text-blue-500" />,
    accent: 'blue',
    label: 'Info'
  }
}

const CustomToast = ({ message, type = 'info', label }) => {
  const style = toastStyles[type] || toastStyles.info
  
  return (
    <div className="flex items-start gap-4 px-6 py-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px] max-w-[350px]">
      <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/5">
        {style.icon}
      </div>
      <div className="flex flex-col pt-0.5">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-2 ${type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
          {label || style.label}
        </p>
        <p className="text-sm font-black text-white leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

const toastOptions = (id) => ({
  toastId: id,
  position: "bottom-center",
  autoClose: 2500, // Hilang otomatis dalam 2.5 detik
  className: "!bg-transparent !p-0 !shadow-none min-h-0",
  bodyClassName: "!p-0 !m-0",
  closeButton: false,
})

export const showToast = {
  success: (message, label = 'Berhasil') => {
    const id = `success-${message}`
    const content = <CustomToast message={message} type="success" label={label} />
    if (toast.isActive(id)) toast.update(id, { render: content, ...toastOptions(id) })
    else toast(content, toastOptions(id))
  },
  error: (message, label = 'Gagal') => {
    const id = `error-${message}`
    const content = <CustomToast message={message} type="error" label={label} />
    if (toast.isActive(id)) toast.update(id, { render: content, ...toastOptions(id) })
    else toast(content, toastOptions(id))
  },
  info: (message, label = 'Info') => {
    const id = `info-${message}`
    const content = <CustomToast message={message} type="info" label={label} />
    if (toast.isActive(id)) toast.update(id, { render: content, ...toastOptions(id) })
    else toast(content, toastOptions(id))
  },
  // Custom for cart with emoji support
  cart: (message, emoji = '✨', label = 'Added to Cart') => {
    const id = `cart-${message}`
    const content = (
      <div className="flex items-start gap-4 px-6 py-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[280px] max-w-[350px]">
        <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner border border-white/5">
          {emoji}
        </div>
        <div className="flex flex-col pt-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 leading-none mb-2">{label}</p>
          <p className="text-sm font-black text-white leading-relaxed">{message}</p>
        </div>
      </div>
    )
    if (toast.isActive(id)) toast.update(id, { render: content, ...toastOptions(id) })
    else toast(content, toastOptions(id))
  }
}
