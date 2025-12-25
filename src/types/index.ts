import { UserRole, BookingStatus, LessonType, PaymentStatus, NotificationType } from '@prisma/client'

export type { UserRole, BookingStatus, LessonType, PaymentStatus, NotificationType }

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  avatar?: string | null
  role: UserRole
  isActive: boolean
  createdAt: Date
}

export interface Instrument {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  isActive: boolean
}

export interface Lesson {
  id: string
  title: string
  description?: string | null
  instrumentId: string
  lessonType: LessonType
  duration: number
  price: number
  maxStudents: number
  isActive: boolean
  instrument?: Instrument
}

export interface TimeSlot {
  id: string
  lessonId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
  lesson?: Lesson
}

export interface Booking {
  id: string
  userId: string
  lessonId: string
  instrumentId: string
  timeSlotId?: string | null
  scheduledDate: Date
  startTime: string
  endTime: string
  status: BookingStatus
  notes?: string | null
  adminNotes?: string | null
  createdAt: Date
  user?: User
  lesson?: Lesson
  instrument?: Instrument
  payment?: Payment
}

export interface Payment {
  id: string
  userId: string
  bookingId: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod?: string | null
  transactionId?: string | null
  paidAt?: Date | null
  createdAt: Date
}

export interface ClassRecording {
  id: string
  title: string
  description?: string | null
  youtubeUrl: string
  thumbnailUrl?: string | null
  instrumentId?: string | null
  duration?: string | null
  recordedAt: Date
  isPublic: boolean
  instrument?: Instrument
  sharedWith?: SharedRecording[]
}

export interface SharedRecording {
  id: string
  recordingId: string
  userId: string
  sharedAt: Date
  viewedAt?: Date | null
  message?: string | null
  recording?: ClassRecording
  user?: User
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  metadata?: any
  createdAt: Date
}

export interface ProgressNote {
  id: string
  studentId: string
  instructorId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  student?: User
  instructor?: User
}

export interface StudioSettings {
  id: string
  businessName: string
  businessEmail?: string | null
  businessPhone?: string | null
  businessAddress?: string | null
  openingTime: string
  closingTime: string
  workingDays: number[]
  bookingNoticeHours: number
  cancellationHours: number
  currency: string
  reminderHoursBefore: number
}

export interface Testimonial {
  id: string
  studentName: string
  content: string
  rating: number
  avatar?: string | null
  isActive: boolean
  createdAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImage?: string | null
  isPublished: boolean
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  isRead: boolean
  repliedAt?: Date | null
  createdAt: Date
}

export interface DashboardStats {
  totalStudents: number
  totalBookings: number
  totalRevenue: number
  upcomingLessons: number
  completedLessons: number
  cancelledLessons: number
  newStudentsThisMonth: number
  revenueThisMonth: number
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  status: BookingStatus
  studentName?: string
  instrument?: string
  color?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
