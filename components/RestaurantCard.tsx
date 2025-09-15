'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Users, QrCode, Star } from 'lucide-react'

interface RestaurantCardProps {
  restaurant: {
    id: string
    name: string
    slug: string
    address: string
    rating?: number
    waitTime?: number
    isOpen?: boolean
  }
  onSelect: () => void
  isSelected?: boolean
}

export function RestaurantCard({ restaurant, onSelect, isSelected }: RestaurantCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50 shadow-lg' 
          : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-1">
              {restaurant.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {restaurant.address}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {restaurant.isOpen ? (
              <Badge variant="default" className="bg-green-500 text-white">
                Abierto
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-500 text-white">
                Cerrado
              </Badge>
            )}
            {restaurant.rating && (
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                {restaurant.rating}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{restaurant.waitTime || 15} min espera</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>8 en fila</span>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <QrCode className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">
              Escanea para unirte a la fila
            </p>
          </div>

          {/* Action Button */}
          <Button 
            className={`w-full ${
              isSelected 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            variant={isSelected ? 'default' : 'secondary'}
          >
            {isSelected ? 'Seleccionado' : 'Seleccionar Restaurante'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
