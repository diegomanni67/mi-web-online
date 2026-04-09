# Guía de Despliegue para Koterie en Vercel

## 1. Configurar Base de Datos en Supabase

### Pasos:
1. **Crear cuenta en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener credenciales**
   - En tu dashboard de Supabase, ve a Settings > API
   - Copia los siguientes valores:
     - Project URL (NEXT_PUBLIC_SUPABASE_URL)
     - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
     - service_role key (SUPABASE_SERVICE_ROLE_KEY)

3. **Ejecutar el schema SQL**
   - Ve a SQL Editor en tu dashboard de Supabase
   - Copia y pega el contenido de `supabase/schema.sql`
   - Ejecuta el script para crear las tablas

## 2. Configurar Variables de Entorno en Vercel

### Variables requeridas:
```bash
# Google Auth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
NEXTAUTH_SECRET=emFtx8R8VcrNYUK3Aq8M7FgoembLvg4a2h0CjO2SyBY=
NEXTAUTH_URL=https://koterie.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Mercado Pago (opcional)
MERCADOPAGO_ACCESS_TOKEN=tu-token

# Google Gemini (opcional)
GOOGLE_GENERATIVE_AI_API_KEY=tu-api-key
```

### Pasos:
1. **En Vercel Dashboard**
   - Ve a tu proyecto
   - Settings > Environment Variables
   - Agrega todas las variables anteriores

2. **Importante**: Asegúrate de que `NEXTAUTH_URL` apunte a tu dominio de Vercel

## 3. Configurar Google Auth para Producción

### Pasos:
1. **Google Cloud Console**
   - Ve a [console.cloud.google.com](https://console.cloud.google.com)
   - Crea un nuevo proyecto o selecciona uno existente
   - Ve a APIs & Services > Credentials
   - Crea nuevas "OAuth 2.0 Client ID"

2. **Configurar OAuth 2.0**
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://koterie.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (para desarrollo)

3. **Copiar credenciales**
   - Client ID -> GOOGLE_CLIENT_ID
   - Client Secret -> GOOGLE_CLIENT_SECRET

## 4. Migrar Datos Existentes

### Opción A: Usar el script de migración
1. **Después de desplegar en Vercel**
   - Abre tu aplicación en producción
   - Abre la consola del navegador (F12)
   - Pega el contenido de `scripts/migrate-to-supabase.js`
   - Ejecuta `migrateToSupabase()`

### Opción B: Manual (si tienes datos en localStorage)
1. **Exportar datos locales**
   - En tu versión local, abre la aplicación
   - Exporta los datos de localStorage:
     ```javascript
     // En la consola
     const threads = JSON.parse(localStorage.getItem('forum_threads') || '[]')
     const replies = JSON.parse(localStorage.getItem('forum_replies') || '[]')
     const material = JSON.parse(localStorage.getItem('material_links') || '[]')
     
     // Copia estos datos para migrarlos manualmente
     console.log({ threads, replies, material })
     ```

## 5. Verificación Final

### Checklist de funcionalidad:
- [ ] Login con Google funciona
- [ ] Login con credenciales funciona
- [ ] Los usuarios pueden crear hilos
- [ ] Los usuarios pueden responder hilos
- [ ] Los hilos muestran vistas y respuestas correctamente
- [ ] Los materiales se pueden agregar y ver
- [ ] El dashboard funciona correctamente

### Tests recomendados:
1. **Login**
   - Prueba login con Google
   - Prueba login con credenciales (admin@koterie.com / admin123)

2. **Foros**
   - Crea un nuevo hilo
   - Responde a un hilo existente
   - Verifica que los contadores funcionen

3. **Materiales**
   - Agrega un nuevo enlace de material
   - Verifica que aparezca en la lista

## 6. Solución de Problemas Comunes

### Error: "Database connection failed"
- Verifica que las variables de Supabase sean correctas
- Asegúrate de que el schema SQL se ejecutó correctamente

### Error: "Google Auth redirect"
- Verifica que NEXTAUTH_URL sea correcta
- Asegúrate de que el redirect URI en Google Cloud coincida

### Error: "CORS issues"
- Verifica las políticas RLS en Supabase
- Asegúrate de que las URLs permitidas incluyan tu dominio

## 7. Monitoreo

### Recomendaciones:
- Configura Vercel Analytics
- Monitorea los errores en el dashboard de Vercel
- Revisa los logs de Supabase regularmente

## 8. Backup

### Importante:
- Configura backups automáticos en Supabase
- Exporta regularmente los datos críticos
- Mantén una copia de las credenciales segura
