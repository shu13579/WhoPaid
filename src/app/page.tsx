import Link from 'next/link'
import { Plus, Users, CreditCard, Calendar, DollarSign } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function Home() {
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
    },
    take: 5
  })
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Party Payment Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            飲み会の支払い管理アプリ
          </p>
          <p className="text-gray-500">
            誰からお金を預かったかを簡単に記録・管理
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* 新しいイベント作成ボタン */}
          <div className="mb-8">
            <Link
              href="/events/new"
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-emerald-500 group block"
            >
              <div className="flex items-center">
                <div className="bg-emerald-100 p-3 rounded-full mr-4 group-hover:bg-emerald-200 transition-colors">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    新しいイベント
                  </h2>
                  <p className="text-gray-600 text-sm">
                    飲み会の支払い管理を開始
                  </p>
                </div>
                <svg className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          {/* 最近のイベント */}
          {events.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">最近のイベント</h2>
              <div className="space-y-4">
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
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-blue-500 group block"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {event.name}
                          </h3>
                          
                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(new Date(event.createdAt))}
                            </div>
                            
                            <div className="flex items-center text-gray-600 text-sm">
                              <DollarSign className="w-4 h-4 mr-2" />
                              {formatCurrency(event.totalAmount)}
                            </div>
                            
                            <div className="flex items-center text-gray-600 text-sm">
                              <Users className="w-4 h-4 mr-2" />
                              {event.participants.length}人参加
                            </div>
                            
                            <div className="flex items-center">
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                remainingAmount === 0 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {remainingAmount === 0 ? '完了' : `${paidParticipants}/${event.participants.length}人済`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              主な特徴
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  支払い記録
                </h4>
                <p className="text-gray-600 text-sm">
                  誰からお金を預かったかを簡単に記録
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  参加者管理
                </h4>
                <p className="text-gray-600 text-sm">
                  支払い状況を一目で確認
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  シンプル操作
                </h4>
                <p className="text-gray-600 text-sm">
                  直感的で使いやすいインターフェース
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
