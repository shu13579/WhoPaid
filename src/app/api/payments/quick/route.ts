import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, participantId } = body

    if (!eventId || !participantId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // イベントと参加者の情報を取得
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // 一人当たりの金額を計算（切り上げ）
    const expectedPerPerson = Math.ceil(event.totalAmount / event.participants.length)

    // 既に支払った金額を取得
    const existingPayments = await prisma.payment.findMany({
      where: {
        eventId,
        participantId
      }
    })

    const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const remainingAmount = expectedPerPerson - totalPaid

    if (remainingAmount <= 0) {
      return NextResponse.json(
        { error: 'Already paid in full' },
        { status: 400 }
      )
    }

    // 残り金額を支払いとして記録
    const payment = await prisma.payment.create({
      data: {
        eventId,
        participantId,
        amount: remainingAmount
      },
      include: {
        participant: true
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Failed to create quick payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}