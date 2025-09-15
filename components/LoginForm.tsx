'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Building2, Users } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  slug: string
  address: string
}

const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Kansas Belgrano',
    slug: 'kansas-belgrano',
    address: 'Av. Santa Fe 3456, C1425 CABA, Argentina'
  },
  {
    id: 'demo-restaurant-2',
    name: 'La Parolaccia',
    slug: 'la-parolaccia',
    address: 'Av. Corrientes 1234, C1043 CABA, Argentina'
  },
  {
    id: 'demo-restaurant-3',
    name: 'Don Julio',
    slug: 'don-julio',
    address: 'Guatemala 4699, C1425 CABA, Argentina'
  }
]

export function LoginForm() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRestaurant) return

    setLoading(true)
    setError('')

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store restaurant info in localStorage for demo purposes
      localStorage.setItem('selectedRestaurant', JSON.stringify(selectedRestaurant))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Iniciar Sesión
        </CardTitle>
        <CardDescription className="text-gray-600">
          Selecciona tu restaurante para acceder al dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Restaurant Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">
            Selecciona tu restaurante
          </Label>
          <div className="space-y-2">
            {DEMO_RESTAURANTS.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => handleRestaurantSelect(restaurant)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedRestaurant?.id === restaurant.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedRestaurant?.id === restaurant.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRestaurant?.id === restaurant.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {restaurant.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {restaurant.address}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        {selectedRestaurant && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@restaurante.com"
                required
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        )}

        {/* Demo Info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Modo Demo</p>
              <p>Puedes usar cualquier email y contraseña para probar el sistema.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
