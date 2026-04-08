import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Corrección 1: Usar MP_ACCESS_TOKEN en lugar de MERCADOPAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando creación de preferencia de pago...')
    
    const body = await request.json()
    console.log('📥 Datos recibidos:', body)
    
    const { email } = body

    const preference = new Preference(client)

    // Ultra-simple preference object to avoid API errors
    const preferenceData = {
      items: [
        {
          id: 'koterie-membership',
          title: 'Membresía Koterie',
          quantity: 1,
          unit_price: 100000,
          currency_id: 'ARS'
        }
      ],
      payer: {
        email: email || undefined,
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/checkout/success`,
        failure: `${process.env.NEXTAUTH_URL}/checkout/failure`,
        pending: `${process.env.NEXTAUTH_URL}/checkout/pending`,
      },
      external_reference: email || ''
    }

    console.log('📝 Enviando preferencia a Mercado Pago:', JSON.stringify(preferenceData, null, 2))
    
    const result = await preference.create({ body: preferenceData })
    
    // Corrección 4: Logs detallados para depuración
    console.log('✅ Preferencia creada exitosamente:', {
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    })

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    })
  } catch (error) {
    // Emergency logging for debugging
    console.log('MERCADOPAGO API ERROR:', error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('❌ Error creando preferencia de Mercado Pago:', {
      message: errorMessage,
      stack: errorStack,
      fullError: error
    })
    
    return NextResponse.json(
      { 
        error: 'Error creating payment preference',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}
