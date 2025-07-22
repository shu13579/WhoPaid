'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, Yen, Plus, Check, X, ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Event, ParticipantWithStatus } from '@/types'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [participantsWithStatus, setParticipantsWithStatus] = useState<ParticipantWithStatus[]>([])
  const [selectedParticipant, setSelectedParticipant] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (response.ok) {
        const eventData: Event = await response.json()
        setEvent(eventData)
        
        const expectedPerPerson = Math.ceil(eventData.totalAmount / eventData.participants.length)
        const participantsWithStatusData = eventData.participants.map(participant => {
          const totalPaid = participant.payments.reduce((sum, payment) => sum + payment.amount, 0)
          return {
            ...participant,
            totalPaid,
            expectedAmount: expectedPerPerson,
            isPaidInFull: totalPaid >= expectedPerPerson
          }
        })
        setParticipantsWithStatus(participantsWithStatusData)
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedParticipant || !paymentAmount || parseInt(paymentAmount) <= 0) {
      alert('参加者と金額を正しく入力してください')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          participantId: selectedParticipant,
          amount: parseInt(paymentAmount)
        }),
      })

      if (response.ok) {
        setSelectedParticipant('')
        setPaymentAmount('')
        fetchEvent() // データを再取得
      } else {
        throw new Error('支払いの記録に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm('この支払い記録を削除しますか？')) return

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchEvent() // データを再取得
      } else {
        throw new Error('支払い記録の削除に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">イベントが見つかりません</h1>
          <Link href="/events" className="text-emerald-600 hover:text-emerald-700">
            イベント一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  const totalPaid = event.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const remainingAmount = event.totalAmount - totalPaid
  const expectedPerPerson = Math.ceil(event.totalAmount / event.participants.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            イベント一覧に戻る
          </Link>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.name}</h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(new Date(event.createdAt))}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Yen className="w-5 h-5 mr-2" />
                <span>総額 {formatCurrency(event.totalAmount)}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span>{event.participants.length}人参加</span>
              </div>
              
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  remainingAmount === 0 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {remainingAmount === 0 ? '支払い完了' : `残り${formatCurrency(remainingAmount)}`}
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              一人あたりの予想金額: {formatCurrency(expectedPerPerson)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 参加者リスト */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">参加者一覧</h2>
            
            <div className="space-y-3">
              {participantsWithStatus.map((participant) => (
                <div
                  key={participant.id}
                  className={`p-4 rounded-lg border-2 ${
                    participant.isPaidInFull
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {participant.isPaidInFull ? (
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mr-2" />
                      )}
                      <span className="font-medium text-gray-800">
                        {participant.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        participant.isPaidInFull ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {formatCurrency(participant.totalPaid)} / {formatCurrency(participant.expectedAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {participant.payments.length}件の支払い
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 支払い記録フォーム */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">支払いを記録</h2>
              
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <label htmlFor="participant" className="block text-sm font-medium text-gray-700 mb-2">
                    支払った人
                  </label>
                  <select
                    id="participant"
                    value={selectedParticipant}
                    onChange={(e) => setSelectedParticipant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">選択してください</option>
                    {event.participants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    支払い金額
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="3000"
                    min="1"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {submitting ? '記録中...' : '支払いを記録'}
                </Button>
              </form>
            </div>

            {/* 支払い履歴 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">支払い履歴</h2>
              
              {event.payments.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  まだ支払い記録がありません
                </div>
              ) : (
                <div className="space-y-3">
                  {event.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-800">
                          {payment.participant.name}
                        </span>
                        <div className="text-sm text-gray-500">
                          {formatDate(new Date(payment.createdAt))}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-emerald-600 mr-2">
                          {formatCurrency(payment.amount)}
                        </span>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}