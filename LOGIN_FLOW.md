# Medicare Mastery - Login Flow Documentation

## Overview

The Medicare Mastery platform uses a centralized authentication approach where all login functionality is handled exclusively on the program app domain (`app.medicaremastery.app`). The marketing site (`medicaremastery.app`) redirects users to the program app for authentication.

**Key Principle:** The root route (`/`) of the program app serves as both the login entry point and the authenticated dashboard, automatically adapting based on session state.

## Architecture

### Two-Domain Structure

1. **Marketing Site** (`medicaremastery.app`)
   - Landing page with program information
   - Enrollment and payment processing
   - NO local authentication forms
   - Login buttons redirect to program app root

2. **Program App** (`app.medicaremastery.app`)
   - Root route (`/`) handles both login and dashboard
   - Automatic session detection
   - Entitlement-based access control
   - No separate `/login` route needed

## Login Flow

### From Marketing Site

1. User clicks "Log In" button on `medicaremastery.app`
2. Immediate redirect to `https://app.medicaremastery.app` (root)
3. No intermediate steps or confirmations

**Implementation:**
```typescript
// src/App.tsx - handleLoginClick
const handleLoginClick = () => {
  console.log('🔵 [APP] Login button clicked, redirecting to app.medicaremastery.app');
  window.location.href = 'https://app.medicaremastery.app';
};
```

### On Program App Root Route

Located at `https://app.medicaremastery.app/`

**Intelligent Routing Logic:**

The root route automatically determines what to display based on authentication state:

```typescript
if (isAppDomain && isRootRoute) {
  if (!user) {
    // Show login UI
    setCurrentView('login');
  } else if (enrollment?.program_access === 'unlocked') {
    // Show dashboard
    setCurrentView('dashboard');
  } else if (enrollment?.program_access === 'locked') {
    // Show payment required page
    setCurrentView('payment');
  } else {
    // Redirect to pricing
    window.location.href = 'https://medicaremastery.app/pricing';
  }
}
```

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
7. Root route detects session and access, shows dashboard
```

### Returning User (With Access)

```
1. Visit medicaremastery.app
2. Click "Log In"
3. Redirect to app.medicaremastery.app (root)
4. Root route detects no session, shows login UI
5. Enter credentials
6. System verifies entitlement (has_active_access = true)
7. Root route now shows dashboard (no redirect needed)
```

### User Without Access

```
1. Visit app.medicaremastery.app (root)
2. Root route shows login UI
3. Enter credentials
4. System verifies entitlement (has_active_access = false)
5. Redirect to medicaremastery.app/pricing
6. User can purchase access
```

### Direct Dashboard Access (Unauthenticated)

```
1. Visit app.medicaremastery.app directly
2. Root route checks for session
3. No session found
4. Root route shows login UI
```

### Direct Dashboard Access (Authenticated with Access)

```
1. Visit app.medicaremastery.app with valid session
2. Root route detects session and checks entitlement
3. has_active_access = true
4. Root route shows dashboard
```

### Direct Dashboard Access (Authenticated without Access)

```
1. Visit app.medicaremastery.app with valid session
2. Root route detects session and checks entitlement
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

**Behavior:** Redirects to `https://app.medicaremastery.app` (root)

### App Root Route Logic (Program App)

**Location:** `src/App.tsx`

**Intelligent View Selection:**
The root route of the program app automatically determines what to display:
- **No Session:** Shows LoginPage component
- **Session + Access:** Shows ProgramDashboard component
- **Session + No Access:** Redirects to pricing page

**Features:**
- Automatic session detection
- Entitlement-based routing
- Seamless user experience
- No page reload between views

### LoginPage (Program App)

**Location:** `src/components/LoginPage.tsx`

**Rendered at:** Root route (`/`) when no session exists

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

**Usage:** For standalone protected route access (not used on root)

