import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface SettingsInput {
  studioName?: string
  email?: string
  phone?: string
  address?: string
  openingTime?: string
  closingTime?: string
  reminderHoursBefore?: number
  cancellationPolicy?: string
  emailNotifications?: boolean
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.studioSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.studioSettings.create({
        data: {
          businessName: 'Musical Masters',
          businessEmail: 'info@musicalmasters.com',
          businessPhone: '+254 712 345 678',
          businessAddress: 'Westlands, Nairobi, Kenya',
          openingTime: '08:00',
          closingTime: '20:00',
          reminderHoursBefore: 1,
        },
      })
    }

    return NextResponse.json({ 
      settings: {
        studioName: settings.businessName,
        email: settings.businessEmail,
        phone: settings.businessPhone,
        address: settings.businessAddress,
        openingTime: settings.openingTime,
        closingTime: settings.closingTime,
        reminderHoursBefore: settings.reminderHoursBefore,
        cancellationPolicy: `Cancellations must be made at least ${settings.cancellationHours} hours before the scheduled lesson.`,
        emailNotifications: true,
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SettingsInput = await req.json()

    let settings = await prisma.studioSettings.findFirst()

    if (settings) {
      settings = await prisma.studioSettings.update({
        where: { id: settings.id },
        data: {
          businessName: body.studioName,
          businessEmail: body.email,
          businessPhone: body.phone,
          businessAddress: body.address,
          openingTime: body.openingTime,
          closingTime: body.closingTime,
          reminderHoursBefore: body.reminderHoursBefore,
        },
      })
    } else {
      settings = await prisma.studioSettings.create({
        data: {
          businessName: body.studioName || 'Musical Masters',
          businessEmail: body.email || 'info@musicalmasters.com',
          businessPhone: body.phone || '',
          businessAddress: body.address || '',
          openingTime: body.openingTime || '08:00',
          closingTime: body.closingTime || '20:00',
          reminderHoursBefore: body.reminderHoursBefore || 1,
        },
      })
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}