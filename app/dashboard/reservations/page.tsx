'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRestaurant } from '@/lib/contexts/RestaurantContext'
import { useDynamicData } from '@/lib/hooks/useDynamicData'
import { Calendar, Clock, Users, Phone, Plus } from 'lucide-react'

export default function ReservationsPage() {
  const { restaurant, loading: restaurantLoading } = useRestaurant()
  const { data: dynamicData, loading: dataLoading } = useDynamicData()
  
  // Mock data - in real app this would come from API
  const reservations = [
    {
      id: '1',
      name: 'María González',
      phone: '+5491123456789',
      size: 4,
      date: '2024-01-15',
      time: '20:00',
      status: 'confirmed',
      notes: 'Mesa cerca de la ventana'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+5491123456790',
      size: 2,
      date: '2024-01-15',
      time: '19:30',
      status: 'pending',
      notes: ''
    },
    {
      id: '3',
      name: 'Ana Martínez',
      phone: '+5491123456791',
      size: 6,
      date: '2024-01-16',
      time: '21:00',
      status: 'cancelled',
      notes: 'Canceló por enfermedad'
    }
  ]

  if (restaurantLoading || dataLoading) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reservaciones...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurante no encontrado</h2>
          <p className="text-gray-600">No se pudo cargar la información del restaurante</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmada</Badge>
      case 'pending':
        return <Badge variant="warning" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reservaciones</h1>
              <p className="text-gray-600">Gestiona las reservaciones de tu restaurante</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reservación
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reservaciones</p>
                    <p className="text-2xl font-bold text-gray-900">{dynamicData?.reservations.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dynamicData?.reservations.confirmed || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dynamicData?.reservations.pending || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reservations List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Reservaciones</CardTitle>
              <CardDescription>
                Todas las reservaciones programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{reservation.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {reservation.phone}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {reservation.size} personas
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {reservation.date} a las {reservation.time}
                          </span>
                        </div>
                        {reservation.notes && (
                          <p className="text-sm text-gray-500 mt-1">{reservation.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(reservation.status)}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          Llamar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
