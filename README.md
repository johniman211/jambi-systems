# Jambi Systems Website

A production-ready agency website built with Next.js 14, Tailwind CSS, and Supabase. Features a public marketing site and a private admin dashboard for managing system request submissions.

## Features

- **Public Pages**: Home, Services, About, Contact, Privacy, Terms
- **Request a System Form**: Multi-step form with validation, spam protection (honeypot + rate limiting)
- **Admin Dashboard**: View, filter, search, and export submissions
- **Email Notifications**: Automatic emails on new submissions via Gmail SMTP
- **SEO Optimized**: Meta tags, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt
- **Responsive Design**: Mobile-first, professional neutral color scheme

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Gmail SMTP (Nodemailer)
- **Validation**: Zod
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Gmail account with App Password
- Vercel account (for deployment)

## Setup Instructions

### 1. Clone and Install

```bash
cd "Jambi System"
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   - Copy contents of `supabase/migrations/001_create_system_requests.sql`
   - Paste and run in the SQL Editor
3. (Optional) Run `supabase/seed.sql` to add sample data for testing

### 3. Create Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter admin email and password
4. This user can now login at `/admin/login`

### 4. Set Up Gmail App Password

To send emails via Gmail SMTP, you need to create an App Password:

1. Go to your Google Account at [myaccount.google.com](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. At the bottom, click **App passwords**
4. Select app: **Mail**, Select device: **Other (Custom name)**
5. Enter "Jambi Systems" and click **Generate**
6. Copy the 16-character password (you'll use this as `GMAIL_SMTP_APP_PASSWORD`)

> **Note**: App Passwords only work with 2-Step Verification enabled.

### 5. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
# Site URL (no trailing slash)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Supabase (find in Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gmail SMTP Configuration
GMAIL_SMTP_USER=your-email@gmail.com
GMAIL_SMTP_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
FORMS_TO_EMAIL=your-email@gmail.com
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── (admin)/           # Admin dashboard (route group)
│   │   ├── admin/         # Dashboard pages
│   │   ├── admin-nav.tsx  # Admin navigation
│   │   └── layout.tsx     # Admin layout with auth
│   ├── admin/login/       # Login page (outside route group)
│   ├── actions/           # Server actions
│   ├── about/
│   ├── contact/
│   ├── privacy/
│   ├── request/           # Request form
│   ├── services/
│   ├── terms/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx           # Homepage
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/            # Navbar, Footer
│   └── ui/                # Button, Input, Card, etc.
├── lib/
│   ├── email/             # Email sending (Resend/SMTP)
│   ├── supabase/          # Supabase clients
│   ├── rate-limit.ts
│   ├── types.ts
│   └── validations.ts     # Zod schemas
├── supabase/
│   ├── migrations/        # SQL migrations
│   └── seed.sql           # Sample data
├── middleware.ts          # Auth middleware
└── README.md
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/jambi-systems.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables (same as `.env.local`)
3. Deploy

### 3. Update Site URL

After deployment, update `NEXT_PUBLIC_SITE_URL` to your production domain.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your site URL (for SEO, sitemap) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `GMAIL_SMTP_USER` | Yes | Your Gmail address |
| `GMAIL_SMTP_APP_PASSWORD` | Yes | Gmail App Password (16 characters) |
| `FORMS_TO_EMAIL` | Yes | Email address to receive form submissions |

## Admin Dashboard

Access at `/admin/login` with the admin user created in Supabase.

### Features

- **View Submissions**: Table with all form submissions
- **Filters**: Status, category, budget, date range, search
- **Status Updates**: Mark as new, in_review, contacted, closed
- **Internal Notes**: Add private notes to submissions
- **Quick Actions**: "Mark as Contacted" button
- **Export CSV**: Download filtered submissions

## Security

- **RLS Policies**: Public can only insert; authenticated users can read/update
- **Honeypot**: Hidden field to catch bots
- **Rate Limiting**: IP-based limit (10 requests/hour)
- **Server Validation**: All inputs validated server-side with Zod
- **Protected Routes**: Middleware redirects unauthenticated users

## Customization

### Colors

Edit `tailwind.config.ts` to change the primary color palette:

```ts
colors: {
  primary: {
    50: '#f8fafc',
    // ... customize colors
  },
}
```

### Content

All page content uses the exact copy provided. To update:
- Edit individual page files in `app/` directory
- Update email templates in `lib/email/templates.ts`

## Testing Email Locally

1. Make sure your `.env.local` has the Gmail SMTP variables configured
2. Run `npm run dev`
3. Navigate to `/contact` or `/request` and submit a form
4. Check your `FORMS_TO_EMAIL` inbox for the email

### Form API Endpoints

| Form | Endpoint | Method |
|------|----------|--------|
| Request a System | `/api/forms/request-system` | POST |
| Contact | `/api/forms/contact` | POST |

### Request System Payload

```json
{
  "full_name": "John Doe",
  "business_name": "JD Media",
  "phone": "+211 912 345 678",
  "email": "john@example.com",
  "business_type": "creator_influencer",
  "system_category": "creator_subscription",
  "problem": "Description of the problem...",
  "goals": "What I want to achieve...",
  "payments": ["mobile_money", "bank"],
  "requires_login": "yes",
  "timeline": "2_4_weeks",
  "budget_range": "800_1500",
  "additional_info": "Optional info",
  "consent": true
}
```

### Contact Payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+211 912 345 678",
  "message": "Your message here..."
}
```

## Vercel Deployment

When deploying to Vercel, add these environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GMAIL_SMTP_USER`
- `GMAIL_SMTP_APP_PASSWORD`
- `FORMS_TO_EMAIL`

## License

Private - Jambi Systems
