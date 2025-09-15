'use client'

import { QRCodeGenerator } from '@/components/QRCodeGenerator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRestaurant } from '@/lib/contexts/RestaurantContext'
import { Download, Share2, RefreshCw } from 'lucide-react'

export default function QRPage() {
  const { restaurant, loading } = useRestaurant()

  const handleDownload = () => {
    // TODO: Implement QR code download
    console.log('Download QR code')
  }

  const handleShare = () => {
    // TODO: Implement QR code sharing
    console.log('Share QR code')
  }

  const handleRefresh = () => {
    // TODO: Implement QR code refresh
    console.log('Refresh QR code')
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
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

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">QR Code</h1>
          <p className="text-gray-600">Código QR para que los clientes se unan a la lista de espera</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tu Código QR</CardTitle>
                  <CardDescription>
                    Los clientes pueden escanear este código para unirse a la lista de espera
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300">
                    <QRCodeGenerator
                      restaurantSlug={restaurant.slug}
                      restaurantName={restaurant.name}
                    />
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-gray-600">
                      <strong>Restaurante:</strong> {restaurant.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>URL:</strong> {process.env.NEXT_PUBLIC_APP_URL}/join/{restaurant.slug}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar QR
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
                <Button onClick={handleRefresh} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Instrucciones de Uso</CardTitle>
                  <CardDescription>
                    Cómo usar el código QR en tu restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Imprime el QR</h4>
                      <p className="text-sm text-gray-600">
                        Descarga e imprime el código QR en un tamaño visible (mínimo 10x10 cm)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Colócalo visiblemente</h4>
                      <p className="text-sm text-gray-600">
                        Ponlo en la entrada, mostrador o mesa de espera donde los clientes puedan verlo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Los clientes escanean</h4>
                      <p className="text-sm text-gray-600">
                        Los clientes abren su cámara, escanean el QR y se unen automáticamente a la lista
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Gestiona desde el dashboard</h4>
                      <p className="text-sm text-gray-600">
                        Ve y gestiona todas las personas que se unieron desde el dashboard principal
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>💡 Consejos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">
                    • Asegúrate de que el QR esté bien iluminado
                  </p>
                  <p className="text-sm text-gray-600">
                    • Colócalo a la altura de los ojos
                  </p>
                  <p className="text-sm text-gray-600">
                    • Ten un QR de respaldo en caso de que se dañe
                  </p>
                  <p className="text-sm text-gray-600">
                    • Considera laminarlo para mayor durabilidad
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
