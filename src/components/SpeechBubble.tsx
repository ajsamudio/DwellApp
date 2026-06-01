import { motion, AnimatePresence } from 'framer-motion'

// The companion's gentle, motivational line. Soft, lowercase, encouraging.
export default function SpeechBubble({ text }: { text: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.96 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative max-w-[230px]"
      >
        <div className="rounded-3xl rounded-bl-md bg-white px-5 py-3 text-center text-[15px] font-medium leading-snug text-bark-600 shadow-soft">
          {text}
        </div>
        {/* little tail */}
        <div className="absolute -bottom-1 left-6 h-4 w-4 rotate-45 rounded-sm bg-white shadow-soft" />
      </motion.div>
    </AnimatePresence>
  )
}
