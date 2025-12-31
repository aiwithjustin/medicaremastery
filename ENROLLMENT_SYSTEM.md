# Medicare Mastery Enrollment System

## Overview

A simplified, Stripe-integrated enrollment flow with strict separation of signup, payment, and access control. Built with React, TypeScript, Supabase Auth, PostgreSQL, and Stripe Checkout.

## Core Principles

**Strict Separation of Concerns:**
1. **Signup** - Only creates Supabase auth user (no additional tables)
2. **Payment** - Handled entirely by Stripe Checkout
3. **Access Control** - Managed exclusively by the `entitlements` table via webhook

**Authorization Flow:**
- User metadata (name, phone) stored in auth.users user_metadata
- No profiles or enrollments created during signup
- Entitlements created ONLY after verified Stripe payment
- Program access determined exclusively by `has_active_access` flag

## System Architecture

### Database Schema

#### `entitlements` Table (Primary Access Control)
- `id` - UUID (primary key)
- `user_id` - UUID (references auth.users, unique)
- `has_active_access` - Boolean (default: false)
- `payment_verified` - Boolean (default: false)
- `stripe_payment_intent_id` - Text (nullable)
- `stripe_customer_id` - Text (nullable)
- `created_at` - Timestamp
- `updated_at` - Timestamp

**Critical:** This is the single source of truth for program access.

#### `enrollments` Table (Optional/Legacy)
- Maintained for admin tracking and historical records
- NOT used for access control decisions
- Updated by webhook but not queried for authorization

### User Flow

1. **Landing Page** → User clicks "Enroll Now"
2. **Sign Up** → Creates Supabase auth user only
3. **Stripe Redirect** → Immediate redirect to Stripe Checkout
4. **Payment** → User completes payment on Stripe
5. **Webhook Processing** → Stripe webhook creates entitlement record
6. **Success Redirect** → User redirected to app.medicaremastery.app
7. **Login** → User authenticates on program app
8. **Access Check** → System verifies entitlement.has_active_access
9. **Program Dashboard** → Access granted if entitlement exists

### Access Control

Access is determined by a single query:

```typescript
const hasActiveAccess = entitlement?.has_active_access && entitlement?.payment_verified;
```

**Row Level Security (RLS):**
- Users can only read their own entitlement
- Only service role (webhook) can create/update entitlements
- Frontend has read-only access

## Components

### Authentication
- `AuthContext.tsx` - Manages authentication state and entitlement checking
- `AuthModal.tsx` - Sign up form (creates auth user only, no additional tables)

### Enrollment Flow
- `SuccessPage.tsx` - Post-payment success page with redirect countdown
- `ProgramDashboard.tsx` - Course content (access controlled by entitlements)
- `LoginPage.tsx` - Program app login page

### Edge Functions
- `create-checkout-session` - Creates Stripe Checkout session
- `stripe-webhook` - Processes payment and creates entitlements

### Administration
- `AdminPanel.tsx` - View enrollments (legacy tracking)

## Usage

### For New Users

1. **Visit Landing Page** - medicaremastery.app
2. **Click "Enroll Now"** - Opens signup modal
3. **Create Account** - Email + password only
4. **Automatic Stripe Redirect** - Immediately redirected to Stripe Checkout ($97)
5. **Complete Payment** - Enter payment details on Stripe
6. **Webhook Creates Entitlement** - Server-side verification and access grant
7. **Success Page** - Redirects to app.medicaremastery.app after 3 seconds
8. **Login** - Authenticate on program app
9. **Dashboard Access** - Full program access granted

### For Returning Users

**With Active Access:**
1. Visit app.medicaremastery.app
2. System detects existing session and entitlement
3. Dashboard loads immediately

**Without Active Access:**
1. Visit app.medicaremastery.app
2. Login with credentials
3. System checks entitlement
4. Redirected to pricing if no active access

### For Administrators

**Monitoring:**
1. Visit `/admin` to view enrollment tracking
2. Entitlements table shows current access status
3. Enrollments table provides historical records

**Note:** Manual payment confirmation is no longer supported. All access is granted via Stripe webhook after verified payment.

## Payment Processing

### Stripe Checkout Session

Created by `create-checkout-session` edge function:
```typescript
{
  mode: 'payment',
  line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
  success_url: 'https://medicaremastery.app/success',
  cancel_url: 'https://medicaremastery.app/cancel',
  client_reference_id: user.id,  // Links payment to user
}
```

