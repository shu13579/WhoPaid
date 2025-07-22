'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, X, Users, DollarSign, ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Event } from '@/types'

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [eventName, setEventName] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [participants, setParticipants] = useState<string[]>([''])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (response.ok) {
          const eventData: Event = await response.json()
          setEvent(eventData)
          setEventName(eventData.name)
          setTotalAmount(eventData.totalAmount.toString())
          setParticipants(eventData.participants.map(p => p.name))
        } else {
          throw new Error('イベントが見つかりません')
        }
      } catch (error) {
        console.error('Failed to fetch event:', error)
        alert('イベントの読み込みに失敗しました')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId, router])

  const addParticipant = () => {
    setParticipants([...participants, ''])
  }

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const updateParticipant = (index: number, value: string) => {
    const updated = [...participants]
    updated[index] = value
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventName || !totalAmount || participants.some(p => !p.trim())) {
      alert('すべての項目を入力してください')
      return
    }

    const hasPayments = event?.payments && event.payments.length > 0
    if (hasPayments) {
      const confirmUpdate = confirm(
        'このイベントには既に支払い記録があります。\n参加者を変更すると、既存の支払い記録はすべて削除されます。\n続行しますか？'
      )
      if (!confirmUpdate) return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: eventName,
          totalAmount: parseInt(totalAmount),
          participantNames: participants.filter(p => p.trim())
        }),
      })

      if (response.ok) {
        router.push(`/events/${eventId}`)
      } else {
        throw new Error('イベントの更新に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
      console.error(error)
    } finally {
      setIsSubmitting(false)
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
          <Link href="/" className="text-emerald-600 hover:text-emerald-700">
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  const expectedPerPerson = participants.filter(p => p.trim()).length > 0 
    ? Math.ceil(parseInt(totalAmount || '0') / participants.filter(p => p.trim()).length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            イベントに戻る
          </Link>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-8">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                イベントを編集
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                  イベント名
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: 忘年会、新年会、歓送迎会"
                  required
                />
              </div>

              <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  総額（円）
                </label>
                <input
                  type="number"
                  id="totalAmount"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12000"
                  min="0"
                  required
                />
                {totalAmount && participants.filter(p => p.trim()).length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    一人あたり約 {expectedPerPerson.toLocaleString()} 円
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  参加者
                </label>
                {event.payments && event.payments.length > 0 && (
                  <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      ⚠️ 参加者を変更すると、既存の支払い記録がすべて削除されます。
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={participant}
                        onChange={(e) => updateParticipant(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`参加者 ${index + 1}`}
                        required
                      />
                      {participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  参加者を追加
                </button>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? '更新中...' : 'イベントを更新'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}