# NurseHub - Home Care Appointment System

A full-featured Next.js application for managing home healthcare appointments with PostgreSQL database, admin authentication, and email notifications.

## Features

✨ **Core Features**

- Home page with services overview and smooth animations
- Public appointment booking form with validation
- Admin authentication with NextAuth.js
- Protected admin dashboard with real-time statistics
- Appointment management (approve, complete, cancel, delete)
- Email notifications for appointment status changes
- SMS notifications via Twilio for appointment updates
- Admin SMS alerts for new appointments
- Phone number validation with automatic Tunisia (+216) prefix
- Email validation with proper format checking
- Responsive design with Tailwind CSS

🌍 **Internationalization**

- Multi-language support: French (default), Arabic, English
- Language switcher with easy cycling (FR → ع → EN)
- Right-to-left (RTL) support for Arabic
- Complete translations for all UI elements, forms, and notifications

♿ **Accessibility Features**

- Text size adjustment with 4 levels (small, normal, large, larger)
- A+/A/A- buttons for quick text size control
- Fixed accessibility toolbar for easy access
- Persistent user preferences (stored in localStorage)
- Scroll-to-top on page navigation

🎨 **User Experience**

- Custom delete confirmation modal with smooth animations
- Medical cross favicon
- Scroll-reveal animations on content
- Gradient backgrounds and modern UI design
- Responsive navigation with language indicators
- Footer with multi-language support

📧 **Communication**

- Email notifications via SendGrid SMTP
- SMS notifications via Twilio
- Appointment status updates (pending, approved, cancelled)
- Cancellation reason included in notifications
- Admin notifications for new bookings

🔒 **Security & Validation**

- Password hashing with bcrypt
- Protected API routes with NextAuth
- Input validation with Zod
- SQL injection protection via Prisma
- Phone number format validation (E.164)
- CSRF protection
- Secure session management

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM (Vercel Postgres)
- **Authentication**: NextAuth.js v4.24.13 with credentials provider
- **Email**: SendGrid SMTP
- **SMS**: Twilio
- **Internationalization**: Custom i18n with 3 languages (FR/AR/EN)
- **Validation**: Zod
- **Forms**: React Hook Form
- **Styling**: CSS custom properties, CSS Grid, Flexbox
- **Fonts**: Cairo (Arabic), Inter (Latin)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Gmail account or SMTP server for emails

## Installation

1. **Clone and navigate to the project:**

   ```bash
   cd NurseHub
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   ```env
   # Database - Replace with your PostgreSQL connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/nursehub?schema=public"

   # NextAuth - Generate secret with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret-here"

   # Admin Credentials
   ADMIN_EMAIL="admin@nursehub.com"
   ADMIN_PASSWORD="your-secure-password"

   # Email Configuration (SendGrid SMTP)
   EMAIL_SERVER_HOST="smtp.sendgrid.net"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="apikey"
   EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
   EMAIL_FROM="NurseHub <noreply@nursehub.com>"

   # SMS Configuration (Twilio)
   TWILIO_ACCOUNT_SID="your-twilio-account-sid"
   TWILIO_AUTH_TOKEN="your-twilio-auth-token"
   TWILIO_PHONE_NUMBER="+15342026624"  # Your Twilio phone number
   ADMIN_PHONE_NUMBER="+21695650081"   # Admin phone for notifications
   ```

4. **Set up PostgreSQL database:**

   Create a new database:

   ```sql
   CREATE DATABASE nursehub;
   ```

5. **Run database migrations:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Create admin user:**

   ```bash
   npx tsx prisma/seed.ts
   ```

7. **Start development server:**

   ```bash
   npm run dev
   ```

   Visit: http://localhost:3000

## Email & SMS Configuration

### SendGrid Setup

1. Create a SendGrid account at https://sendgrid.com
2. Generate an API key:
   - Go to Settings → API Keys → Create API Key
   - Select "Full Access" or "Mail Send" permissions
   - Copy the API key
3. Use the API key in `EMAIL_SERVER_PASSWORD`
4. Set `EMAIL_SERVER_USER="apikey"` (literally the word "apikey")

### Twilio Setup

1. Create a Twilio account at https://twilio.com
2. Get your credentials from the Twilio Console:
   - Account SID
   - Auth Token
   - Phone Number (purchase or use trial number)
3. Add these to your `.env` file
4. Note: Trial accounts can only send to verified phone numbers

## Project Structure

```
nursehub/
├── app/
│   ├── admin/
│   │   ├── login/         # Admin login page
│   │   ├── dashboard/     # Admin dashboard
│   │   └── layout.tsx     # Admin layout with SessionProvider
│   ├── api/
│   │   ├── auth/          # NextAuth endpoints
│   │   └── appointments/  # Appointment CRUD API
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page with view routing
│   ├── globals.css        # Global styles
│   └── icon.svg           # Medical cross favicon
├── components/
│   ├── Header.tsx               # Navigation header with language indicator
│   ├── Footer.tsx               # Multi-language footer
│   ├── HomeView.tsx             # Landing page with services
│   ├── BookingView.tsx          # Appointment form with phone validation
│   ├── DashboardView.tsx        # Admin dashboard with delete modal
│   └── AccessibilityToolbar.tsx # Text size & language controls
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client singleton
│   ├── email.ts           # SendGrid email service
│   ├── sms.ts             # Twilio SMS service
│   ├── validations.ts     # Zod validation schemas
│   ├── translations.ts    # i18n translations (FR/AR/EN)
│   └── settings-context.tsx # Global settings provider
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
└── package.json
```

## Usage

### Public Access

1. Visit homepage: `http://localhost:3000`
2. Browse services with scroll animations
3. Switch language using the language button (FR/ع/EN)
4. Adjust text size with A+/A/A- buttons
5. Click "Book Appointment"
6. Fill out the form:
   - Name (required)
   - Email (validated format)
   - Phone (auto +216 prefix for Tunisia)
   - Address (required)
   - Reason for visit (required)
   - Additional message (optional)
