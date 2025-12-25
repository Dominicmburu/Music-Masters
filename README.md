# 🎵 Musical Masters - Music Education Platform

A comprehensive, full-stack music education platform built with Next.js 14, PostgreSQL, and modern web technologies. This platform enables music studios to manage students, bookings, class recordings, and more.

## ✨ Features

### For Students
- **📅 Book Lessons** - Easy step-by-step booking flow with calendar view
- **📊 Dashboard** - View upcoming lessons, stats, and notifications
- **📹 Class Recordings** - Access shared lesson recordings from instructors
- **🔔 Email Notifications** - Booking confirmations and 1-hour reminders
- **👤 Profile Management** - Update personal information

### For Administrators
- **📈 Analytics Dashboard** - Overview of students, bookings, and revenue
- **📅 Calendar Management** - Visual calendar with all bookings
- **👥 Student Management** - Add, edit, and manage student accounts
- **📖 Booking Management** - Confirm, complete, or cancel bookings
- **🎬 Recording Management** - Upload YouTube links and share with students
- **⚙️ Studio Settings** - Configure business hours, cancellation policy, etc.

### General Features
- **🔐 Authentication** - Secure JWT-based authentication
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **💬 WhatsApp Integration** - Floating button for instant contact
- **📧 Email System** - Beautiful HTML email templates
- **⏰ Automated Reminders** - Cron job for lesson reminders

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + Framer Motion
- **UI Components**: Radix UI
- **Authentication**: Custom JWT implementation
- **Email**: Nodemailer with HTML templates
- **Language**: TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd musical-masters
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/musical_masters"

# Authentication
JWT_SECRET="your-super-secret-key-change-in-production"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="Musical Masters <noreply@musicalmasters.com>"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+254712345678"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Test Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@musicalmasters.com`
- Password: `admin123`

**Student Account:**
- Email: `student@example.com`
- Password: `student123`

## 📁 Project Structure

```
musical-masters/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── (dashboard)/   # Dashboard pages
│   │   │   ├── admin/     # Admin dashboard
│   │   │   └── dashboard/ # Student dashboard
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Homepage
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx
│   ├── lib/
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── email.ts       # Email service
│   │   ├── prisma.ts      # Prisma client
│   │   └── utils.ts       # Helper functions
│   └── types/
│       └── index.ts       # TypeScript types
├── .env.example
├── package.json
└── README.md
```

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-Factor Authentication in Google Account
2. Generate an App Password
3. Use the App Password in `SMTP_PASSWORD`

### Automated Reminders
Set up a cron job to call `/api/cron/reminders` every hour:

**Vercel Cron:**
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 * * * *"
  }]
}
```

**External Cron Service:**
Set `CRON_SECRET` and include it in the Authorization header.

## 📱 API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `POST /api/bookings/[id]/cancel` - Cancel booking
- `GET /api/bookings/available-slots` - Get available time slots

### Recordings
- `GET /api/recordings/shared` - Get shared recordings (student)
- `GET /api/admin/recordings` - Get all recordings (admin)
- `POST /api/admin/recordings` - Create recording (admin)
- `POST /api/admin/recordings/[id]/share` - Share with students (admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/students` - List all students
- `POST /api/admin/students` - Add new student
- `GET /api/admin/bookings` - List all bookings
- `PATCH /api/admin/bookings/[id]/status` - Update booking status

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
Ensure you have:
- Node.js 18+ runtime
- PostgreSQL database connection
- Environment variables configured

## 🔒 Security

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens with 7-day expiration
- HTTP-only cookies for token storage
- Role-based access control
- Input validation with Zod

## 📧 Email Templates

Beautiful, responsive email templates for:
- Welcome emails
- Booking confirmations
- Lesson reminders (1 hour before)
- Recording shared notifications
- Booking cancellations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for Musical Masters
