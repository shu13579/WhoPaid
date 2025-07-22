import Link from 'next/link'
import { Plus, Users, CreditCard } from 'lucide-react'

export default function Home() {
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

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link
              href="/events/new"
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-8 border-l-4 border-emerald-500 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full mr-4 group-hover:bg-emerald-200 transition-colors">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  新しいイベント
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                飲み会やイベントの支払い管理を開始
              </p>
              <div className="flex items-center text-emerald-600 group-hover:text-emerald-700">
                <span className="text-sm font-medium">作成する</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/events"
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-8 border-l-4 border-blue-500 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  イベント一覧
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                過去のイベントや進行中の管理を確認
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">確認する</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

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
