import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

const Modal = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={cn(
              "relative z-50 w-full max-w-lg overflow-hidden rounded-xl border bg-card p-6 shadow-lg",
              className
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export { Modal }
