import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Mercado Pago webhook received:', body)

    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: paymentId })

      console.log('Payment data:', paymentData)

      if (paymentData.status === 'approved') {
        const userEmail = paymentData.payer?.email
        
        if (userEmail) {
          console.log(`Payment approved for user: ${userEmail}`)
          
          // Actualizar el estado de pago del usuario
          try {
            const updateResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/users/update-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: userEmail,
                hasPaid: true
              })
            })
            
            if (updateResponse.ok) {
              console.log(`Successfully updated payment status for ${userEmail}`)
            } else {
              console.error(`Failed to update payment status for ${userEmail}`)
            }
          } catch (updateError) {
            console.error('Error updating user payment status:', updateError)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}
