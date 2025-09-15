'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, MapPin, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { PartyWithDetails } from '@/lib/db/types'

interface QueueParty {
  id: string
  name: string
  size: number
  position: number
  isCurrentParty: boolean
  state: string
  created_at: string
}

export default function StatusPage() {
  const params = useParams()
  const token = params.token as string
  
  const [party, setParty] = useState<PartyWithDetails | null>(null)
  const [queue, setQueue] = useState<QueueParty[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchStatus()
    
    // Set up real-time updates
    const interval = setInterval(fetchStatus, 10000) // Poll every 10 seconds
    
    return () => clearInterval(interval)
  }, [token])

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/status/${token}`)
      const data = await response.json()
      
      if (data.success) {
        setParty(data.party)
        setQueue(data.queue || [])
      }
    } catch (error) {
      console.error('Error fetching status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    setActionLoading(action)
    
    try {
      const response = await fetch(`/api/status/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      
      if (response.ok) {
        if (action === 'cancel') {
          // Redirect to confirmation page after canceling
          window.location.href = '/canceled?canceled=true'
        } else {
          fetchStatus() // Refresh status for other actions
        }
      }
    } catch (error) {
      console.error(`Error ${action}:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStateInfo = (state: string) => {
    switch (state) {
      case 'queued':
        return {
          title: 'En la Fila',
          description: 'Estás en la lista de espera',
          color: 'default',
          icon: Users,
        }
      case 'notified':
        return {
          title: 'Notificado',
          description: 'Te notificamos que tu mesa está lista',
          color: 'warning',
          icon: CheckCircle,
        }
      case 'on_the_way':
        return {
          title: 'En Camino',
          description: 'Sabemos que estás viniendo',
          color: 'success',
          icon: Clock,
        }
      case 'seated':
        return {
          title: 'Sentado',
          description: '¡Disfruta tu comida!',
          color: 'outline',
          icon: CheckCircle,
        }
      case 'no_show':
        return {
          title: 'No Show',
          description: 'No pudimos contactarte',
          color: 'destructive',
          icon: XCircle,
        }
      case 'canceled':
        return {
          title: 'Cancelado',
          description: 'Cancelaste tu lugar en la fila',
          color: 'outline',
          icon: XCircle,
        }
      default:
        return {
          title: 'Desconocido',
          description: 'Estado no reconocido',
          color: 'outline',
          icon: Clock,
        }
    }
  }

  const getAvailableActions = (state: string) => {
    switch (state) {
      case 'queued':
        return [
          { action: 'on_the_way', label: 'Voy en Camino', variant: 'default' as const },
        ]
      case 'notified':
        return [
          { action: 'on_the_way', label: 'Voy en Camino', variant: 'default' as const },
        ]
      case 'on_the_way':
        return [
          { action: 'delay', label: 'Posponer 10 min', variant: 'outline' as const },
        ]
      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estado...</p>
        </div>
      </div>
    )
  }

  if (!party) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No encontrado</h1>
            <p className="text-gray-600 mb-4">
              No pudimos encontrar tu lugar en la lista.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stateInfo = getStateInfo(party.state)
  const availableActions = getAvailableActions(party.state)
  const StateIcon = stateInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Restaurant Logo */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-md mx-auto px-6 py-8">
          <div className="text-center">
            {/* Restaurant Logo/Name */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                <span className="text-2xl font-bold text-white">🍽️</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {party.restaurant.name}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                RESTAURANTE & BAR
              </div>
            </div>
            
            {/* Wait Time */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-sm font-medium mb-2 opacity-90">Tiempo estimado</div>
                <div className="text-4xl font-bold mb-1">
                  {party.eta_minutes || 18} min
                </div>
                <div className="text-sm opacity-90">de espera</div>
              </div>
            </div>

            {/* Waitlist Table */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lista de Espera</h3>
                <p className="text-sm text-gray-500">Tu posición en la fila</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm font-semibold text-gray-500 mb-4 pb-2 border-b border-gray-200">
                <div>Posición</div>
                <div>Nombre</div>
                <div>Personas</div>
              </div>
              
              {/* Queue Rows */}
              <div className="space-y-3">
                {queue.map((queueParty) => (
                  <div 
                    key={queueParty.id}
                    className={`rounded-xl p-4 transition-all duration-200 ${
                      queueParty.isCurrentParty 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className={`font-bold text-lg ${
                        queueParty.isCurrentParty ? 'text-white' : 'text-gray-900'
                      }`}>
                        #{queueParty.position}
                      </div>
                      <div className={`font-bold ${
                        queueParty.isCurrentParty ? 'text-white' : 'text-gray-900'
                      }`}>
                        {queueParty.name}
                      </div>
                      <div className={`font-bold ${
                        queueParty.isCurrentParty ? 'text-white' : 'text-gray-900'
                      }`}>
                        {queueParty.size} {queueParty.size === 1 ? 'persona' : 'personas'}
                      </div>
                    </div>
                    {queueParty.isCurrentParty && (
                      <div className="text-center mt-2">
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                          ¡Eres tú!
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {queue.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">No hay personas en la fila</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {availableActions.length > 0 && (
                <div className="space-y-3">
                  {availableActions.map((action) => (
                    <Button
                      key={action.action}
                      variant={action.variant}
                      className="w-full h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleAction(action.action)}
                      disabled={actionLoading === action.action}
                    >
                      {actionLoading === action.action ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        action.label
                      )}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Remove from list button */}
              <Button
                variant="outline"
                className="w-full h-14 text-base font-semibold text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => handleAction('cancel')}
                disabled={actionLoading === 'cancel'}
              >
                {actionLoading === 'cancel' ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>Remover de la lista</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="max-w-md mx-auto px-6 py-8">
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
                <StateIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">{stateInfo.title}</CardTitle>
            <CardDescription className="text-gray-600">{stateInfo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {party.notes && (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700 italic">
                    "{party.notes}"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Powered by FilaYA */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="font-medium">powered by FilaYA</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            🔄 Esta página se actualiza automáticamente
          </p>
          <p className="text-xs text-gray-500">
            📱 Te notificaremos cuando tu mesa esté lista
          </p>
        </div>
      </div>
    </div>
  )
}

