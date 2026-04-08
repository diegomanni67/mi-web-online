export interface Student {
  id: string;
  nombre: string;
  rango: 'Academy' | 'Studio';
  nivel: string;
  interesesGenerales: string[];
  interesesEspecificos: string[];
  bio: string;
  ubicacion: string;
  fechaIngreso: string;
}

export const mockStudents: Student[] = [
  {
    id: '1',
    nombre: 'Ana Martínez',
    rango: 'Academy',
    nivel: 'B1',
    interesesGenerales: ['Cine', 'Música', 'Viajes'],
    interesesEspecificos: ['Stranger Things', 'Radiohead', 'The Bear', 'Fotografía Analógica'],
    bio: '¡Hola! Soy Ana, me apasiona el cine independiente y la fotografía. Estoy aprendiendo inglés para poder viajar por el mundo sin barreras lingüísticas.',
    ubicacion: 'Buenos Aires',
    fechaIngreso: 'Enero 2024'
  },
  {
    id: '2',
    nombre: 'Carlos Rodríguez',
    rango: 'Studio',
    nivel: 'B2',
    interesesGenerales: ['Gaming', 'Tecnología', 'Deportes'],
    interesesEspecificos: ['Manchester City', 'Star Wars', 'Gaming PC', 'League of Legends'],
    bio: 'Gamer y desarrollador web. Busco mejorar mi inglés para acceder a mejores oportunidades laborales y conectar con la comunidad global de tech.',
    ubicacion: 'Córdoba',
    fechaIngreso: 'Febrero 2024'
  },
  {
    id: '3',
    nombre: 'Lucía Fernández',
    rango: 'Academy',
    nivel: 'A2',
    interesesGenerales: ['Cocina', 'Viajes', 'Arte'],
    interesesEspecificos: ['MasterChef', 'Yoga', 'Pintura al Óleo', 'Cocina Italiana'],
    bio: 'Amante de la buena comida y los viajes. Mi sueño es poder trabajar en hoteles de lujo internacional y necesito dominar el inglés para eso.',
    ubicacion: 'Rosario',
    fechaIngreso: 'Marzo 2024'
  },
  {
    id: '4',
    nombre: 'Diego Silva',
    rango: 'Studio',
    nivel: 'C1',
    interesesGenerales: ['Música', 'Tecnología', 'Cine'],
    interesesEspecificos: ['Radiohead', 'The Bear', 'Producción Musical', 'Guitarra Eléctrica'],
    bio: 'Músico y productor. Quiero colaborar con artistas internacionales y entender mejor las letras de las canciones en inglés.',
    ubicacion: 'Mendoza',
    fechaIngreso: 'Enero 2024'
  },
  {
    id: '5',
    nombre: 'Sofía Torres',
    rango: 'Academy',
    nivel: 'B1',
    interesesGenerales: ['Lectura', 'Cine', 'Arte'],
    interesesEspecificos: ['Stranger Things', 'MasterChef', 'Star Wars', 'Literatura Fantástica'],
    bio: 'Bookworm y aspirante a escritora. Aprendo inglés para leer literatura en su idioma original y someday escribir mis propias historias.',
    ubicacion: 'La Plata',
    fechaIngreso: 'Febrero 2024'
  },
  {
    id: '6',
    nombre: 'Martín Gómez',
    rango: 'Studio',
    nivel: 'B2',
    interesesGenerales: ['Deportes', 'Viajes', 'Gaming'],
    interesesEspecificos: ['Fútbol Argentino', 'Running', 'PlayStation 5', 'Viajes por Sudamérica'],
    bio: 'Deportista fanatic. Me preparo para competencias internacionales y necesito comunicarme en inglés con otros atletas del mundo.',
    ubicacion: 'Mar del Plata',
    fechaIngreso: 'Marzo 2024'
  },
  {
    id: '7',
    nombre: 'Valentina Torres',
    rango: 'Academy',
    nivel: 'A2',
    interesesGenerales: ['Arte', 'Tecnología', 'Fotografía'],
    interesesEspecificos: ['Diseño UX/UI', 'Adobe Photoshop', 'Fotografía de Paisajes', 'Illustrator'],
    bio: 'Artista digital y diseñadora. Busco expandir mi clientela a nivel mundial y el inglés es clave para eso.',
    ubicacion: 'Salta',
    fechaIngreso: 'Enero 2024'
  },
  {
    id: '8',
    nombre: 'Roberto Silva',
    rango: 'Studio',
    nivel: 'C1',
    interesesGenerales: ['Cocina', 'Negocios', 'Viajes'],
    interesesEspecificos: ['Cocina Francesa', 'Vinos Argentinos', 'Restaurant Management', 'Gastronomía Molecular'],
    bio: 'Emprendedor en el mundo food. Quiero llevar mi restaurante al siguiente nivel y necesito inglés para negocios internacionales.',
    ubicacion: 'Misiones',
    fechaIngreso: 'Febrero 2024'
  }
];

// Usuario actual logueado (para testing)
export const currentUser: Student = {
  id: 'current',
  nombre: 'Tu Perfil',
  rango: 'Academy',
  nivel: 'B1',
  interesesGenerales: ['Cine', 'Gaming'],
  interesesEspecificos: ['Stranger Things', 'Radiohead', 'Gaming PC'],
  bio: 'Estoy aprendiendo inglés porque quiero trabajar en el exterior y conocer nuevas culturas. Me encanta el cine independiente y la música de los 90s.',
  ubicacion: 'Buenos Aires',
  fechaIngreso: 'Marzo 2024'
};

// Función para obtener un alumno por ID
export const getStudentById = (id: string): Student | undefined => {
  if (String(id) === 'current') return currentUser;
  return mockStudents.find(student => String(student.id) === String(id));
};

// Función para obtener todos los alumnos excepto el actual
export const getOtherStudents = (): Student[] => {
  return mockStudents;
};

// Intereses del usuario actual para filtros
export const getCurrentUserInterests = (): string[] => {
  return [...currentUser.interesesGenerales, ...currentUser.interesesEspecificos];
};
