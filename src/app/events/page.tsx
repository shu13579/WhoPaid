import Link from 'next/link'
import { Calendar, Users, DollarSign, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      participants: {
        include: {
          payments: true
        }
      },
      payments: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">イベント一覧</h1>
          <Link
            href="/events/new"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            新しいイベント
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              イベントがありません
            </h3>
            <p className="text-gray-600 mb-6">
              最初のイベントを作成して支払い管理を始めましょう
            </p>
            <Link
              href="/events/new"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              イベントを作成
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => {
              const totalPaid = event.payments.reduce((sum, payment) => sum + payment.amount, 0)
              const remainingAmount = event.totalAmount - totalPaid
              const paidParticipants = event.participants.filter(p => 
                p.payments.reduce((sum, payment) => sum + payment.amount, 0) > 0
              ).length
              
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-emerald-500 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                        {event.name}
                      </h2>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {formatDate(new Date(event.createdAt))}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            総額 {formatCurrency(event.totalAmount)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {event.participants.length}人参加
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            remainingAmount === 0 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {remainingAmount === 0 ? '支払い完了' : `残り${formatCurrency(remainingAmount)}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          支払い済み: {paidParticipants}/{event.participants.length}人
                        </div>
                        <div className="flex items-center text-emerald-600 group-hover:text-emerald-700">
                          <span className="text-sm font-medium">詳細を見る</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}