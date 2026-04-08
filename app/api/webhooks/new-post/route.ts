import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/components/forum/PostService';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature (in production, add proper verification)
    const signature = req.headers.get('x-webhook-signature');
    
    const payload = await req.json();
    
    // Validate required fields
    if (!payload.title || !payload.content || !payload.author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, author' },
        { status: 400 }
      );
    }

    const result = await PostService.handleWebhook(payload);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post processed successfully',
      botComment: result.botComment
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    service: 'new-post-webhook',
    timestamp: new Date().toISOString()
  });
}
