import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, hasPaid } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Aquí deberías actualizar tu base de datos real
    // Por ahora, simulamos la actualización
    
    console.log(`Updating payment status for ${email}: hasPaid = ${hasPaid}`)

    // Si estás usando una base de datos real, aquí harías la actualización:
    // await db.user.update({ where: { email }, data: { hasPaid } })

    return NextResponse.json({ 
      success: true, 
      message: 'Payment status updated successfully' 
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
