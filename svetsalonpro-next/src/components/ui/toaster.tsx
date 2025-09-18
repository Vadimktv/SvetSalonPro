'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from './use-toast';
import { Toast, ToastViewport } from './toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastViewport>
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <Toast {...toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastViewport>
  );
}
