'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

const addPartySchema = z.object({
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
  eta_minutes: z.number().int().min(5, 'Mínimo 5 minutos').max(120, 'Máximo 120 minutos'),
  notes: z.string().optional(),
})

type AddPartyForm = z.infer<typeof addPartySchema>

interface AddPartyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddParty: (data: AddPartyForm) => void
}

export function AddPartyDialog({ open, onOpenChange, onAddParty }: AddPartyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneFormatted, setPhoneFormatted] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AddPartyForm>({
    resolver: zodResolver(addPartySchema),
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

  const onSubmit = async (data: AddPartyForm) => {
    setIsSubmitting(true)
    
    try {
      // Validate phone number
      const phoneNumber = parsePhoneNumber(data.phone, 'AR')
      const normalizedPhone = phoneNumber.format('E.164')
      
      await onAddParty({
        ...data,
        phone: normalizedPhone,
      })
      
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error adding party:', error)
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar a la Lista</DialogTitle>
          <DialogDescription>
            Agrega una nueva persona o grupo a la lista de espera
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nombre del cliente"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              {...register('phone')}
              onChange={handlePhoneChange}
              placeholder="11 1234-5678"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {phoneFormatted && (
              <p className="text-xs text-blue-600">
                📱 Se guardará como: {phoneFormatted}
              </p>
            )}
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
            <p className="text-xs text-gray-500">
              💡 Solo escribe tu número: 11 1234-5678 o 9 11 1234-5678
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Cantidad de Personas *</Label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setValue('size', num, { shouldValidate: true })
                  }}
                  className={`h-10 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    watch('size') === num 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {num}
                </button>
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
            <Label htmlFor="eta_minutes">Tiempo Estimado de Espera *</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 5, label: '5 min' },
                { value: 10, label: '10 min' },
                { value: 15, label: '15 min' },
                { value: 20, label: '20 min' },
                { value: 30, label: '30 min' },
                { value: 45, label: '45 min' },
                { value: 60, label: '1 hora' },
                { value: 90, label: '1.5h' },
                { value: 120, label: '2 horas' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setValue('eta_minutes', option.value, { shouldValidate: true })
                  }}
                  className={`h-10 px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
                    watch('eta_minutes') === option.value 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <select
              id="eta_minutes"
              {...register('eta_minutes', { valueAsNumber: true })}
              className="hidden"
            >
              <option value={5}>5 minutos</option>
              <option value={10}>10 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={20}>20 minutos</option>
              <option value={25}>25 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>1 hora</option>
              <option value={90}>1.5 horas</option>
              <option value={120}>2 horas</option>
            </select>
            {errors.eta_minutes && (
              <p className="text-sm text-red-500">{errors.eta_minutes.message}</p>
            )}
            <p className="text-xs text-gray-500">
              💡 Selecciona el tiempo estimado de espera
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {['Mesa cerca de la ventana', 'Mesa en el patio', 'Acceso para silla de ruedas', 'Cumpleaños', 'Aniversario', 'Otra'].map((note) => (
                <button
                  key={note}
                  type="button"
                  onClick={() => {
                    setValue('notes', note, { shouldValidate: true })
                  }}
                  className="h-8 px-3 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {note}
                </button>
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
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Agregando...' : 'Agregar a la Lista'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
