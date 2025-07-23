'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createEvent } from '@/lib/storage'

export default function NewEventPage() {
  const router = useRouter()
  const [eventName, setEventName] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [participants, setParticipants] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    setIsSubmitting(true)
    
    try {
      const event = createEvent(
        eventName,
        parseInt(totalAmount),
        participants.filter(p => p.trim())
      )
      router.push(`/events/${event.id}`)
    } catch (error) {
      alert('エラーが発生しました')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const expectedPerPerson = participants.filter(p => p.trim()).length > 0 
    ? Math.ceil(parseInt(totalAmount || '0') / participants.filter(p => p.trim()).length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-8">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <Plus className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                新しいイベント作成
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                <div className="space-y-2">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={participant}
                        onChange={(e) => updateParticipant(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
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
                  {isSubmitting ? '作成中...' : 'イベントを作成'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}