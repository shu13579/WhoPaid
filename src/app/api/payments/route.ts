import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, participantId, amount } = body

    if (!eventId || !participantId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid amount' },
        { status: 400 }
      )
    }

    const payment = await prisma.payment.create({
      data: {
        eventId,
        participantId,
        amount: parseInt(amount)
      },
      include: {
        participant: true
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Failed to create payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}