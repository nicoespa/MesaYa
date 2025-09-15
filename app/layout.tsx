import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/context'
import { ToastProvider } from '@/components/providers/ToastProvider'
import { RestaurantProvider } from '@/lib/contexts/RestaurantContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FilaYA - Lista de Espera para Restaurantes',
  description: 'Sistema de gestión de listas de espera para restaurantes en Argentina con notificaciones por WhatsApp',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FilaYA',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <RestaurantProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </RestaurantProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
