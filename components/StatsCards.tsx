import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QueueStats } from '@/lib/db/types'
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react'

interface StatsCardsProps {
  stats: QueueStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 min-h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold text-blue-800">En Espera</CardTitle>
          <div className="p-3 bg-blue-200 rounded-full">
            <Users className="h-5 w-5 text-blue-700" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-4xl font-bold text-blue-900 mb-2">{stats.waiting}</div>
          <p className="text-sm text-blue-700 font-medium leading-tight">
            personas en la fila
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 min-h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold text-orange-800">Tiempo Promedio</CardTitle>
          <div className="p-3 bg-orange-200 rounded-full">
            <Clock className="h-5 w-5 text-orange-700" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-4xl font-bold text-orange-900 mb-2">{stats.avg_wait_minutes}</div>
          <p className="text-sm text-orange-700 font-medium leading-tight">
            minutos de espera
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 min-h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold text-green-800">Sentados Hoy</CardTitle>
          <div className="p-3 bg-green-200 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-700" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-4xl font-bold text-green-900 mb-2">{stats.seated_today}</div>
          <p className="text-sm text-green-700 font-medium leading-tight">
            mesas ocupadas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 min-h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold text-red-800">No Shows</CardTitle>
          <div className="p-3 bg-red-200 rounded-full">
            <XCircle className="h-5 w-5 text-red-700" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-4xl font-bold text-red-900 mb-2">{stats.no_shows_today}</div>
          <p className="text-sm text-red-700 font-medium leading-tight">
            faltaron hoy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
