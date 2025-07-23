// Local storage management for WhoPaid app

export interface Payment {
  id: string
  amount: number
  createdAt: string
  participantId: string
}

export interface Participant {
  id: string
  name: string
  payments: Payment[]
}

export interface Event {
  id: string
  name: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  participants: Participant[]
}

const STORAGE_KEY = 'whopaid_events'

// Get all events from localStorage
export function getEvents(): Event[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load events from localStorage:', error)
    return []
  }
}

// Save all events to localStorage
export function saveEvents(events: Event[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error('Failed to save events to localStorage:', error)
  }
}

// Get a single event by ID
export function getEvent(id: string): Event | null {
  const events = getEvents()
  return events.find(event => event.id === id) || null
}

// Create a new event
export function createEvent(name: string, totalAmount: number, participantNames: string[]): Event {
  const event: Event = {
    id: generateId(),
    name,
    totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participants: participantNames.map(name => ({
      id: generateId(),
      name: name.trim(),
      payments: []
    }))
  }
  
  const events = getEvents()
  events.push(event)
  saveEvents(events)
  
  return event
}

// Update an existing event
export function updateEvent(id: string, updates: { name?: string; totalAmount?: number; participantNames?: string[] }): Event | null {
  const events = getEvents()
  const eventIndex = events.findIndex(event => event.id === id)
  
  if (eventIndex === -1) return null
  
  const event = events[eventIndex]
  
  if (updates.name !== undefined) {
    event.name = updates.name
  }
  
  if (updates.totalAmount !== undefined) {
    event.totalAmount = updates.totalAmount
  }
  
  if (updates.participantNames !== undefined) {
    // Replace participants (payments will be lost)
    event.participants = updates.participantNames.map(name => ({
      id: generateId(),
      name: name.trim(),
      payments: []
    }))
  }
  
  event.updatedAt = new Date().toISOString()
  events[eventIndex] = event
  saveEvents(events)
  
  return event
}

// Delete an event
export function deleteEvent(id: string): boolean {
  const events = getEvents()
  const filteredEvents = events.filter(event => event.id !== id)
  
  if (filteredEvents.length === events.length) return false
  
  saveEvents(filteredEvents)
  return true
}

// Add a payment to a participant
export function addPayment(eventId: string, participantId: string, amount: number): Payment | null {
  const events = getEvents()
  const event = events.find(e => e.id === eventId)
  
  if (!event) return null
  
  const participant = event.participants.find(p => p.id === participantId)
  if (!participant) return null
  
  const payment: Payment = {
    id: generateId(),
    amount,
    createdAt: new Date().toISOString(),
    participantId
  }
  
  participant.payments.push(payment)
  event.updatedAt = new Date().toISOString()
  saveEvents(events)
  
  return payment
}

// Delete a payment
export function deletePayment(eventId: string, participantId: string, paymentId: string): boolean {
  const events = getEvents()
  const event = events.find(e => e.id === eventId)
  
  if (!event) return false
  
  const participant = event.participants.find(p => p.id === participantId)
  if (!participant) return false
  
  const originalLength = participant.payments.length
  participant.payments = participant.payments.filter(p => p.id !== paymentId)
  
  if (participant.payments.length === originalLength) return false
  
  event.updatedAt = new Date().toISOString()
  saveEvents(events)
  return true
}

// Export data as JSON
export function exportData(): string {
  const events = getEvents()
  return JSON.stringify(events, null, 2)
}

// Import data from JSON
export function importData(jsonData: string): boolean {
  try {
    const events = JSON.parse(jsonData) as Event[]
    
    // Validate data structure
    if (!Array.isArray(events)) throw new Error('Invalid data format')
    
    for (const event of events) {
      if (!event.id || !event.name || typeof event.totalAmount !== 'number') {
        throw new Error('Invalid event structure')
      }
    }
    
    saveEvents(events)
    return true
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}