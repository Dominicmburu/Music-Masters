import { PrismaClient, UserRole, LessonType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🎵 Seeding Musical Masters database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@musicalmasters.com' },
    update: {},
    create: {
      email: 'admin@musicalmasters.com',
      password: adminPassword,
      firstName: 'Musical',
      lastName: 'Masters',
      phone: '+254712345678',
      role: UserRole.ADMIN,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create sample student
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: studentPassword,
      firstName: 'Sarah',
      lastName: 'Chen',
      phone: '+254733456789',
      role: UserRole.STUDENT,
    },
  })
  console.log('✅ Sample student created:', student.email)

  // Create instruments
  const instruments = await Promise.all([
    prisma.instrument.upsert({
      where: { id: 'piano' },
      update: {},
      create: {
        id: 'piano',
        name: 'Piano',
        description: 'Classical and contemporary piano instruction',
        icon: '🎹',
      },
    }),
    prisma.instrument.upsert({
      where: { id: 'guitar' },
      update: {},
      create: {
        id: 'guitar',
        name: 'Guitar',
        description: 'Acoustic and electric guitar lessons',
        icon: '🎸',
      },
    }),
    prisma.instrument.upsert({
      where: { id: 'violin' },
      update: {},
      create: {
        id: 'violin',
        name: 'Violin',
        description: 'Classical violin and fiddle training',
        icon: '🎻',
      },
    }),
    prisma.instrument.upsert({
      where: { id: 'drums' },
      update: {},
      create: {
        id: 'drums',
        name: 'Drums',
        description: 'Drum kit and percussion lessons',
        icon: '🥁',
      },
    }),
    prisma.instrument.upsert({
      where: { id: 'vocals' },
      update: {},
      create: {
        id: 'vocals',
        name: 'Vocals',
        description: 'Voice training and singing lessons',
        icon: '🎤',
      },
    }),
    prisma.instrument.upsert({
      where: { id: 'saxophone' },
      update: {},
      create: {
        id: 'saxophone',
        name: 'Saxophone',
        description: 'Jazz and classical saxophone instruction',
        icon: '🎷',
      },
    }),
  ])
  console.log('✅ Instruments created:', instruments.length)

  // Create lessons
  const lessons = await Promise.all([
    prisma.lesson.upsert({
      where: { id: 'piano-private' },
      update: {},
      create: {
        id: 'piano-private',
        title: 'Private Piano Lesson',
        description: 'One-on-one piano instruction tailored to your skill level and goals',
        instrumentId: 'piano',
        lessonType: LessonType.PRIVATE,
        duration: 60,
        price: 2500,
        maxStudents: 1,
      },
    }),
    prisma.lesson.upsert({
      where: { id: 'piano-group' },
      update: {},
      create: {
        id: 'piano-group',
        title: 'Group Piano Class',
        description: 'Learn piano alongside fellow students in a collaborative environment',
        instrumentId: 'piano',
        lessonType: LessonType.GROUP,
        duration: 90,
        price: 1500,
        maxStudents: 5,
      },
    }),
    prisma.lesson.upsert({
      where: { id: 'guitar-private' },
      update: {},
      create: {
        id: 'guitar-private',
        title: 'Private Guitar Lesson',
        description: 'Personalized guitar instruction from beginner to advanced',
        instrumentId: 'guitar',
        lessonType: LessonType.PRIVATE,
        duration: 60,
        price: 2500,
        maxStudents: 1,
      },
    }),
    prisma.lesson.upsert({
      where: { id: 'guitar-group' },
      update: {},
      create: {
        id: 'guitar-group',
        title: 'Group Guitar Class',
        description: 'Learn guitar basics and beyond with other students',
        instrumentId: 'guitar',
        lessonType: LessonType.GROUP,
        duration: 90,
        price: 1500,
        maxStudents: 6,
      },
    }),
    prisma.lesson.upsert({
      where: { id: 'violin-private' },
      update: {},
      create: {
        id: 'violin-private',
        title: 'Private Violin Lesson',
        description: 'Expert violin instruction for all levels',
        instrumentId: 'violin',
        lessonType: LessonType.PRIVATE,
        duration: 60,
        price: 3000,
        maxStudents: 1,
      },
    }),
    prisma.lesson.upsert({
      where: { id: 'vocals-private' },
      update: {},
      create: {
        id: 'vocals-private',
        title: 'Private Vocal Coaching',
        description: 'Develop your voice with personalized vocal training',
        instrumentId: 'vocals',
        lessonType: LessonType.PRIVATE,
        duration: 60,
        price: 2500,
        maxStudents: 1,
      },
    }),
    prisma.lesson.upsert({
      where: { id: 'drums-private' },
      update: {},
      create: {
        id: 'drums-private',
        title: 'Private Drum Lesson',
        description: 'Master rhythm and percussion with expert guidance',
        instrumentId: 'drums',
        lessonType: LessonType.PRIVATE,
        duration: 60,
        price: 2500,
        maxStudents: 1,
      },
    }),
    prisma.lesson.upsert({
      where: { id: 'saxophone-private' },
      update: {},
      create: {
        id: 'saxophone-private',
        title: 'Private Saxophone Lesson',
        description: 'Jazz and classical saxophone instruction',
        instrumentId: 'saxophone',
        lessonType: LessonType.PRIVATE,
        duration: 60,
        price: 3000,
        maxStudents: 1,
      },
    }),
  ])
  console.log('✅ Lessons created:', lessons.length)

  // Create time slots for lessons
  const timeSlots = []
  for (const lesson of lessons) {
    for (let day = 1; day <= 6; day++) { // Monday to Saturday
      const slots = [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '14:00', endTime: '15:00' },
        { startTime: '15:00', endTime: '16:00' },
        { startTime: '16:00', endTime: '17:00' },
        { startTime: '17:00', endTime: '18:00' },
      ]
      for (const slot of slots) {
        timeSlots.push({
          lessonId: lesson.id,
          dayOfWeek: day,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })
      }
    }
  }
  
  await prisma.timeSlot.deleteMany({})
  await prisma.timeSlot.createMany({ data: timeSlots })
  console.log('✅ Time slots created:', timeSlots.length)

  // Create studio settings
  await prisma.studioSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'Musical Masters',
      businessEmail: 'info@musicalmasters.com',
      businessPhone: '+254712345678',
      businessAddress: 'Westlands, Nairobi, Kenya',
      openingTime: '08:00',
      closingTime: '20:00',
      workingDays: [1, 2, 3, 4, 5, 6],
      bookingNoticeHours: 24,
      cancellationHours: 24,
      currency: 'KES',
      reminderHoursBefore: 1,
    },
  })
  console.log('✅ Studio settings configured')

  // Create sample testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        studentName: 'Lisa Martinez',
        content: 'Musical Masters transformed my piano skills! The instructors are patient and incredibly talented.',
        rating: 5,
      },
    }),
    prisma.testimonial.create({
      data: {
        studentName: 'James Wilson',
        content: 'I\'ve been learning guitar here for 6 months and the progress is amazing. Highly recommend!',
        rating: 5,
      },
    }),
    prisma.testimonial.create({
      data: {
        studentName: 'Sarah Chen',
        content: 'The vocal coaching here is world-class. My voice has never sounded better.',
        rating: 5,
      },
    }),
    prisma.testimonial.create({
      data: {
        studentName: 'David Kim',
        content: 'Professional environment, excellent equipment, and passionate teachers. What more could you ask for?',
        rating: 5,
      },
    }),
  ])
  console.log('✅ Testimonials created:', testimonials.length)

  // Create sample class recordings
  const recordings = await Promise.all([
    prisma.classRecording.create({
      data: {
        title: 'Moonlight Sonata - Piano Technique',
        description: 'Learn the techniques behind Beethoven\'s iconic Moonlight Sonata in this comprehensive lesson.',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        instrumentId: 'piano',
        duration: '45:30',
        isPublic: false,
      },
    }),
    prisma.classRecording.create({
      data: {
        title: 'Spanish Romance - Guitar Tutorial',
        description: 'Master the beautiful Spanish Romance fingerpicking pattern.',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        instrumentId: 'guitar',
        duration: '38:15',
        isPublic: false,
      },
    }),
    prisma.classRecording.create({
      data: {
        title: 'Jazz Improvisation Basics',
        description: 'An introduction to jazz improvisation techniques for saxophone.',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        instrumentId: 'saxophone',
        duration: '52:00',
        isPublic: false,
      },
    }),
  ])
  console.log('✅ Class recordings created:', recordings.length)

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📋 Test Credentials:')
  console.log('   Admin: admin@musicalmasters.com / admin123')
  console.log('   Student: student@example.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
