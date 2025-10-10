# Testing Checklist

Use this checklist to verify all features are working correctly.

## ✅ Initial Setup

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with all required variables
- [ ] Database migrated (`npm run db:migrate`)
- [ ] Development server starts without errors (`npm run dev`)

## 🏠 Homepage Tests

- [ ] Homepage loads at `http://localhost:3000`
- [ ] Hero section displays correctly
- [ ] Feature cards are visible
- [ ] "Get Started" button links to `/register`
- [ ] "Sign In" button links to `/login`
- [ ] Page is responsive (test mobile, tablet, desktop)

## 🔐 Authentication Tests

### Email Registration
- [ ] Navigate to `/register`
- [ ] Form validates required fields
- [ ] Password mismatch shows error
- [ ] hCaptcha displays correctly
- [ ] Can submit form only after completing captcha
- [ ] Successful registration redirects to dashboard
- [ ] User appears in database (check with `npm run db:studio`)

### Email Login
- [ ] Navigate to `/login`
- [ ] Can log in with registered email/password
- [ ] Invalid credentials show error
- [ ] Successful login redirects to dashboard
- [ ] Session persists on page refresh

### Discord OAuth
- [ ] "Sign in with Discord" button is visible
- [ ] Clicking button redirects to Discord
- [ ] Can authorize application
- [ ] Redirects back to dashboard after auth
- [ ] Profile picture loads from Discord
- [ ] User created in database with Discord data

### Logout
- [ ] "Sign Out" button appears when logged in
- [ ] Clicking "Sign Out" logs user out
- [ ] Redirects to homepage after logout
- [ ] Session is cleared

## 📊 Dashboard Tests

- [ ] Can access `/dashboard` when logged in
- [ ] Redirects to login when not authenticated
- [ ] Displays user's name or email
- [ ] Profile card links to `/settings`
- [ ] Community card links to `/users`
- [ ] Getting started guide is visible
- [ ] All links work correctly

## ⚙️ Settings Page Tests

- [ ] Can access `/settings` when logged in
- [ ] Redirects to login when not authenticated
- [ ] Profile picture/avatar displays correctly
- [ ] Current name is pre-filled in form
- [ ] Email field is disabled (can't be changed)
- [ ] Can update display name
- [ ] Success message shows after update
- [ ] Changes persist on page refresh
- [ ] Error handling works (try empty name)

## 👥 Users Listing Tests

- [ ] Can access `/users` (public route)
- [ ] All users are displayed
- [ ] User cards show:
  - [ ] Profile picture or avatar
  - [ ] Name
  - [ ] Email
  - [ ] Join date
- [ ] Grid layout is responsive
- [ ] Clicking user card navigates to profile
- [ ] Shows message when no users exist

## 👤 User Profile Tests

- [ ] Can access `/users/[id]` with valid user ID
- [ ] Profile header displays with gradient
- [ ] Profile picture/avatar shows correctly
- [ ] User information displays:
  - [ ] User ID
  - [ ] Display name
  - [ ] Email
  - [ ] Member since date
- [ ] "Back to Users" link works
- [ ] Invalid user ID shows 404 page
- [ ] 404 page has "Back to Users" button

## 🔒 Security Tests

### Route Protection
- [ ] `/dashboard` redirects to login when not authenticated
- [ ] `/settings` redirects to login when not authenticated
- [ ] `/users` is accessible without authentication
- [ ] `/users/[id]` is accessible without authentication

### API Protection
- [ ] `/api/user/update` requires authentication
- [ ] Trying to update without auth returns 401
- [ ] Can't access other users' data

### Input Validation
- [ ] Registration validates email format
- [ ] Registration requires password (min 6 characters)
- [ ] Password confirmation must match
- [ ] hCaptcha is required for registration
- [ ] Form sanitizes inputs (no XSS)

## 🎨 UI/UX Tests

### Responsive Design
- [ ] Mobile view (< 640px)
  - [ ] Navbar is usable
  - [ ] Cards stack vertically
  - [ ] Text is readable
- [ ] Tablet view (640px - 1024px)
  - [ ] Grid layouts adapt
  - [ ] Navigation is clear
- [ ] Desktop view (> 1024px)
  - [ ] Full layout displays
  - [ ] Proper spacing

### Visual Feedback
- [ ] Buttons show hover states
- [ ] Forms show loading states
- [ ] Error messages are clear
- [ ] Success messages display
- [ ] Links have hover effects

### Navigation
- [ ] Navbar shows correct items when logged out
- [ ] Navbar shows correct items when logged in
- [ ] All navigation links work
- [ ] Active page indication (if implemented)

## 🌐 Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Development Tools

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm run db:studio` opens Prisma Studio
- [ ] No console errors in browser
- [ ] No console warnings (except known hCaptcha)

## 📱 Mobile-Specific Tests

- [ ] Touch interactions work
- [ ] Forms are usable on mobile keyboard
- [ ] Images load correctly
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming

## 🚀 Performance Tests

- [ ] Pages load quickly (< 3 seconds)
- [ ] Images are optimized
- [ ] No layout shift on load
- [ ] Smooth transitions/animations
- [ ] Database queries are efficient

## 🧪 Edge Cases

- [ ] Very long usernames display correctly
- [ ] Very long email addresses display correctly
- [ ] Special characters in names work
- [ ] Multiple rapid form submissions handled
- [ ] Expired sessions handled gracefully
- [ ] Network errors show user-friendly messages

## 📝 Data Validation

- [ ] User data saves correctly to database
- [ ] Passwords are hashed (check in database)
- [ ] Dates are stored in correct format
- [ ] Profile pictures from OAuth load correctly
- [ ] Email uniqueness is enforced

## 🔄 Session Tests

- [ ] Session persists across page reloads
- [ ] Multiple tabs share same session
- [ ] Session expires appropriately
- [ ] Can log in from multiple devices

## 🎯 Feature-Specific Tests

### hCaptcha
- [ ] Displays correctly on registration
- [ ] Test keys work in development
- [ ] Form can't be submitted without completion
- [ ] Resets on form error
- [ ] Expires after timeout

### Discord OAuth
- [ ] Avatar loads from Discord CDN
- [ ] Discord username populates name field
- [ ] Can link Discord to existing account
- [ ] Proper error handling if Discord is down

### Profile Pictures
- [ ] Discord avatars display correctly
- [ ] Fallback initials show for users without pictures
- [ ] Images are properly sized
- [ ] Circular border displays correctly

## ✨ Polish Checks

- [ ] No spelling errors
- [ ] Consistent branding
- [ ] Professional appearance
- [ ] Loading states everywhere needed
- [ ] Proper error messages
- [ ] Accessibility (keyboard navigation)
- [ ] Color contrast is sufficient

## 🐛 Known Issues Verification

- [ ] hCaptcha build warning is expected (doesn't affect functionality)
- [ ] SQLite is for development only (note for production)

---

## 📊 Testing Report Template

After testing, record your results:

### Test Date: _____________
### Tested By: _____________
### Environment: _____________

**Passed:** __ / __
**Failed:** __ / __
**Skipped:** __ / __

**Issues Found:**
1. _____________________
2. _____________________
3. _____________________

**Notes:**
_________________________
_________________________
_________________________

---

**Tip:** Test regularly during development to catch issues early!


