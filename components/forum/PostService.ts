// Post creation and webhook service for Koterie Bot integration

export interface NewPost {
  title: string;
  content: string;
  author: string;
  role: string;
  category: string;
  forumType: 'academy' | 'studio';
  tags?: string[];
}

export interface BotComment {
  content: string;
  author: string;
  role: string;
  timestamp: string;
}

export class PostService {
  static async createPost(post: NewPost): Promise<{ success: boolean; postId?: number; botComment?: BotComment }> {
    try {
      // Check if Koterie is mentioned in the post
      const mentioned = post.content.includes('@Koterie') || post.title.includes('@Koterie');
      
      // Call Koterie Bot API
      const botResponse = await fetch('/api/koterie-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postContent: post.content,
          postTitle: post.title,
          author: post.author,
          forumType: post.forumType,
          mentioned
        })
      });

      if (!botResponse.ok) {
        console.error('Failed to get bot response');
        return { success: true }; // Still create post even if bot fails
      }

      const botData = await botResponse.json();
      
      // Simulate post creation (in real app, this would save to database)
      const postId = Math.floor(Math.random() * 10000) + 1000;
      
      return {
        success: true,
        postId,
        botComment: botData.shouldComment ? botData.comment : undefined
      };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false };
    }
  }

  static async triggerBotComment(postId: number, post: NewPost): Promise<BotComment | null> {
    try {
      const response = await fetch('/api/koterie-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postContent: post.content,
          postTitle: post.title,
          author: post.author,
          forumType: post.forumType,
          mentioned: false
        })
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.shouldComment ? data.comment : null;
    } catch (error) {
      console.error('Error triggering bot comment:', error);
      return null;
    }
  }

  // Webhook handler for external post creation systems
  static async handleWebhook(payload: any): Promise<{ success: boolean; botComment?: BotComment }> {
    try {
      const post: NewPost = {
        title: payload.title,
        content: payload.content,
        author: payload.author,
        role: payload.role || 'Student',
        category: payload.category || 'general',
        forumType: payload.forumType || 'academy',
        tags: payload.tags
      };

      return await this.createPost(post);
    } catch (error) {
      console.error('Webhook error:', error);
      return { success: false };
    }
  }
}
