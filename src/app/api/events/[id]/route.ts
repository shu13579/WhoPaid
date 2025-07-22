import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.id
      },
      include: {
        participants: {
          include: {
            payments: true
          }
        },
        payments: {
          include: {
            participant: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, totalAmount, participantNames } = body

    if (!name || !totalAmount || !participantNames || participantNames.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 既存の参加者を取得
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
      include: { participants: true }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // トランザクション内で更新処理
    const updatedEvent = await prisma.$transaction(async (tx) => {
      // イベント情報を更新
      const event = await tx.event.update({
        where: { id: params.id },
        data: {
          name,
          totalAmount
        }
      })

      // 既存の参加者を削除（支払い記録も自動削除される）
      await tx.participant.deleteMany({
        where: { eventId: params.id }
      })

      // 新しい参加者を作成
      await tx.participant.createMany({
        data: participantNames.map((name: string) => ({
          name: name.trim(),
          eventId: params.id
        }))
      })

      // 更新されたイベントを取得
      return await tx.event.findUnique({
        where: { id: params.id },
        include: {
          participants: {
            include: {
              payments: true
            }
          },
          payments: {
            include: {
              participant: true
            }
          }
        }
      })
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}