7. Receive confirmation email and SMS

### Admin Access

1. Go to: `http://localhost:3000/admin/login`
2. Login with admin credentials (username: eyachoukk)
3. View dashboard with real-time statistics:
   - Total appointments
   - Pending requests
   - Approved appointments
   - Completed visits
4. Manage appointments:
   - Approve pending requests (sends email + SMS)
   - Mark as completed (sends email + SMS)
   - Cancel with reason (sends email + SMS with cancellation reason)
   - Delete records (custom confirmation modal)
5. Filter appointments by status
6. Receive SMS notifications for new bookings
7. Patients receive email and SMS notifications on all status changes

## Database Schema

### Appointment Model

- `id`: Unique identifier
- `name`: Patient full name
- `email`: Contact email (validated)
- `phone`: Phone number with +216 prefix (validated)
- `address`: Home address
- `reason`: Consultation reason
- `message`: Additional information (optional)
- `status`: PENDING | APPROVED | COMPLETED | CANCELLED
- `cancellationReason`: Reason for cancellation (optional)
- `createdAt`: Submission timestamp
- `updatedAt`: Last modified timestamp

### Admin Model

- `id`: Unique identifier
- `email`: Admin email
- `password`: Hashed password (bcrypt)
- `name`: Admin name (optional)
- `createdAt`: Account creation date
- `updatedAt`: Last modified date

## API Endpoints

### Public Endpoints

- `POST /api/appointments` - Create new appointment

### Protected Endpoints (require authentication)

- `GET /api/appointments` - List all appointments
- `GET /api/appointments/:id` - Get single appointment
- `PATCH /api/appointments/:id` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/stats` - Get statistics

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Database Hosting

Use hosted PostgreSQL:

- **Vercel Postgres**: Built-in integration
- **Supabase**: Free tier available
- **Railway**: Easy PostgreSQL setup
- **Neon**: Serverless PostgreSQL

## Security Features

- Password hashing with bcrypt
- Protected API routes with NextAuth
- Input validation with Zod
- SQL injection protection via Prisma
- CSRF protection
- Secure session management

## Customization

### Branding

- Update colors in `tailwind.config.ts`
- Modify logo in `components/Header.tsx`
- Change content in `components/HomeView.tsx`
- Customize favicon in `app/icon.svg`

### Languages

- Add new languages in `lib/translations.ts`
- Update language cycling in `components/AccessibilityToolbar.tsx`
- Add font families in `app/layout.tsx` for new scripts

### Services

Edit services array in `components/HomeView.tsx`

### Text Sizes

Adjust text size values in `lib/settings-context.tsx`:

- `small`: 14px
- `normal`: 16px (default)
- `large`: 18px
- `larger`: 20px

### Email & SMS Templates

- Email templates: `lib/email.ts`
- SMS templates: `lib/sms.ts` (keep under 160 characters for trial accounts)

## Troubleshooting

**Database connection fails:**

- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists

**Emails not sending:**

- Verify SendGrid API key
- Check SendGrid account credits
- Review firewall/network settings
- Check spam folder

**SMS not sending:**

- Verify Twilio credentials
- Check phone number format (+216 for Tunisia)
- Ensure recipient phone is verified (trial accounts)
- Keep messages under 160 characters
- Review Twilio console logs

**Login issues:**

- Run seed script to create admin
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Create new migration
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
