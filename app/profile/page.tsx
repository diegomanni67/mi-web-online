"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && !session.user.hasPaid && session.user.email !== 'diegomanni67@gmail.com') {
      router.push('/checkout')
    }
  }, [status, router, session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }
  const [generalInterests, setGeneralInterests] = useState(['Cine', 'Gaming']);
  const [customTags, setCustomTags] = useState(['Stranger Things', 'Radiohead']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [bio, setBio] = useState('Estoy aprendiendo inglés porque quiero trabajar en el exterior y conocer nuevas culturas. Me encanta el cine independiente y la música de los 90s.');
  const [connectionStatus, setConnectionStatus] = useState<{[key: string]: boolean}>({});
  const [newMessage, setNewMessage] = useState('');
  const [animatingTag, setAnimatingTag] = useState<string | null>(null);
  
  const availableGeneralInterests = ['Cine', 'Gaming', 'Cripto', 'Música', 'Viajes', 'Cocina', 'Deportes', 'Tecnología'];
  
  // Base de datos simulada de alumnos
  const allStudents = [
    { 
      id: '1', 
      name: 'Ana Martínez', 
      generalInterests: ['Cine', 'Viajes', 'Música'], 
      customTags: ['Stranger Things', 'Radiohead', 'The Bear'],
    },
    { 
      id: '2', 
      name: 'Carlos Rodríguez', 
      generalInterests: ['Gaming', 'Tecnología', 'Cripto'], 
      customTags: ['Manchester City', 'Star Wars', 'The Bear'],
    },
    { 
      id: '3', 
      name: 'Lucía Fernández', 
      generalInterests: ['Cocina', 'Viajes', 'Deportes'], 
      customTags: ['MasterChef', 'Yoga', 'Stranger Things'],
    },
    { 
      id: '4', 
      name: 'Diego Silva', 
      generalInterests: ['Música', 'Deportes', 'Tecnología'], 
      customTags: ['Radiohead', 'The Bear', 'Gaming'],
    },
    { 
      id: '5', 
      name: 'Sofía Torres', 
      generalInterests: ['Cine', 'Arte', 'Viajes'], 
      customTags: ['Stranger Things', 'MasterChef', 'Star Wars'],
    }
  ];

  // Algoritmo de matches reales basado en intereses específicos
  const getMatchingStudents = () => {
    return allStudents
      .map(student => {
        const exactMatches = customTags.filter(tag => student.customTags.includes(tag));
        const generalMatches = generalInterests.filter(interest => student.generalInterests.includes(interest));
        const sharedCount = exactMatches.length + generalMatches.length;
        
        return {
          ...student,
          exactMatches,
          generalMatches,
          sharedCount,
          hasSpecificMatch: exactMatches.length > 0
        };
      })
      .filter(student => student.sharedCount > 0)
      .sort((a, b) => {
        // Priorizar matches específicos
        if (a.hasSpecificMatch && !b.hasSpecificMatch) return -1;
        if (!a.hasSpecificMatch && b.hasSpecificMatch) return 1;
        // Luego por cantidad total de matches
        return b.sharedCount - a.sharedCount;
      })
      .slice(0, 3);
  };

  const matchingStudents = getMatchingStudents();

  const [chatMessages, setChatMessages] = useState([
    { sender: 'system', text: '¡Bienvenido a la logia de Koterie! Completá tus intereses para que otros miembros puedan encontrarte.', time: '10:00' },
    { sender: 'teacher', text: '¡Hola! Bienvenido a Koterie. ¿Cuándo te queda bien hacer la nivelación?', time: '10:01' },
    { sender: 'student', text: 'Hola, ¡muchas gracias! Mañana por la tarde puedo.', time: '10:02' },
    { sender: 'teacher', text: 'Perfecto, agendado para las 18:00hs.', time: '10:03' }
  ]);

  const handleGeneralInterestToggle = (interest: string) => {
    setGeneralInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleCustomTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    
    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();
      const newTag = value.replace(',', '').trim();
      
      if (!customTags.includes(newTag) && newTag.length > 0) {
        // Animación explosiva
        setAnimatingTag(newTag);
        setTimeout(() => setAnimatingTag(null), 300);
        
        setCustomTags(prev => [...prev, newTag]);
      }
      setCustomTagInput('');
    }
  };

  const removeCustomTag = (tagToRemove: string) => {
    setCustomTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleConnect = (studentId: string) => {
    setConnectionStatus(prev => ({ ...prev, [studentId]: true }));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        sender: 'student' as const,
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Simular respuesta del profesor
      setTimeout(() => {
        const teacherResponse = {
          sender: 'teacher' as const,
          text: 'Gracias por tu mensaje. Te responderé pronto.',
          time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, teacherResponse]);
      }, 1000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
            </div>
            <div className="text-sm text-gray-500">Espacio exclusivo de la Koterie</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sección de Identidad (Izquierda) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tarjeta de Usuario */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Mi Perfil</h2>
                <p className="text-gray-500 text-sm">Alumno de Koterie</p>
                
                {/* Admin Badge */}
                {session.user.email === 'diegomanni67@gmail.com' && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Modo Administrador / Acceso Total
                  </div>
                )}
              </div>
            </div>

            {/* Selector de Intereses */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Mis Intereses</h3>
              
              {/* Intereses Generales */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Categorías generales:</p>
                <div className="flex flex-wrap gap-2">
                  {availableGeneralInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => handleGeneralInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                        generalInterests.includes(interest)
                          ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white border-purple-700 shadow-md'
                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Personalizados */}
              <div>
                <p className="text-sm text-gray-500 mb-3">Intereses específicos:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {customTags.map(tag => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-orange-500 to-pink-500 text-white border-2 border-orange-400 shadow-sm transition-all duration-300 ${
                        animatingTag === tag ? 'scale-125 shadow-lg' : 'scale-100'
                      }`}
                    >
                      {tag}
                      <button
                        onClick={() => removeCustomTag(tag)}
                        className="ml-1 text-white hover:text-orange-200 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleCustomTagInput}
                  placeholder="Escribe intereses específicos (ej: Stranger Things, Radiohead)..."
                  className="w-full px-4 py-2 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
                <p className="text-xs text-gray-400 mt-1">Presiona Enter o coma para agregar un tag</p>
              </div>
            </div>

            {/* Bio Expandible */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Sobre mí</h3>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Contanos más sobre vos, tus objetivos con el inglés o lo que quieras compartir..."
                className="w-full p-3 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Sección de Interacción (Derecha/Centro) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Interno con el Profe */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 text-white">
                <h3 className="font-bold">Chat con el Profesor</h3>
                <p className="text-sm opacity-90">Comunicación directa con tu instructor</p>
              </div>
              
              <div className="h-96 p-4 flex flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        message.sender === 'student'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-br-sm'
                          : message.sender === 'system'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl border border-blue-400'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'student' ? 'text-purple-200' : 
                          message.sender === 'system' ? 'text-blue-100' : 
                          'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 p-3 rounded-2xl border border-gray-300 bg-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" 
                    placeholder="Escribile al profe..." 
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 rounded-2xl font-medium hover:shadow-md transition-all duration-200"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>

            {/* Widget de Próxima Clase */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-3xl text-white">
              <h3 className="font-bold text-lg mb-4">Próxima Clase</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <span className="text-lg font-bold">Mar</span>
                    </div>
                    <div>
                      <p className="font-medium">Martes 19:00hs</p>
                      <p className="text-sm opacity-90">Prof. Sarah Mitchell</p>
                    </div>
                  </div>
                  <p className="text-sm opacity-80">Academy B1 - Nivelación Inicial</p>
                </div>
                <button className="bg-white/20 backdrop-blur px-6 py-3 rounded-2xl font-medium hover:bg-white/30 transition-colors">
                  Unirse
                </button>
              </div>
            </div>

            {/* Módulo Social - Alumnos con Gustos Similares */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Alumnos con gustos similares</h3>
              <div className="space-y-3">
                {matchingStudents.map(student => (
                  <div key={student.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                    student.hasSpecificMatch 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' 
                      : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{student.name.charAt(0)}</span>
                        </div>
                        {student.hasSpecificMatch && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-xs font-bold">{'\ud83d\udd25'}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{student.name}</p>
                          {student.hasSpecificMatch && (
                            <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                              <span>{'\u2728'}</span>
                              Match específico
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {student.sharedCount} intereses en común
                          {student.exactMatches.length > 0 && (
                            <span className="text-orange-600 font-medium">
                              {' '}({student.exactMatches.length} específicos: {student.exactMatches.join(', ')})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(student.id)}
                      disabled={connectionStatus[student.id]}
                      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                        connectionStatus[student.id]
                          ? 'bg-green-500 text-white flex items-center gap-2'
                          : 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:shadow-md'
                      }`}
                    >
                      {connectionStatus[student.id] ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Conectado
                        </>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
