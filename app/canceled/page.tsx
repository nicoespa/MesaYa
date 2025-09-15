'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, ArrowLeft } from 'lucide-react'

export default function CanceledPage() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isCanceled = searchParams.get('canceled') === 'true'

  if (!isCanceled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
            <p className="text-gray-600 mb-4">
              Esta página no está disponible.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            ¡Removido exitosamente!
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Te has removido de la lista de espera. Gracias por usar FilaYA.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-800 text-center">
              🎉 Tu lugar en la fila ha sido liberado para otras personas
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Home className="h-5 w-5 mr-2" />
              Volver al inicio
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full h-12 text-base font-semibold text-gray-600 border-gray-300 hover:bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver atrás
            </Button>
          </div>
        </CardContent>

        {/* Powered by FilaYA */}
        <div className="text-center pb-6">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="font-medium">powered by FilaYA</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