**Features:**
- Session verification
- Entitlement checking
- Automatic redirects to app root
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
- `/` - Landing page with enrollment flow
- `/pricing` - Pricing information (for users without access)
- `/success` - Payment success and redirect
- `/cancel` - Payment cancellation

**Program App:**
- `/` - Smart root route (login UI or dashboard based on session)
  - **No session:** Displays login UI
  - **Session + Access:** Displays dashboard
  - **Session + No Access:** Redirects to pricing
- `/dashboard` - Alternative dashboard route (protected)
- `/program` - Program content route (protected)
- `/admin` - Admin panel (protected)
- `/success` - Payment success confirmation
- `/cancel` - Payment cancellation confirmation

**Note:** The program app no longer uses a `/login` route. All authentication happens at the root (`/`) with intelligent view switching.

## Testing Scenarios

### Test Login Flow

1. **Happy Path:**
   - Click login on marketing site
   - Verify redirect to app.medicaremastery.app (root)
   - Verify login UI appears
   - Enter valid credentials
   - Verify dashboard loads without additional redirect

2. **No Access:**
   - Visit app.medicaremastery.app
   - Enter credentials for user without access
   - Verify redirect to pricing page

3. **Invalid Credentials:**
   - Visit app.medicaremastery.app
   - Enter wrong password
   - Verify error message displays
   - Verify no redirect occurs
   - Verify user stays on login UI

4. **Session Persistence:**
   - Login successfully
   - Close browser
   - Reopen and visit app.medicaremastery.app
   - Verify automatic dashboard load (no login UI shown)

5. **Direct Root Access (No Session):**
   - Clear session/logout
   - Visit app.medicaremastery.app directly
   - Verify login UI appears immediately
   - No redirect needed

6. **Direct Root Access (With Session and Access):**
   - Login successfully (have active access)
   - Visit app.medicaremastery.app directly
   - Verify dashboard loads immediately
   - No login UI shown

## Troubleshooting

### User Can't Login

**Checks:**
1. Verify user account exists in Supabase
2. Check password is correct (min 6 characters)
3. Verify Supabase credentials in environment variables
4. Check browser console for errors
5. Verify network connectivity
6. Confirm app.medicaremastery.app is loading correctly

### Login UI Not Showing on App Root

**Possible Causes:**
1. Cached session exists but is invalid
2. Loading state stuck
3. JavaScript errors preventing render
4. Domain detection not working on localhost

**Solutions:**
1. Clear browser cache and localStorage
2. Check browser console for errors
3. Verify hostname detection logic includes localhost
4. Try hard refresh (Ctrl+Shift+R)

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
4. Check browser console for errors in root route logic
5. Verify session is valid
6. Check enrollment.program_access is 'unlocked'

## Maintenance

### Adding New Login Methods

If adding OAuth or other login methods:
1. Implement on LoginPage component only
2. Ensure entitlement check happens after authentication
3. Maintain root route's intelligent view switching
4. Update LoginPage UI accordingly
5. Test with root route logic to ensure proper view selection

### Changing Redirect URLs

When deploying to different domains:
1. Update `handleLoginClick` in App.tsx (marketing site redirect)
2. Update hostname detection in root route logic
3. Update LoginPage redirect URLs after successful login
4. Update ProtectedApp redirect URLs
5. Update documentation

### Modifying Root Route Logic

To change the root route's behavior:
1. Update the `isAppDomain` and `isRootRoute` checks in App.tsx
2. Modify the view selection logic in the useEffect
3. Test all combinations:
   - No session → login UI
   - Session + access → dashboard
   - Session + no access → pricing redirect
4. Verify localhost development works correctly

### Modifying Access Control

To change access logic:
1. Update entitlement check query in LoginPage
2. Update hasActiveAccess logic in AuthContext
3. Update root route access checks in App.tsx
4. Update ProtectedApp access checks
5. Ensure RLS policies match new logic

---

For general system architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)
For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