### Webhook Processing

The `stripe-webhook` edge function:
1. Receives `checkout.session.completed` event from Stripe
2. Extracts `client_reference_id` (user ID) from session
3. Creates or updates entitlement record:
   ```typescript
   {
     user_id: userId,
     has_active_access: true,
     payment_verified: true,
     stripe_payment_intent_id: session.payment_intent,
     stripe_customer_id: session.customer
   }
   ```
4. Returns success response to Stripe

**Critical:** This is the ONLY place where `has_active_access` is set to true.

## Error Prevention

### No Post-Signup Fetches

The signup flow intentionally avoids any database queries after user creation:
- ❌ No profile creation
- ❌ No enrollment creation
- ❌ No entitlement checks
- ✅ Only Supabase auth.signUp() + Stripe redirect

This prevents "failed to fetch" errors and ensures clean signup success.

### Session Handling

**Landing Site (medicaremastery.app):**
- Creates Supabase auth user
- Establishes session
- Redirects to Stripe with session intact

**Success Page:**
- User returns with active session
- No entitlement polling needed
- Immediate redirect to program app

**Program App (app.medicaremastery.app):**
- Reuses same Supabase session (cross-domain)
- Queries entitlement on authentication
- Controls access based on entitlement data

### Payment Verification

All payment verification happens server-side:
- Frontend never assumes payment success
- Frontend never writes to entitlements table
- Access granted ONLY after webhook verification
- No client-side access control bypassing

## Troubleshooting

### User Signup Fails

**Check:**
1. Supabase credentials in environment variables
2. Email already registered
3. Password meets minimum requirements (6 characters)
4. Browser console for specific error messages

### Stripe Checkout Not Loading

**Check:**
1. STRIPE_SECRET_KEY configured in edge function
2. STRIPE_PRICE_ID configured in edge function
3. create-checkout-session function deployed
4. Browser console for API errors

### Access Not Granted After Payment

**Check:**
1. Webhook endpoint configured in Stripe dashboard
2. Webhook receiving events (check edge function logs)
3. Entitlements table has record with has_active_access=true
4. User is logged in with correct account
5. Session is active (not expired)

### User Stuck on Success Page

**Expected behavior:** Automatic redirect after 3 seconds. If stuck:
1. Check JavaScript console for errors
2. Manually navigate to app.medicaremastery.app
3. Login with credentials
4. Access should be granted if payment was processed

## Security Notes

1. **RLS Policies** - All tables protected by Row Level Security
2. **Service Role** - Webhook uses service role key for write access
3. **Entitlement Control** - Only webhook can grant access
4. **Session Security** - Supabase handles session tokens
5. **Payment Security** - Stripe manages all payment data

## Summary

The enrollment system is designed for:
- **Simplicity** - Minimal database operations during signup
- **Security** - Server-side payment verification only
- **Reliability** - No client-side access control dependencies
- **Scalability** - Stateless webhook processing

## Testing the Flow

### Development Testing

1. **Sign Up Flow:**
   - Visit medicaremastery.app
   - Click "Enroll Now"
   - Enter test email and password
   - Verify redirect to Stripe Checkout

2. **Stripe Test Mode:**
   - Use test card: 4242 4242 4242 4242
   - Any future expiry date
   - Any CVC code
   - Complete payment

3. **Webhook Testing:**
   - Check edge function logs for webhook receipt
   - Verify entitlement created in database
   - Confirm has_active_access = true

4. **Access Verification:**
   - Visit app.medicaremastery.app
   - Login with test credentials
   - Verify dashboard loads

### Manual Entitlement Creation (Development Only)

For testing without Stripe payment:

```sql
INSERT INTO entitlements (user_id, has_active_access, payment_verified)
VALUES ('user-uuid-here', true, true);
```

## Environment Variables

**Frontend (.env):**
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Edge Functions (Auto-configured):**
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY (set manually in Supabase dashboard)
- STRIPE_PRICE_ID (set manually in Supabase dashboard)

## Architecture Benefits

1. **No "Failed to Fetch" Errors** - Signup only touches auth, no additional table operations
2. **Secure Payment Processing** - All verification server-side via webhook
3. **Clean Separation** - Signup, payment, and access are independent stages
4. **Simple Access Control** - Single source of truth (entitlements table)
5. **Automatic Session Management** - Supabase handles cross-domain sessions
6. **Webhook Idempotency** - Upsert ensures multiple webhook calls are safe
