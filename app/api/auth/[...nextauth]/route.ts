// AUTH SYSTEM DESACTIVADO - VERSIÓN LOCAL ABIERTA
// Esta versión es completamente abierta para pruebas sin autenticación

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Auth system desactivado - versión local abierta',
    status: 'public_access'
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Auth system desactivado - versión local abierta',
    status: 'public_access'
  })
}
