'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Download, Copy } from 'lucide-react'

interface QRCodeGeneratorProps {
  restaurantSlug: string
  restaurantName: string
}

export function QRCodeGenerator({ restaurantSlug, restaurantName }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [joinUrl, setJoinUrl] = useState<string>('')

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/join/${restaurantSlug}`
    setJoinUrl(url)
    generateQRCode(url)
  }, [restaurantSlug])

  const generateQRCode = async (text: string) => {
    try {
      // Dynamic import for QR code generation
      const QRCode = (await import('qrcode')).default
      const dataUrl = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      setQrCodeDataUrl(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a')
      link.download = `qrcode-${restaurantSlug}.png`
      link.href = qrCodeDataUrl
      link.click()
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      // You could add a toast notification here
    } catch (error) {
      console.error('Error copying URL:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>Código QR</span>
        </CardTitle>
        <CardDescription>
          Para que los clientes se unan a la lista
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {qrCodeDataUrl ? (
            <div className="inline-block p-4 bg-white rounded-lg border">
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <QrCode className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Generando QR...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            URL de registro:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={joinUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-gray-50"
            />
            <Button size="sm" variant="outline" onClick={copyUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={downloadQRCode}
            disabled={!qrCodeDataUrl}
            className="flex-1"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar QR
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          <p>Los clientes pueden escanear este código</p>
          <p>para unirse a la lista de espera</p>
        </div>
      </CardContent>
    </Card>
  )
}
