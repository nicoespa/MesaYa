'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/utils'
import { 
  Users, 
  Calendar, 
  History, 
  BarChart3, 
  QrCode, 
  HelpCircle, 
  Settings,
  LogOut
} from 'lucide-react'

const navigation = [
  {
    name: 'Waitlist',
    href: '/dashboard',
    icon: Users,
  },
  {
    name: 'Reservations',
    href: '/dashboard/reservations',
    icon: Calendar,
  },
  {
    name: 'History',
    href: '/dashboard/history',
    icon: History,
  },
  {
    name: 'Charts',
    href: '/dashboard/charts',
    icon: BarChart3,
  },
  {
    name: 'QR Code',
    href: '/dashboard/qr',
    icon: QrCode,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className={cn(
      "bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-xl font-bold">FilaYA</h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <div className="w-4 h-4 flex flex-col justify-center">
                <div className="w-full h-0.5 bg-white mb-1"></div>
                <div className="w-full h-0.5 bg-white mb-1"></div>
                <div className="w-full h-0.5 bg-white"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isCollapsed ? "mx-auto" : "mr-3"
                )} />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700 space-y-2">
          {/* User Info */}
          {user && !isCollapsed && (
            <div className="px-4 py-2 text-sm text-blue-200 border-b border-blue-600 mb-2">
              <p className="font-medium">{user.email}</p>
            </div>
          )}
          
          <button className="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors w-full">
            <HelpCircle className={cn(
              "h-5 w-5",
              isCollapsed ? "mx-auto" : "mr-3"
            )} />
            {!isCollapsed && <span>Help</span>}
          </button>
          <button className="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors w-full">
            <Settings className={cn(
              "h-5 w-5",
              isCollapsed ? "mx-auto" : "mr-3"
            )} />
            {!isCollapsed && <span>Settings</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-lg text-red-200 hover:bg-red-700 hover:text-white transition-colors w-full"
          >
            <LogOut className={cn(
              "h-5 w-5",
              isCollapsed ? "mx-auto" : "mr-3"
            )} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
