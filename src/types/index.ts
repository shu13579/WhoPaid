export interface Event {
  id: string
  name: string
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  participants: Participant[]
  payments: Payment[]
}

export interface Participant {
  id: string
  name: string
  eventId: string
  payments: Payment[]
}

export interface Payment {
  id: string
  amount: number
  createdAt: Date
  eventId: string
  participantId: string
  participant: Participant
}

export interface CreateEventData {
  name: string
  totalAmount: number
  participantNames: string[]
}

export interface ParticipantWithStatus extends Participant {
  totalPaid: number
  expectedAmount: number
  isPaidInFull: boolean
}