# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- A code editor (VS Code recommended)

## Installation Steps

### 1. Install Dependencies (1 minute)
```bash
npm install
```

### 2. Create Environment File (30 seconds)
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

### 3. Edit `.env` File (2 minutes)

**Required Changes:**
- Generate a secret for `NEXTAUTH_SECRET` (run the command below)
- Set Discord OAuth credentials (or skip Discord login for now)
- Set hCaptcha keys (or use test keys)

**Generate Secret:**
```powershell
# Windows PowerShell
$bytes = New-Object byte[] 32; [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)

# macOS/Linux
openssl rand -base64 32
```

**For Quick Testing:**
Leave the default values in `.env.example` and just add your generated secret to `NEXTAUTH_SECRET`.

### 4. Setup Database (30 seconds)
```bash
npm run db:migrate
```
Press Enter when prompted for migration name.

### 5. Start Development Server (10 seconds)
```bash
npm run dev
```

### 6. Open Browser
Go to: http://localhost:3000

## Test the Application

### Create an Account
1. Click "Sign Up"
2. Fill in: Name, Email, Password
3. Complete the captcha
4. Click "Sign up"

### Explore Features
- ✅ Dashboard - Your personal dashboard
- ✅ Settings - Update your profile
- ✅ Users - Browse community members
- ✅ User Profiles - Click on any user

## Optional: Discord Login

To enable Discord login:

1. Visit [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. OAuth2 → Add Redirect: `http://localhost:3000/api/auth/callback/discord`
4. Copy Client ID and Secret to `.env`

## Optional: Production hCaptcha

The default test keys work for development. For production:

1. Sign up at [hCaptcha.com](https://www.hcaptcha.com/)
2. Create a site
3. Copy Site Key and Secret Key to `.env`

## Troubleshooting

**Issue: Can't start dev server**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue: Database error**
```bash
rm prisma/dev.db
npm run db:migrate
```

**Issue: NextAuth error**
Make sure `NEXTAUTH_SECRET` is set in `.env`

## What's Next?

- ✅ All basic features are working
- 🚧 Pledge creation coming soon
- 🚧 More community features planned

## Getting Help

- Check `README.md` for full documentation
- Check `SETUP.md` for detailed setup instructions
- Open an issue on the repository

Enjoy using Community Pledges! 🎉


