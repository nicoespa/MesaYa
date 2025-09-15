'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Users, Phone, MapPin } from 'lucide-react'
import { parsePhoneNumber, formatPhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

const joinWaitlistSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .refine((phone) => {
      try {
        const phoneNumber = parsePhoneNumber(phone, 'AR');
        return phoneNumber && phoneNumber.isValid();
      } catch {
        return false;
      }
    }, 'Formato de teléfono inválido'),
  size: z.number().int().min(1, 'Debe ser al menos 1 persona').max(12, 'Máximo 12 personas'),
  notes: z.string().optional(),
})

type JoinWaitlistForm = z.infer<typeof joinWaitlistSchema>

interface Restaurant {
  id: string
  name: string
  address?: string
  slug: string
}

export default function JoinWaitlistPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantSlug = params.restaurantSlug as string
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [statusLink, setStatusLink] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [phoneFormatted, setPhoneFormatted] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JoinWaitlistForm>({
    resolver: zodResolver(joinWaitlistSchema),
  })

  const phone = watch('phone')

  // Función para formatear el teléfono automáticamente
  const formatPhoneInput = (value: string) => {
    // Remover todos los caracteres no numéricos
    const numbers = value.replace(/\D/g, '')
    
    // Si empieza con 54, mantenerlo
    if (numbers.startsWith('54')) {
      return `+${numbers}`
    }
    
    // Si empieza con 9, agregar +54
    if (numbers.startsWith('9')) {
      return `+54${numbers}`
    }
    
    // Si empieza con 11, agregar +549
    if (numbers.startsWith('11')) {
      return `+549${numbers}`
    }
    
    // Si empieza con 15, agregar +549
    if (numbers.startsWith('15')) {
      return `+549${numbers}`
    }
    
    // Si es solo números, agregar +549
    if (numbers.length > 0) {
      return `+549${numbers}`
    }
    
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value)
    setPhoneFormatted(formatted)
    // Actualizar el valor del formulario
    e.target.value = formatted
  }

  useEffect(() => {
    fetchRestaurant()
  }, [restaurantSlug])

  const fetchRestaurant = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use mock data
      setRestaurant({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Kansas Belgrano',
        address: 'Av. Santa Fe 3456, C1425 CABA, Argentina',
        slug: restaurantSlug,
      })
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendVerificationCode = async () => {
    if (!phone) return

    try {
      const response = await fetch('/api/verify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      })

      if (response.ok) {
        setShowVerification(true)
      }
    } catch (error) {
      console.error('Error sending verification code:', error)
    }
  }

  const verifyCode = async () => {
    if (!phone || !verificationCode) return

    setVerifying(true)
    try {
      const response = await fetch('/api/verify/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code: verificationCode }),
      })

      if (response.ok) {
        setShowVerification(false)
        setVerificationCode('')
      }
    } catch (error) {
      console.error('Error verifying code:', error)
    } finally {
      setVerifying(false)
    }
  }

  const onSubmit = async (data: JoinWaitlistForm) => {
    setSubmitting(true)
    
    try {
      // Normalize phone number
      const phoneNumber = parsePhoneNumber(data.phone, 'AR')
      const normalizedPhone = phoneNumber.format('E.164')
      
      const response = await fetch('/api/party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          phone: normalizedPhone,
          restaurantId: restaurant?.id,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setSuccess(true)
        setStatusLink(result.statusLink)
      }
    } catch (error) {
      console.error('Error joining waitlist:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurante no encontrado</h1>
            <p className="text-gray-600 mb-4">
              El restaurante que buscas no existe o no está disponible.
            </p>
            <Button onClick={() => router.push('/')}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Te anotaste en la lista!</h1>
            <p className="text-gray-600 mb-4">
              Te notificaremos cuando tu mesa esté lista.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => window.open(statusLink, '_blank')}
                className="w-full"
              >
                Ver mi posición en la fila
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{restaurant.name}</CardTitle>
            <CardDescription>
              Únete a nuestra lista de espera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Tiempo estimado: 15-20 min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>3 personas en la fila</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tu nombre *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Como te gusta que te llamen"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="phone"
                    {...register('phone')}
                    onChange={handlePhoneChange}
                    placeholder="11 1234-5678"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendVerificationCode}
                    disabled={!phone || phone.length < 10}
                    className="whitespace-nowrap"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Verificar
                  </Button>
                </div>
                {phoneFormatted && (
                  <p className="text-xs text-blue-600">
                    📱 Se enviará a: {phoneFormatted}
                  </p>
                )}
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  💡 Solo escribe tu número: 11 1234-5678 o 9 11 1234-5678
                </p>
              </div>

              {showVerification && (
                <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                  <Label htmlFor="verificationCode">Código de verificación</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => {
                        // Solo permitir números y máximo 6 dígitos
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setVerificationCode(value)
                      }}
                      placeholder="123456"
                      maxLength={6}
                      className="text-center text-lg font-mono"
                    />
                    <Button
                      type="button"
                      onClick={verifyCode}
                      disabled={verifying || verificationCode.length !== 6}
                    >
                      {verifying ? 'Verificando...' : 'Confirmar'}
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600">
                    📱 Te enviamos un código por WhatsApp/SMS a {phoneFormatted}
                  </p>
                  <p className="text-xs text-gray-500">
                    💡 El código tiene 6 dígitos y expira en 10 minutos
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="size">¿Cuántas personas? *</Label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant={watch('size') === num ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const sizeInput = document.getElementById('size') as HTMLInputElement
                        if (sizeInput) {
                          sizeInput.value = num.toString()
                          sizeInput.dispatchEvent(new Event('input', { bubbles: true }))
                        }
                      }}
                      className="h-10"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                <Input
                  id="size"
                  type="number"
                  min="1"
                  max="12"
                  {...register('size', { valueAsNumber: true })}
                  className={`hidden ${errors.size ? 'border-red-500' : ''}`}
                />
                {errors.size && (
                  <p className="text-sm text-red-500">{errors.size.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  💡 Selecciona el número de personas que van a comer
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas especiales (opcional)</Label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {['Mesa cerca de la ventana', 'Mesa en el patio', 'Acceso para silla de ruedas', 'Cumpleaños', 'Aniversario', 'Otra'].map((note) => (
                    <Button
                      key={note}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const notesInput = document.getElementById('notes') as HTMLInputElement
                        if (notesInput) {
                          notesInput.value = note
                          notesInput.dispatchEvent(new Event('input', { bubbles: true }))
                        }
                      }}
                      className="h-8 text-xs"
                    >
                      {note}
                    </Button>
                  ))}
                </div>
                <Input
                  id="notes"
                  {...register('notes')}
                  placeholder="Escribe tu nota especial aquí..."
                />
                <p className="text-xs text-gray-500">
                  💡 O escribe tu propia nota especial
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? 'Agregando a la lista...' : 'Unirme a la Lista'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Al unirte, aceptas recibir notificaciones por WhatsApp/SMS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
