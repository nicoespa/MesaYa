'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PartyList } from '@/components/PartyList'
import { StatsCards } from '@/components/StatsCards'
import { AddPartyDialog } from '@/components/AddPartyDialog'
import { EditPartyDialog } from '@/components/EditPartyDialog'
import { useRealtimeQueue } from '@/lib/hooks/useRealtimeQueue'
import { useRestaurant } from '@/lib/contexts/RestaurantContext'
import { PartyWithDetails } from '@/lib/db/types'
import { ArrowUpDown, Clock, Users, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingParty, setEditingParty] = useState<PartyWithDetails | null>(null)
  const [sortBy, setSortBy] = useState<'position' | 'eta' | 'name' | 'size'>('position')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const { restaurant, loading: restaurantLoading } = useRestaurant()

  // Use real-time hook for data
  const { parties, stats, loading, error, refetch } = useRealtimeQueue({
    restaurantId: restaurant?.id || '',
    enabled: !!restaurant && !restaurantLoading,
  })

  // Update last update time when data changes
  useEffect(() => {
    if (parties.length > 0 || stats.waiting > 0) {
      setLastUpdate(new Date())
    }
  }, [parties, stats])

  const handlePartyAction = async (partyId: string, action: string) => {
    if (action === 'edit') {
      const party = parties.find(p => p.id === partyId)
      if (party) {
        setEditingParty(party)
        setShowEditDialog(true)
      }
      return
    }

    try {
      const response = await fetch(`/api/party/${partyId}/${action}`, {
        method: 'POST',
      })
      
      if (response.ok) {
        refetch() // Refresh the queue
      }
    } catch (error) {
      console.error(`Error ${action} party:`, error)
    }
  }

  const handleAddParty = async (partyData: any) => {
    try {
      const response = await fetch('/api/party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...partyData,
          restaurantId: restaurant.id,
        }),
      })
      
      if (response.ok) {
        refetch() // Refresh the queue
        setShowAddDialog(false)
      }
    } catch (error) {
      console.error('Error adding party:', error)
    }
  }

  const handleEditParty = async (partyId: string, partyData: any) => {
    try {
      const response = await fetch(`/api/party/${partyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partyData),
      })
      
      if (response.ok) {
        refetch() // Refresh the queue
        setShowEditDialog(false)
        setEditingParty(null)
      }
    } catch (error) {
      console.error('Error editing party:', error)
    }
  }

  const toggleWaitlist = () => {
    setIsOpen(!isOpen)
    // TODO: Update waitlist status in database
  }

  const handleSort = (newSortBy: 'position' | 'eta' | 'name' | 'size') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('asc')
    }
  }

  const getSortedParties = () => {
    const sorted = [...parties].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'position':
          comparison = a.position - b.position
          break
        case 'eta':
          comparison = a.eta_minutes - b.eta_minutes
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'size':
          comparison = a.size - b.size
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return sorted
  }

  if (restaurantLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurante no encontrado</h2>
          <p className="text-gray-600">No se pudo cargar la información del restaurante</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name || 'Restaurante'}</h1>
              <p className="text-gray-600">Dashboard de Lista de Espera</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {isOpen ? 'Lista Abierta' : 'Lista Cerrada'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Última actualización: {lastUpdate.toLocaleTimeString('es-AR')}
              </div>
              <Button
                onClick={toggleWaitlist}
                variant={isOpen ? 'destructive' : 'default'}
                size="sm"
              >
                {isOpen ? 'Cerrar Lista' : 'Abrir Lista'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="w-full">
            <StatsCards stats={stats} />
          </div>

          {/* Party List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Lista de Espera</h2>
                  <p className="text-sm text-gray-600">
                    {parties.length} {parties.length === 1 ? 'persona' : 'personas'} en la fila
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Sort Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleSort('position')}
                      variant={sortBy === 'position' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Posición
                    </Button>
                    <Button
                      onClick={() => handleSort('eta')}
                      variant={sortBy === 'eta' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Tiempo
                    </Button>
                    <Button
                      onClick={() => handleSort('name')}
                      variant={sortBy === 'name' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                    >
                      <ArrowUpDown className="h-3 w-3 mr-1" />
                      Nombre
                    </Button>
                    <Button
                      onClick={() => handleSort('size')}
                      variant={sortBy === 'size' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Tamaño
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    disabled={!isOpen}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                  >
                    + Agregar Persona
                  </Button>
                </div>
              </div>
            </div>
            <PartyList
              parties={getSortedParties()}
              onPartyAction={handlePartyAction}
              disabled={!isOpen}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Add Party Dialog */}
      <AddPartyDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddParty={handleAddParty}
      />

      {/* Edit Party Dialog */}
      <EditPartyDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onEditParty={handleEditParty}
        party={editingParty}
      />
    </>
  )
}
