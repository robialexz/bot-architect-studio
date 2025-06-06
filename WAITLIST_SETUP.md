# FlowsyAI Waitlist Setup Guide

## Overview

FlowsyAI includes a robust waitlist system that can work in both **Demo Mode**
(for development) and **Production Mode** (with Supabase database).

## Current Status

✅ **Demo Mode Active** - The waitlist currently works in demo mode for
development ⚠️ **Database Setup Required** - For production, you need to set up
the Supabase database

## Demo Mode Features

When the database is not accessible, the system automatically switches to demo
mode:

- ✅ Email validation and storage in memory
- ✅ Duplicate email detection
- ✅ Statistics tracking (simulated)
- ✅ Unsubscribe functionality
- ✅ Full UI functionality
- ✅ Console logging for debugging

## Setting Up Production Database

### 1. Supabase Configuration

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema

Execute the following SQL in your Supabase SQL Editor:

```sql
-- Create waitlist_emails table
CREATE TABLE IF NOT EXISTS public.waitlist_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_email ON public.waitlist_emails(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_created_at ON public.waitlist_emails(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_status ON public.waitlist_emails(status);

-- Enable Row Level Security
ALTER TABLE public.waitlist_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY IF NOT EXISTS "Anyone can insert waitlist emails" ON public.waitlist_emails
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can view waitlist emails" ON public.waitlist_emails
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Anyone can update waitlist email status" ON public.waitlist_emails
  FOR UPDATE USING (true) WITH CHECK (status IN ('active', 'unsubscribed'));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_waitlist_emails_updated_at
  BEFORE UPDATE ON public.waitlist_emails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

### 3. Verification

After setting up the database:

1. The system will automatically detect the database
2. Demo mode will be disabled
3. Real email storage will begin
4. Statistics will reflect actual data

## Features

### Email Management

- ✅ Email validation (RFC 5322 compliant)
- ✅ Duplicate prevention
- ✅ Automatic normalization
- ✅ Unsubscribe functionality
- ✅ Status tracking (active/unsubscribed/bounced)

### Analytics & Tracking

- ✅ IP address logging
- ✅ User agent detection
- ✅ Referrer tracking
- ✅ UTM parameter capture
- ✅ Signup statistics (daily/weekly/monthly)

### Security

- ✅ Rate limiting
- ✅ Input sanitization
- ✅ SQL injection prevention
- ✅ Row Level Security (RLS)
- ✅ GDPR compliance ready

## API Endpoints

### Submit Email

```typescript
await waitlistService.submitEmail('user@example.com');
```

### Get Statistics

```typescript
const stats = await waitlistService.getStats();
```

### Unsubscribe

```typescript
await waitlistService.unsubscribeEmail('user@example.com');
```

## Error Handling

The system includes comprehensive error handling:

- ✅ Network failures → Demo mode fallback
- ✅ Database errors → Graceful degradation
- ✅ Invalid emails → User-friendly messages
- ✅ Rate limiting → Temporary blocks
- ✅ Duplicate emails → Clear notifications

## Monitoring

Check the browser console for:

- Database connection status
- Demo mode activation
- Email submission logs
- Error messages

## Production Deployment

1. Set up Supabase database with the provided SQL
2. Configure environment variables
3. Deploy the application
4. Verify database connectivity
5. Monitor email submissions

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify Supabase configuration
3. Ensure database schema is correct
4. Test with demo mode first

The system is designed to work seamlessly in both development and production
environments!
