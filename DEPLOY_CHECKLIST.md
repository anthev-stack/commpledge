# 🚀 Quick Deployment Checklist

Use this checklist when deploying to Vercel.

## ✅ Pre-Deployment

- [x] ✅ Code pushed to GitHub: https://github.com/anthev-stack/commpledge.git
- [ ] Vercel account created
- [ ] Database provider chosen (see options below)
- [ ] Production environment variables ready

---

## 📊 Recommended Database: Neon PostgreSQL

**Why Neon?**
- ✅ Best free tier (512MB, unlimited projects)
- ✅ Serverless (perfect for Vercel)
- ✅ No credit card required
- ✅ 5-minute setup

**Setup:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up (can use GitHub)
3. Create new project → Copy connection string
4. Use in Vercel (step below)

**Alternative:** Vercel Postgres (integrated, but smaller free tier)

---

## 🌐 Deploy to Vercel

### Step 1: Import Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Select: **anthev-stack/commpledge**
4. Click "Import"

### Step 2: Configure Build Settings

✅ Auto-detected (Next.js) - No changes needed

### Step 3: Add Environment Variables

**COPY THESE INTO VERCEL:**

```env
# Database (Get from Neon or your database provider)
DATABASE_URL=postgresql://user:password@host/database

# NextAuth (Generate new secret!)
NEXTAUTH_SECRET=GENERATE_NEW_SECRET_HERE
NEXTAUTH_URL=https://your-app.vercel.app

# Discord OAuth (Update with production callback)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# hCaptcha (Use production keys)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_production_site_key
HCAPTCHA_SECRET_KEY=your_production_secret_key
```

**Generate NEXTAUTH_SECRET:**
```powershell
$bytes = New-Object byte[] 32; [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

### Step 4: Deploy!

Click "Deploy" and wait ~2 minutes ⏱️

---

## 🔧 Post-Deployment Tasks

### 1. Run Database Migration

**Option A: Locally**
```bash
# Set production database URL
$env:DATABASE_URL="your-neon-connection-string"

# Run migration
npx prisma migrate deploy

# Reset local env
$env:DATABASE_URL="file:./dev.db"
```

**Option B: Via Prisma Studio**
```bash
$env:DATABASE_URL="your-neon-connection-string"
npx prisma studio
# Tables will be created automatically
```

### 2. Update Discord OAuth

1. [Discord Developer Portal](https://discord.com/developers/applications)
2. Your Application → OAuth2 → Redirects
3. Add: `https://your-app.vercel.app/api/auth/callback/discord`
4. Save

### 3. Update hCaptcha

1. [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Your Sites → Add Domain
3. Add: `your-app.vercel.app`
4. Update env vars with production keys

### 4. Update NEXTAUTH_URL

1. Get your Vercel deployment URL
2. Vercel Dashboard → Settings → Environment Variables
3. Update `NEXTAUTH_URL` to: `https://your-actual-url.vercel.app`
4. Redeploy

---

## ✅ Testing Your Deployment

1. **Homepage:** Visit `https://your-app.vercel.app`
2. **Registration:** Create a test account
3. **Discord Login:** Test OAuth flow
4. **Dashboard:** Access when logged in
5. **Users Page:** View user listing
6. **Profile:** Click on a user

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check `DATABASE_URL` in Vercel env vars |
| NextAuth error | Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` |
| Discord login fails | Update callback URL in Discord app |
| hCaptcha not showing | Use production keys, add domain |
| Tables don't exist | Run `prisma migrate deploy` |

---

## 📱 Your Deployed App

Once deployed, share your app:
```
🌐 https://your-app.vercel.app
📦 GitHub: https://github.com/anthev-stack/commpledge
```

---

## 🔄 Future Deployments

Push to GitHub and Vercel auto-deploys:
```bash
git add .
git commit -m "Your updates"
git push
```

Vercel rebuilds automatically! ✨

---

## 📚 Full Documentation

- **Detailed Guide:** See `VERCEL_DEPLOYMENT.md`
- **Database Options:** 5 different providers compared
- **Troubleshooting:** Common issues and solutions

---

## 💡 Pro Tips

1. **Monitor Costs:** Check Vercel & database usage monthly
2. **Backups:** Most database providers auto-backup
3. **Analytics:** Enable Vercel Analytics for insights
4. **Domains:** Add custom domain in Vercel settings
5. **Preview:** PRs get automatic preview deployments

---

**Estimated Deployment Time:** 10-15 minutes ⏱️

**Total Cost (Free Tier):** $0/month 💰

---

🎉 **Ready to deploy? Let's go!**


