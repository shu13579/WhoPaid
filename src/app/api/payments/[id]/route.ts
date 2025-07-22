import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.payment.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'Payment deleted successfully' })
  } catch (error) {
    console.error('Failed to delete payment:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}