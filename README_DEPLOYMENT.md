# Pasos de Despliegue para Koterie

## 1. Crear Base de Datos Supabase
- Registrarse en [supabase.com](https://supabase.com)
- Crear nuevo proyecto
- Copiar: Project URL, anon key, service_role key
- Ejecutar `supabase/schema.sql` en SQL Editor

## 2. Configurar Google Auth
- Ir a [console.cloud.google.com](https://console.cloud.google.com)
- Crear OAuth 2.0 Client ID
- Redirect URI: `https://koterie.vercel.app/api/auth/callback/google`
- Copiar Client ID y Client Secret

## 3. Configurar Variables en Vercel
```
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
NEXTAUTH_SECRET=emFtx8R8VcrNYUK3Aq8M7FgoembLvg4a2h0CjO2SyBY=
NEXTAUTH_URL=https://koterie.vercel.app
NEXT_PUBLIC_SUPABASE_URL=tu-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

## 4. Migrar Datos
- Desplegar aplicación en Vercel
- Abrir aplicación en producción
- En consola del navegador: ejecutar `migrateToSupabase()`

## 5. Verificar Funcionalidad
- Login Google y credenciales
- Crear/respondir hilos
- Agregar materiales
- Dashboard funciona

## 6. Soporte
- Verificar `DEPLOYMENT_GUIDE.md` para detalles completos
- Revisar logs en Vercel y Supabase si hay errores
