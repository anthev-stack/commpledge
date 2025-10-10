# Vercel Deployment Guide

This guide will help you deploy Community Pledges to Vercel with a PostgreSQL database.

## 🎯 Overview

- **Platform:** Vercel (Optimal for Next.js)
- **Database:** PostgreSQL (Required for serverless)
- **Current Setup:** SQLite (Development only)

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Vercel account created ([vercel.com](https://vercel.com))
- [ ] PostgreSQL database provider chosen (see options below)
- [ ] Discord OAuth app configured with production callback URL
- [ ] hCaptcha production keys obtained

---

## 🗄️ Database Options for Production

### Option 1: Vercel Postgres (Recommended - Easiest)

**Pros:**
- Integrated with Vercel
- Automatic connection
- Free tier available
- Zero configuration

**Setup:**
1. In Vercel project → Storage → Create Database
2. Select PostgreSQL
3. Vercel automatically adds `POSTGRES_PRISMA_URL` to env variables
4. That's it! ✅

**Pricing:** Free tier: 256MB, 60 hours compute/month

---

### Option 2: Neon (Recommended - Best Free Tier)

**Pros:**
- Generous free tier (512MB, unlimited projects)
- Serverless PostgreSQL
- Very fast
- Auto-scaling

**Setup:**
1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

**Pricing:** Free tier: 512MB, 3 projects, no credit card required

---

### Option 3: Supabase (Recommended - Feature Rich)

**Pros:**
- 500MB free database
- Built-in auth (if you want to switch later)
- Real-time features
- Built-in storage

**Setup:**
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy "Connection Pooling" string (for Prisma)
5. Add to Vercel environment variables

**Pricing:** Free tier: 500MB, 2 projects

---

### Option 4: Railway

**Pros:**
- Easy to use
- Good free tier
- Can host entire app + database

**Setup:**
1. Sign up at [railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy `DATABASE_URL`
4. Add to Vercel environment variables

**Pricing:** Free tier: $5 credit/month

---

### Option 5: ElephantSQL

**Pros:**
- Simple setup
- Dedicated free tier

**Setup:**
1. Sign up at [elephantsql.com](https://www.elephantsql.com)
2. Create new instance (Tiny Turtle - Free)
3. Copy connection string
4. Add to Vercel environment variables

**Pricing:** Free tier: 20MB

---

## 🚀 Deployment Steps

### Step 1: Update Prisma for PostgreSQL

**Already configured!** Your `prisma/schema.prisma` supports both SQLite (dev) and PostgreSQL (prod).

Just make sure your `.env` uses the right `DATABASE_URL` for each environment.

### Step 2: Choose Your Database Provider

Pick one from the options above. **Recommendation:** Neon or Vercel Postgres for easiest setup.

### Step 3: Get Your Database Connection String

Format should be:
```
postgresql://username:password@host:5432/database?schema=public
```

For connection pooling (recommended for serverless):
```
postgresql://username:password@host:5432/database?schema=public&pgbouncer=true
```

### Step 4: Deploy to Vercel

#### Method A: Via Vercel Dashboard (Easiest)

1. **Go to [vercel.com/new](https://vercel.com/new)**

2. **Import Git Repository**
   - Connect your GitHub account
   - Select the `commpledge` repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   # Database (MOST IMPORTANT)
   DATABASE_URL=your-postgresql-connection-string-here

   # NextAuth
   NEXTAUTH_SECRET=generate-new-secret-for-production
   NEXTAUTH_URL=https://your-app-name.vercel.app

   # Discord OAuth
   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret

   # hCaptcha (Production Keys)
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-production-site-key
   HCAPTCHA_SECRET_KEY=your-production-secret-key
   ```

5. **Click "Deploy"**

6. **Run Database Migration**
   
   After first deployment, you need to create database tables:
   
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Make sure `DATABASE_URL` is set
   - Go to Deployments → Latest → Three dots → "Redeploy"
   - OR run migration locally (see below)

#### Method B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts to configure
# Add environment variables when prompted
```

---

## 🔧 Database Migration

### Option A: Migrate Locally to Production Database

```bash
# In your local project folder

# Set production database URL temporarily
$env:DATABASE_URL="your-production-postgresql-url"

# Run migration
npx prisma migrate deploy

# Or create and apply new migration
npx prisma migrate dev

# Don't forget to reset your local DATABASE_URL after!
$env:DATABASE_URL="file:./dev.db"
```

### Option B: Migrate via Vercel Build Hook

Add this to your `package.json`:

```json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build --turbopack",
}
```

**⚠️ Warning:** This runs migrations on every deployment. Use carefully!

### Option C: Use Prisma Studio (Manual)

```bash
# Connect to production database
$env:DATABASE_URL="your-production-postgresql-url"
npx prisma studio

# You can manually inspect/modify data
```

---

## 🔐 Update OAuth Callback URLs

### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. OAuth2 → Redirects
4. Add: `https://your-app-name.vercel.app/api/auth/callback/discord`
5. Save changes

### hCaptcha

1. Go to [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Your Sites → Add Domain
3. Add: `your-app-name.vercel.app`
4. Use production keys in Vercel env variables

---

## ✅ Post-Deployment Verification

1. **Visit Your Site**
   - `https://your-app-name.vercel.app`
   - Check homepage loads

2. **Test Registration**
   - Create new account with email/password
   - Verify hCaptcha works
   - Check user appears in database

3. **Test Discord Login**
   - Click "Sign in with Discord"
   - Authorize app
   - Verify redirects back correctly

4. **Test Protected Routes**
   - Try accessing `/dashboard`
   - Should redirect to login if not authenticated
   - Should work when logged in

5. **Test User Profiles**
   - Visit `/users`
   - Click on a user
   - Verify profile loads

6. **Check Logs**
   - Vercel Dashboard → Your Project → Deployments → Latest → Logs
   - Look for any errors

---

## 🐛 Common Issues

### Issue: "Invalid `prisma.user.findUnique()` invocation"

**Cause:** Database tables don't exist

**Solution:** Run migrations
```bash
npx prisma migrate deploy
```

---

### Issue: "Can't reach database server"

**Cause:** Wrong `DATABASE_URL` or database is down

**Solution:**
1. Verify connection string in Vercel env variables
2. Test connection locally
3. Check database provider status

---

### Issue: "NEXTAUTH_URL environment variable is not set"

**Solution:** Add to Vercel env variables:
```
NEXTAUTH_URL=https://your-app-name.vercel.app
```

---

### Issue: Discord OAuth not working

**Solution:**
1. Check callback URL in Discord app settings
2. Verify `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` in Vercel
3. Check `NEXTAUTH_URL` is correct

---

### Issue: hCaptcha not showing

**Solution:**
1. Use production keys (not test keys)
2. Add domain to hCaptcha dashboard
3. Check `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is set (must have `NEXT_PUBLIC_` prefix)

---

## 🔄 Continuous Deployment

Vercel automatically:
- ✅ Deploys when you push to `master`/`main` branch
- ✅ Creates preview deployments for PRs
- ✅ Runs builds and tests
- ✅ Updates your live site

To deploy updates:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically rebuild and deploy! 🚀

---

## 📊 Monitoring

### Vercel Analytics

- Enable in: Project Settings → Analytics
- Track page views, performance, etc.

### Database Monitoring

- **Neon:** Built-in dashboard with query stats
- **Supabase:** Table Editor + SQL Editor
- **Vercel Postgres:** Built-in dashboard
- **Prisma Studio:** `npx prisma studio` (connect to prod DB)

---

## 💰 Cost Estimation

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- 100 hours build time/month
- Unlimited deployments

**Database (Neon):**
- 512MB storage
- 3 projects
- Unlimited queries

**Total Cost for Small Project:** $0/month ✅

### When to Upgrade

Upgrade when you exceed:
- 1,000+ active users
- 10GB+ database
- Need custom domains
- Need more team members

---

## 🎯 Production Best Practices

1. **Environment Variables**
   - ✅ Use different secrets for production
   - ✅ Never commit `.env` files
   - ✅ Use Vercel's environment variable management

2. **Database**
   - ✅ Use connection pooling for PostgreSQL
   - ✅ Regular backups (most providers do this automatically)
   - ✅ Monitor database size

3. **Security**
   - ✅ Use strong `NEXTAUTH_SECRET`
   - ✅ Enable HTTPS (Vercel does this automatically)
   - ✅ Keep dependencies updated

4. **Performance**
   - ✅ Use Vercel's built-in CDN
   - ✅ Enable caching where appropriate
   - ✅ Monitor Core Web Vitals

---

## 🎓 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guides](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)

---

## 📞 Need Help?

1. Check Vercel build logs
2. Check database provider status
3. Review this guide's troubleshooting section
4. Vercel Support (for platform issues)
5. Database provider support (for DB issues)

---

## 🎉 You're Ready!

Once deployed, your app will be live at:
```
https://your-app-name.vercel.app
```

Share it with the world! 🚀


