# Medicare Mastery Enrollment System

## Overview

A complete authentication and enrollment flow with payment gating for the Medicare Mastery program. Built with React, TypeScript, Supabase Auth, and PostgreSQL.

## System Architecture

### Database Schema

#### `user_profiles` Table
- `id` - UUID (references auth.users)
- `full_name` - User's full name
- `phone` - Contact phone number
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

#### `enrollments` Table
- `id` - UUID (primary key)
- `user_id` - UUID (references auth.users)
- `email` - User's email
- `enrollment_status` - 'unpaid' | 'paid'
- `program_access` - 'locked' | 'unlocked'
- `payment_amount` - Numeric (default: 497)
- `payment_confirmed_at` - Timestamp (nullable)
- `payment_method` - Text (nullable)
- `stripe_payment_intent_id` - Text (nullable, for future integration)
- `created_at` - Enrollment timestamp
- `updated_at` - Last update timestamp

### User Flow

1. **Landing Page** → User sees marketing content
2. **Click "Enroll Now"** → Auth modal appears
3. **Sign Up** → Create account with email/password
4. **Create Enrollment** → Enrollment record created with status: unpaid, access: locked
5. **Payment Required Screen** → User sees payment pending message
6. **Admin Confirms Payment** → Access unlocked via admin panel
7. **Program Dashboard** → User gains access to course content

### Access Control

All data access is protected by Row Level Security (RLS):
- Users can only read/update their own profile
- Users can only read their own enrollment
- Users can only create enrollments with locked access
- Payment confirmation is handled server-side

## Components

### Authentication
- `AuthContext.tsx` - Manages authentication state and user session
- `AuthModal.tsx` - Sign up and sign in form

### Enrollment Flow
- `EnrollmentModal.tsx` - Creates enrollment record for authenticated users
- `PaymentRequired.tsx` - Shows payment pending status
- `ProgramDashboard.tsx` - Course content (access granted after payment)

### Administration
- `AdminPanel.tsx` - Manage enrollments and confirm payments manually

## Usage

### For New Users

1. Visit the landing page
2. Click "Enroll Now"
3. Create an account (email + password)
4. Automatic enrollment creation
5. Redirected to payment required screen
6. Contact support or wait for admin to confirm payment

### For Returning Users

1. Click "Enroll Now" to sign in
2. System automatically routes based on status:
   - No enrollment → Show landing page
   - Enrollment unpaid → Show payment required
   - Enrollment paid → Show program dashboard

### For Administrators

1. Visit `/admin` to access the admin panel
2. View all enrollments in a table
3. Click "Confirm Payment" to manually approve enrollments
4. This updates the database:
   - `enrollment_status` → 'paid'
   - `program_access` → 'unlocked'
   - `payment_confirmed_at` → current timestamp

## Payment Confirmation Function

A PostgreSQL function `confirm_enrollment_payment` is available for payment confirmation:

```sql
SELECT confirm_enrollment_payment(
  enrollment_user_id := 'user-uuid-here',
  payment_method_used := 'manual_confirmation'
);
```

This function can be called:
- Manually from the admin panel
- Via webhook from payment processors (Stripe, PayPal, etc.)
- From edge functions for custom payment flows

## Future Integration

The system is designed to easily integrate with payment processors:

1. Replace manual confirmation with webhook handler
2. Call `confirm_enrollment_payment()` from webhook
3. Pass actual payment method and transaction ID
4. All access control logic remains unchanged

## Security Features

- Email/password authentication via Supabase Auth
- Row Level Security on all tables
- Server-side payment confirmation only
- Protected admin functions
- Automatic session management
- Password requirements enforced

## Testing the Flow

1. **Create Account**: Sign up with test email
2. **Check Database**: Verify enrollment created with locked access
3. **Confirm Payment**: Use admin panel to approve
4. **Access Dashboard**: User automatically redirected to content

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Technical Notes

- Uses Supabase Auth for user management
- Authentication state persists across page refreshes
- Enrollment status checked on every auth state change
- Admin panel accessible at `/admin` route
- All mutations require authentication
- Payment status changes are immutable by users
