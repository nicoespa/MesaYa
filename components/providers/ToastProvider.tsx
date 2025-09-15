'use client'

import { useToast } from '@/components/ui/toast'
import { ToastContainer } from '@/components/ui/toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
