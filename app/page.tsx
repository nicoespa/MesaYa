'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/LoginForm'
import { 
  Building2, 
  Users, 
  QrCode, 
  BarChart3, 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  Shield, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react'

const BENEFITS = [
  {
    icon: MessageCircle,
    title: "Notificaciones Automáticas",
    description: "Envía SMS y WhatsApp automáticamente cuando la mesa esté lista. Sin intervención manual.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: QrCode,
    title: "Códigos QR Inteligentes",
    description: "Los clientes se unen a la fila escaneando un código QR. Registro instantáneo y sin contacto.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Analytics en Tiempo Real",
    description: "Métricas detalladas: tiempo de espera promedio, ocupación, clientes satisfechos y más.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Clock,
    title: "Gestión de Tiempos",
    description: "Calcula automáticamente tiempos de espera basados en tu capacidad y flujo de clientes.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Users,
    title: "Lista de Espera Digital",
    description: "Gestiona tu fila desde cualquier dispositivo. Actualizaciones en tiempo real para todo tu equipo.",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: Shield,
    title: "100% Confiable",
    description: "Sistema robusto que funciona 24/7. Sin interrupciones, sin pérdida de datos.",
    color: "from-gray-500 to-slate-500"
  }
]

const STATS = [
  { number: "500+", label: "Restaurantes Activos" },
  { number: "50K+", label: "Clientes Atendidos" },
  { number: "98%", label: "Satisfacción" },
  { number: "30%", label: "Aumento en Ventas" }
]

const TESTIMONIALS = [
  {
    name: "María González",
    restaurant: "Kansas Belgrano",
    text: "FilaYA revolucionó nuestro servicio. Los clientes están más contentos y nosotros podemos enfocarnos en la cocina.",
    rating: 5
  },
  {
    name: "Carlos Mendoza",
    restaurant: "La Parolaccia",
    text: "El sistema de notificaciones automáticas nos ahorra horas de trabajo diario. Es impresionante.",
    rating: 5
  },
  {
    name: "Ana Rodríguez",
    restaurant: "Don Julio",
    text: "Las métricas nos ayudaron a optimizar nuestros horarios y aumentar la satisfacción del cliente.",
    rating: 5
  }
]

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)

  const handleLoginClick = () => {
    window.location.href = '/login'
  }

  const handleBackToHome = () => {
    setShowLogin(false)
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToHome}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              Volver al inicio
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              FilaYA
            </h1>
            <p className="text-gray-600">
              Accede a tu dashboard de restaurante
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">FilaYA</span>
                <p className="text-xs text-gray-500 -mt-1">Para Restaurantes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Características
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Precios
              </Button>
              <Button
                onClick={handleLoginClick}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              <Zap className="h-4 w-4 mr-2" />
              La solución #1 para restaurantes en Argentina
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Gestiona tu lista de espera
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                como un profesional
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Automatiza notificaciones, optimiza tiempos de espera y aumenta la satisfacción de tus clientes 
              con la plataforma más completa para restaurantes argentinos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={handleLoginClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <Building2 className="h-6 w-6 mr-3" />
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => window.location.href = '/register'}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Building2 className="h-6 w-6 mr-3" />
                Registrar Restaurante
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Todo lo que necesitas para
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                gestionar tu restaurante
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas profesionales diseñadas específicamente para restaurantes argentinos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Lo que dicen nuestros
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                restaurantes
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más de 500 restaurantes ya confían en FilaYA para gestionar sus listas de espera
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-blue-600 font-medium">
                      {testimonial.restaurant}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            ¿Listo para revolucionar tu restaurante?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Únete a cientos de restaurantes que ya aumentaron sus ventas y satisfacción del cliente con FilaYA
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={handleLoginClick}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              <Building2 className="h-6 w-6 mr-3" />
              Comenzar Gratis
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <CheckCircle className="h-6 w-6 mr-3" />
              Sin Compromiso
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Configuración en 5 minutos</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Cancelación gratuita</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <span className="text-2xl font-bold">FilaYA</span>
                <p className="text-sm text-gray-400 -mt-1">Para Restaurantes</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 FilaYA. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
