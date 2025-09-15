'use client'

import { useState, useEffect } from 'react'
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
import { parsePhoneNumber } from 'libphonenumber-js'
import { PartyWithDetails } from '@/lib/db/types'

const editPartySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  size: z.number().int().min(1, 'Debe ser al menos 1 persona').max(12, 'Máximo 12 personas'),
  eta_minutes: z.number().int().min(5, 'Mínimo 5 minutos').max(120, 'Máximo 120 minutos'),
  notes: z.string().optional(),
})

type EditPartyForm = z.infer<typeof editPartySchema>

interface EditPartyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditParty: (partyId: string, data: EditPartyForm) => void
  party: PartyWithDetails | null
}

export function EditPartyDialog({ open, onOpenChange, onEditParty, party }: EditPartyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditPartyForm>({
    resolver: zodResolver(editPartySchema),
  })

  // Update form when party changes
  useEffect(() => {
    if (party) {
      setValue('name', party.name)
      setValue('phone', party.phone)
      setValue('size', party.size)
      setValue('eta_minutes', party.eta_minutes)
      setValue('notes', party.notes || '')
    }
  }, [party, setValue])

  const onSubmit = async (data: EditPartyForm) => {
    if (!party) return
    
    setIsSubmitting(true)
    
    try {
      // Validate phone number
      const phoneNumber = parsePhoneNumber(data.phone, 'AR')
      const normalizedPhone = phoneNumber.format('E.164')
      
      await onEditParty(party.id, {
        ...data,
        phone: normalizedPhone,
      })
      
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error editing party:', error)
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  if (!party) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica la información del cliente en la lista de espera
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
              placeholder="+54 9 11 1234-5678"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Cantidad de Personas *</Label>
            <Input
              id="size"
              type="number"
              min="1"
              max="12"
              {...register('size', { valueAsNumber: true })}
              className={errors.size ? 'border-red-500' : ''}
            />
            {errors.size && (
              <p className="text-sm text-red-500">{errors.size.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eta_minutes">Tiempo Estimado de Espera *</Label>
            <select
              id="eta_minutes"
              {...register('eta_minutes', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input
              id="notes"
              {...register('notes')}
              placeholder="Mesa cerca de la ventana, etc."
            />
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
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
