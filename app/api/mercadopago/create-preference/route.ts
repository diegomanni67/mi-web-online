import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar el cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, payer } = body;

    // Validar que se proporcionen los items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Se deben proporcionar items para la compra' },
        { status: 400 }
      );
    }

    // Crear la preferencia de pago
    const preference = {
      items: items.map(item => ({
        id: item.id || 'item-' + Math.random().toString(36).substr(2, 9),
        title: item.title,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        currency_id: 'ARS', // Moneda argentina
      })),
      payer: payer ? {
        email: payer.email,
        name: payer.name,
        surname: payer.surname,
      } : undefined,
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/checkout/success`,
        failure: `${process.env.NEXTAUTH_URL}/checkout/failure`,
        pending: `${process.env.NEXTAUTH_URL}/checkout/pending`,
      },
      auto_return: 'approved',
      binary_mode: true, // Para pagos binarios (aprobado/rechazado)
    };

    const preferenceClient = new Preference(client);
    const response = await preferenceClient.create({ body: preference });
    
    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    });

  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
