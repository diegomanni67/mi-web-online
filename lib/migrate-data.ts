import { forumStorage } from './forum-storage'
import { databaseStorage } from './database-storage'

// Script para migrar datos de localStorage a Supabase
export async function migrateDataToSupabase() {
  console.log('Starting data migration...')
  
  try {
    // Migrar threads
    const threads = forumStorage.getThreads()
    console.log(`Found ${threads.length} threads to migrate`)
    
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
        console.log(`Migrated thread: ${thread.title}`)
      } catch (error) {
        console.error(`Error migrating thread ${thread.title}:`, error)
      }
    }
    
    // Migrar replies
    for (const thread of threads) {
      const replies = forumStorage.getReplies(thread.id)
      console.log(`Found ${replies.length} replies for thread ${thread.title}`)
      
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
          console.log(`Migrated reply from ${reply.author}`)
        } catch (error) {
          console.error(`Error migrating reply:`, error)
        }
      }
    }
    
    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Función para ejecutar la migración desde el navegador
export function runMigration() {
  if (typeof window !== 'undefined') {
    migrateDataToSupabase()
  }
}
