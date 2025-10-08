# Setup Guide

## Quick Start

Follow these steps to get Community Pledges running on your local machine.

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
# On Windows (PowerShell)
Copy-Item .env.example .env

# On macOS/Linux
cp .env.example .env
```

Then edit the `.env` file with your actual values.

### 3. Generate NextAuth Secret

Run this command to generate a secure secret:

**Windows (PowerShell):**
```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**macOS/Linux:**
```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET` in your `.env` file.

### 4. Configure Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "OAuth2" in the sidebar
4. Click "Add Redirect" and add:
   ```
   http://localhost:3000/api/auth/callback/discord
   ```
5. Copy your "Client ID" and "Client Secret" to your `.env` file

### 5. Configure hCaptcha

**For Development (Testing):**

Use the test keys in your `.env`:
```env
NEXT_PUBLIC_HCAPTCHA_SITE_KEY="10000000-ffff-ffff-ffff-000000000001"
HCAPTCHA_SECRET_KEY="0x0000000000000000000000000000000000000000"
```

**For Production:**

1. Sign up at [hCaptcha.com](https://www.hcaptcha.com/)
2. Create a new site
3. Get your Site Key and Secret Key
4. Update your `.env` file

### 6. Set Up Database

Run the Prisma migration to create your database:

```bash
npm run db:migrate
```

When prompted, enter a migration name like "init" or press Enter to use the default.

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Common Issues

### Issue: "Module not found" errors

**Solution:** Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database errors

**Solution:** Reset the database:
```bash
rm prisma/dev.db
npm run db:migrate
```

### Issue: NextAuth errors

**Solution:** Make sure these environment variables are set:
- `NEXTAUTH_SECRET` - A random secret string
- `NEXTAUTH_URL` - Should be `http://localhost:3000` for development

### Issue: Discord login not working

**Solution:** 
1. Check that your Discord app has the correct redirect URL
2. Verify your Client ID and Client Secret are correct
3. Make sure the Discord app is not in "Bot" mode - it should be an OAuth2 app

### Issue: hCaptcha not showing

**Solution:**
1. Check that `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is set (must start with `NEXT_PUBLIC_`)
2. For development, use the test key: `10000000-ffff-ffff-ffff-000000000001`
3. Clear your browser cache and reload

## Useful Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Open Prisma Studio (database GUI)
npm run db:studio

# Create a new database migration
npm run db:migrate

# Push schema changes without migration
npm run db:push
```

## Testing the Application

### Test User Registration

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Fill in the form
3. Complete the hCaptcha
4. Click "Sign up"
5. You should be redirected to the dashboard

### Test Discord Login

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Click "Sign in with Discord"
3. Authorize the application
4. You should be redirected to the dashboard

### Test Protected Routes

Try accessing these URLs without logging in:
- `/dashboard` - Should redirect to login
- `/settings` - Should redirect to login

### Test Public Routes

These should work without authentication:
- `/` - Homepage
- `/users` - Users list
- `/users/[id]` - User profile

## Next Steps

Once your application is running:

1. ✅ Create a test account
2. ✅ Update your profile in Settings
3. ✅ Browse the Users page
4. ✅ View a user profile
5. 🚧 Wait for pledge features to be implemented

## Production Deployment

For production deployment:

1. Update all environment variables with production values
2. Use a production database (PostgreSQL recommended)
3. Set `NODE_ENV=production`
4. Run `npm run build`
5. Deploy to your hosting platform (Vercel, Railway, etc.)

## Need Help?

If you encounter any issues not covered here, please open an issue on the repository.

