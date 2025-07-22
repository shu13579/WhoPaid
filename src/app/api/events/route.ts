import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateEventData } from '@/types'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEventData = await request.json()
    const { name, totalAmount, participantNames } = body

    if (!name || !totalAmount || !participantNames || participantNames.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        name,
        totalAmount,
        participants: {
          create: participantNames.map(name => ({
            name: name.trim()
          }))
        }
      },
      include: {
        participants: true,
        payments: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}