# Medicare Mastery - Login Flow Documentation

## Overview

The Medicare Mastery platform uses a centralized authentication approach where all login functionality is handled exclusively on the program app domain (`app.medicaremastery.app`). The marketing site (`medicaremastery.app`) redirects users to the program app for authentication.

## Architecture

### Two-Domain Structure

1. **Marketing Site** (`medicaremastery.app`)
   - Landing page with program information
   - Enrollment and payment processing
   - NO local authentication forms
   - Login buttons redirect to program app

2. **Program App** (`app.medicaremastery.app`)
   - Centralized authentication at `/login`
   - Protected dashboard and program content
   - Entitlement-based access control

## Login Flow

### From Marketing Site

1. User clicks "Log In" button on `medicaremastery.app`
2. Immediate redirect to `https://app.medicaremastery.app/login`
3. No intermediate steps or confirmations

**Implementation:**
```typescript
// src/App.tsx - handleLoginClick
const handleLoginClick = () => {
  console.log('🔵 [APP] Login button clicked, redirecting to app.medicaremastery.app/login');
  window.location.href = 'https://app.medicaremastery.app/login';
};
```

### On Program App Login Page

Located at `https://app.medicaremastery.app/login`

**Features:**
- Email/password authentication only (no signup)
- Minimal, focused UI
- Supabase authentication
- Automatic entitlement verification
- Smart redirect based on access status

**Process:**
1. User enters email and password
2. System authenticates with Supabase
3. After successful authentication:
   - Query `entitlements` table for user's access status
   - Check `has_active_access` AND `payment_verified` flags
   - Redirect based on result:

**Redirect Logic:**
```typescript
if (has_active_access && payment_verified) {
  // User has paid and has access
  redirect to 'https://app.medicaremastery.app' (dashboard)
} else {
  // User authenticated but no active access
  redirect to 'https://medicaremastery.app/pricing'
}
```

### Protected Route Access

When a user tries to access protected routes on `app.medicaremastery.app`:

**Access Checks (ProtectedApp component):**
1. Check for authenticated session
2. If no session → redirect to `https://app.medicaremastery.app/login`
3. Check entitlement status
4. If no active access → redirect to `https://medicaremastery.app/pricing`
5. If all checks pass → load dashboard

## User Journey Examples

### New User (First Time)

```
1. Visit medicaremastery.app
2. Click "Enroll Now"
3. Create account via signup modal
4. Complete payment via Stripe
5. Webhook creates entitlement
6. Redirect to app.medicaremastery.app (automatic login via session)
7. Dashboard loads
```

### Returning User (With Access)

```
1. Visit medicaremastery.app
2. Click "Log In"
3. Redirect to app.medicaremastery.app/login
4. Enter credentials
5. System verifies entitlement (has_active_access = true)
6. Redirect to app.medicaremastery.app
7. Dashboard loads
```

### User Without Access

```
1. Visit app.medicaremastery.app/login
2. Enter credentials
3. System verifies entitlement (has_active_access = false)
4. Redirect to medicaremastery.app/pricing
5. User can purchase access
```

### Direct Dashboard Access (Unauthenticated)

```
1. Visit app.medicaremastery.app directly
2. ProtectedApp checks for session
3. No session found
4. Redirect to app.medicaremastery.app/login
```

### Direct Dashboard Access (No Access)

```
1. Visit app.medicaremastery.app with valid session
2. ProtectedApp checks entitlement
3. has_active_access = false
4. Redirect to medicaremastery.app/pricing
```

## Session Management

### Cross-Domain Sessions

Both domains use the same Supabase project with shared configuration:

```typescript
createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    storageKey: 'medicare-mastery-auth',
    persistSession: true,
    autoRefreshToken: true,
  }
})
```

**Key Points:**
- Sessions stored in localStorage with custom key
- Accessible across both subdomains
- Automatic token refresh
- Session persists across page reloads

### Session Lifecycle

1. **Creation**: On signup or login via Supabase Auth
2. **Storage**: localStorage with key `medicare-mastery-auth`
3. **Access**: Both domains read from same storage
4. **Refresh**: Automatic via Supabase client
5. **Destruction**: On explicit logout

