// Script para migrar datos de localStorage a Supabase
// Ejecutar en la consola del navegador después de configurar Supabase

async function migrateToSupabase() {
  console.log('Iniciando migración de datos a Supabase...')
  
  try {
    // Importar las funciones necesarias
    const { forumStorage } = await import('../lib/forum-storage')
    const { databaseStorage } = await import('../lib/database-storage')
    
    // Migrar threads
    const threads = forumStorage.getThreads()
    console.log(`Encontrados ${threads.length} hilos para migrar`)
    
    for (const thread of threads) {
      try {
        await databaseStorage.saveThread({
          title: thread.title,
          content: thread.content,
          author: thread.author,
          authorEmail: thread.authorEmail,
          authorRole: thread.authorRole,
          category: thread.category,
          tags: thread.tags
        })
        console.log(`Hilo migrado: ${thread.title}`)
      } catch (error) {
        console.error(`Error migrando hilo ${thread.title}:`, error)
      }
    }
    
    // Migrar replies
    for (const thread of threads) {
      const replies = forumStorage.getReplies(thread.id)
      console.log(`Encontradas ${replies.length} respuestas para el hilo ${thread.title}`)
      
      for (const reply of replies) {
        try {
          await databaseStorage.saveReply({
            threadId: reply.threadId,
            content: reply.content,
            author: reply.author,
            authorEmail: reply.authorEmail,
            authorRole: reply.authorRole,
            parentId: reply.parentId
          })
          console.log(`Respuesta migrada de: ${reply.author}`)
        } catch (error) {
          console.error('Error migrando respuesta:', error)
        }
      }
    }
    
    // Migrar material links si existen
    const materialLinksKey = 'material_links'
    const existingLinks = JSON.parse(localStorage.getItem(materialLinksKey) || '[]')
    
    for (const link of existingLinks) {
      try {
        await databaseStorage.addMaterialLink(link.subcategoryId, {
          name: link.name,
          url: link.url,
          addedBy: link.addedBy
        })
        console.log(`Link migrado: ${link.name}`)
      } catch (error) {
        console.error(`Error migrando link ${link.name}:`, error)
      }
    }
    
    console.log('¡Migración completada exitosamente!')
    console.log('Puedes verificar los datos en tu dashboard de Supabase')
    
  } catch (error) {
    console.error('La migración falló:', error)
  }
}

// Hacer la función disponible globalmente
window.migrateToSupabase = migrateToSupabase

console.log('Script de migración cargado. Ejecuta migrateToSupabase() en la consola para iniciar la migración.')
