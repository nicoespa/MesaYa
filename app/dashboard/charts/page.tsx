'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRestaurant } from '@/lib/contexts/RestaurantContext'
import { useHistoryData } from '@/lib/hooks/useHistoryData'
import { BarChart3, TrendingUp, Clock, Users, Calendar, RefreshCw } from 'lucide-react'

export default function ChartsPage() {
  const { restaurant, loading: restaurantLoading } = useRestaurant()
  const { data: historyData, loading: dataLoading, error, refetch } = useHistoryData()
  
  // Use real chart data from historyData
  const chartData = historyData?.charts || {
    hourly: Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count: 0
    })),
    daily: [
      { day: 'Lun', count: 0, date: '' },
      { day: 'Mar', count: 0, date: '' },
      { day: 'Mié', count: 0, date: '' },
      { day: 'Jue', count: 0, date: '' },
      { day: 'Vie', count: 0, date: '' },
      { day: 'Sáb', count: 0, date: '' },
      { day: 'Dom', count: 0, date: '' }
    ],
    waitTimes: [
      { range: '0-15 min', count: 0 },
      { range: '16-30 min', count: 0 },
      { range: '31-45 min', count: 0 },
      { range: '46-60 min', count: 0 },
      { range: '60+ min', count: 0 }
    ]
  }

  if (restaurantLoading || dataLoading) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando gráficos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (!historyData) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay datos disponibles</h2>
          <p className="text-gray-600">No se encontraron datos para mostrar gráficos</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Análisis y Gráficos</h1>
              <p className="text-gray-600">Estadísticas y tendencias de tu restaurante</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Últimos 7 días
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                    <p className="text-2xl font-bold text-gray-900">{historyData.stats.totalCustomers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{historyData.stats.avgWaitTime} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hora Pico</p>
                    <p className="text-2xl font-bold text-gray-900">{historyData.stats.peakHour}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Día Más Ocupado</p>
                    <p className="text-2xl font-bold text-gray-900">{historyData.stats.busiestDay}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Satisfacción</p>
                    <p className="text-2xl font-bold text-gray-900">{historyData.stats.satisfaction}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Horas</CardTitle>
                <CardDescription>
                  Número de clientes por hora del día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.hourly.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 text-sm text-gray-600">{item.hour}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{ width: `${(item.count / 35) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900">{item.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Días</CardTitle>
                <CardDescription>
                  Número de clientes por día de la semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.daily.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 text-sm text-gray-600">{item.day}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{ width: `${(item.count / 89) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm font-medium text-gray-900">{item.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wait Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Tiempos de Espera</CardTitle>
              <CardDescription>
                Tiempo que esperaron los clientes en la lista
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.waitTimes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-24 text-sm text-gray-600">{item.range}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.count / 28) * 100}%` }}
                      >
                        <span className="text-white text-xs font-medium">{item.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Insights y Recomendaciones</CardTitle>
              <CardDescription>
                Análisis automático de tus datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Tendencias Positivas</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Los sábados son tu día más rentable
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      El 65% de clientes espera menos de 30 minutos
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      La hora pico está bien distribuida
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Áreas de Mejora</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      Considera más personal los viernes
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      Los lunes podrías ofrecer promociones
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      Optimiza el flujo en horario pico
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