## Security Considerations

### No Local Authentication on Marketing Site

- Marketing site NEVER handles authentication directly
- No AuthModal for login on marketing site
- Only signup flow for new enrollments
- All authentication happens on program app

### Server-Authoritative Access Control

- Entitlement checks happen server-side (database queries)
- RLS policies prevent unauthorized access
- Frontend checks are for UX only
- Database is source of truth for access decisions

### Route Protection

Multiple layers of security:
1. Session validation
2. Entitlement verification
3. Database RLS policies
4. Automatic redirects for unauthorized access

## UI Components

### Header (Marketing Site)

**Login Button:**
```typescript
<button
  onClick={onLoginClick}
  className="text-gray-700 hover:text-crimson-600 font-semibold transition-colors"
>
  Log In
</button>
```

**Behavior:** Redirects to `https://app.medicaremastery.app/login`

### LoginPage (Program App)

**Location:** `src/components/LoginPage.tsx`

**Features:**
- Email and password fields only
- Loading states with spinner
- Error handling with clear messages
- Link to enrollment for new users
- Link back to home page

**No Signup Mode:**
The login page is strictly for authentication. New users must enroll through the marketing site.

### ProtectedApp (Program App)

**Location:** `src/components/ProtectedApp.tsx`

**Features:**
- Session verification
- Entitlement checking
- Automatic redirects
- Loading states
- Error handling

## Configuration

### Environment Variables

Both apps use the same Supabase configuration:

```env
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### Routes

**Marketing Site:**
- `/` - Landing page
- `/pricing` - Pricing information (for users without access)
- `/success` - Payment success and redirect
- `/cancel` - Payment cancellation

**Program App:**
- `/login` - Centralized authentication
- `/` - Protected dashboard (requires entitlement)
- `/dashboard` - Alternative dashboard route
- `/program` - Program content (requires entitlement)

## Testing Scenarios

### Test Login Flow

1. **Happy Path:**
   - Click login on marketing site
   - Verify redirect to app.medicaremastery.app/login
   - Enter valid credentials
   - Verify redirect to dashboard

2. **No Access:**
   - Login with credentials
   - User has no entitlement
   - Verify redirect to pricing page

3. **Invalid Credentials:**
   - Enter wrong password
   - Verify error message displays
   - Verify no redirect occurs

4. **Session Persistence:**
   - Login successfully
   - Close browser
   - Reopen and visit app.medicaremastery.app
   - Verify automatic login

5. **Protected Route:**
   - Visit app.medicaremastery.app without login
   - Verify redirect to login page
   - Login successfully
   - Verify return to intended destination

## Troubleshooting

### User Can't Login

**Checks:**
1. Verify user account exists in Supabase
2. Check password is correct (min 6 characters)
3. Verify Supabase credentials in environment variables
4. Check browser console for errors
5. Verify network connectivity

### Redirect Loop

**Possible Causes:**
1. Entitlement record missing or incorrect
2. Session not persisting across domains
3. localStorage blocked by browser
4. Conflicting authentication state

**Solutions:**
1. Check entitlements table for user
2. Verify storageKey matches on both domains
3. Enable cookies/localStorage in browser
4. Clear browser cache and try again

### Dashboard Not Loading After Login

**Checks:**
1. Verify entitlement exists for user
2. Check `has_active_access` and `payment_verified` are both true
3. Verify RLS policies allow user to read their entitlement
4. Check browser console for errors
5. Verify session is valid

## Maintenance

### Adding New Login Methods

If adding OAuth or other login methods:
1. Implement on LoginPage component only
2. Ensure entitlement check happens after authentication
3. Maintain redirect logic based on access status
4. Update LoginPage UI accordingly

### Changing Redirect URLs

When deploying to different domains:
1. Update `handleLoginClick` in App.tsx
2. Update LoginPage redirect URLs
3. Update ProtectedApp redirect URLs
4. Update documentation

### Modifying Access Control

To change access logic:
1. Update entitlement check query in LoginPage
2. Update hasActiveAccess logic in AuthContext
3. Update ProtectedApp access checks
4. Ensure RLS policies match new logic

---

For general system architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)
For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
