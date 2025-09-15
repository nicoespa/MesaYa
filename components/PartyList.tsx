import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { PartyWithDetails } from '@/lib/db/types'
import { Phone, Users, Clock, MessageSquare, CheckCircle, XCircle, UserX } from 'lucide-react'
import { useState } from 'react'

interface PartyListProps {
  parties: PartyWithDetails[]
  onPartyAction: (partyId: string, action: string) => void
  disabled?: boolean
  loading?: boolean
}

export function PartyList({ parties, onPartyAction, disabled = false, loading = false }: PartyListProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleAction = async (partyId: string, action: string) => {
    setActionLoading(partyId)
    try {
      await onPartyAction(partyId, action)
    } finally {
      setActionLoading(null)
    }
  }
  const getStateBadge = (state: string) => {
    switch (state) {
      case 'queued':
        return <Badge variant="default">En Fila</Badge>
      case 'notified':
        return <Badge variant="warning">Notificado</Badge>
      case 'on_the_way':
        return <Badge variant="success">En Camino</Badge>
      case 'seated':
        return <Badge variant="outline">Mesa Lista</Badge>
      case 'no_show':
        return <Badge variant="destructive">No Show</Badge>
      case 'canceled':
        return <Badge variant="outline">Eliminado</Badge>
      default:
        return <Badge variant="outline">{state}</Badge>
    }
  }

  const getStateActions = (party: PartyWithDetails) => {
    const isLoading = actionLoading === party.id
    const isDisabled = disabled || isLoading

    // Simplified actions for all states
    return (
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          onClick={() => handleAction(party.id, 'seated')}
          disabled={isDisabled}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200"
        >
          {isLoading ? (
            <Loading size="sm" className="mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Mesa Lista
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction(party.id, 'no-show')}
          disabled={isDisabled}
          className="border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          <XCircle className="h-4 w-4 mr-2" />
          No Show
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction(party.id, 'edit')}
          disabled={isDisabled}
          className="border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Editar
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction(party.id, 'cancel')}
          disabled={isDisabled}
          className="border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          <UserX className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <Loading text="Cargando lista de espera..." />
      </div>
    )
  }

  if (parties.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-gray-500">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lista Vacía</h3>
          <p className="text-gray-600">No hay personas en la lista de espera</p>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {parties.map((party, index) => (
        <div
          key={party.id}
          className="p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                  {party.position}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {party.name}
                  </h3>
                  {getStateBadge(party.state)}
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{party.size} personas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{party.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium text-blue-600">
                      {party.wait_time_minutes || party.eta_minutes} min
                    </span>
                  </div>
                </div>
                
                {party.notes && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 italic">
                      💬 "{party.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStateActions(party)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
