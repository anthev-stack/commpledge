# GitHub Repository Setup Guide

✅ **Good news!** Your local Git repository is already initialized and committed.

Follow these steps to create the GitHub repository and push your code.

---

## Option 1: Create GitHub Repo via Web Interface (Recommended)

### Step 1: Create the Repository on GitHub

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Make sure you're logged in

2. **Create New Repository**
   - Click the `+` icon in the top right corner
   - Select "New repository"

3. **Configure Repository**
   - **Repository name:** `commpledge`
   - **Description:** (Optional) `Community Pledges - A platform for community commitments and pledges`
   - **Visibility:** Choose Public or Private
   - **⚠️ IMPORTANT:** Do NOT initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

### Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Run these commands in PowerShell (from the community-pledges directory)

# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/commpledge.git

# Push your code
git push -u origin master
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Option 2: Create GitHub Repo via GitHub CLI (Advanced)

If you have GitHub CLI installed (`gh`):

```powershell
# Create repository and push in one go
gh repo create commpledge --public --source=. --push

# Or for private repository
gh repo create commpledge --private --source=. --push
```

---

## Option 3: Use GitHub Desktop (Visual)

1. **Open GitHub Desktop**
2. **File → Add Local Repository**
3. Choose the `community-pledges` folder
4. **Publish repository** button
5. Name it `commpledge`
6. Choose public/private
7. Click "Publish repository"

---

## ✅ Verification Steps

After pushing, verify your repository:

1. Visit `https://github.com/YOUR_USERNAME/commpledge`
2. You should see all your files
3. README.md should display on the main page
4. Check that all documentation files are present

---

## 📁 What's Being Uploaded

Your repository includes:
- ✅ Complete Next.js application
- ✅ All source code (app/, components/, lib/)
- ✅ Configuration files (next.config.ts, tsconfig.json, etc.)
- ✅ Documentation (README.md, SETUP.md, QUICKSTART.md, etc.)
- ✅ Database schema (prisma/schema.prisma)
- ✅ Package configuration (package.json)

**Not included (via .gitignore):**
- ❌ node_modules/
- ❌ .env files (sensitive data)
- ❌ .next/ build files
- ❌ Database files (dev.db)

---

## 🔒 Security Checklist

Before making your repository public:

- [x] ✅ `.env` file is gitignored (already done)
- [x] ✅ No API keys in code (they're in .env)
- [x] ✅ No passwords in code (users create their own)
- [ ] ⚠️ Review `.env.example` - make sure no real keys are there
- [ ] ⚠️ If making public, remind users to use their own OAuth credentials

---

## 🎯 Quick Command Reference

```powershell
# Check your current remote
git remote -v

# Add remote (if not added)
git remote add origin https://github.com/YOUR_USERNAME/commpledge.git

# Push to GitHub
git push -u origin master

# Check status
git status

# View commit history
git log --oneline
```

---

## 🔄 Future Updates

When you make changes:

```powershell
# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## 🐛 Troubleshooting

### Error: "remote origin already exists"
```powershell
# Remove existing remote
git remote remove origin

# Add the correct one
git remote add origin https://github.com/YOUR_USERNAME/commpledge.git
```

### Error: "failed to push some refs"
```powershell
# Pull first (if repository has changes)
git pull origin master --allow-unrelated-histories

# Then push
git push -u origin master
```

### Error: Authentication failed
You may need to:
1. Use a Personal Access Token instead of password
2. Set up SSH keys
3. Use GitHub CLI (`gh auth login`)

**To create a Personal Access Token:**
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select `repo` scope
4. Use token as password when pushing

### Branch naming: main vs master
If GitHub uses `main` as default:
```powershell
# Rename your branch
git branch -M main

# Push to main branch
git push -u origin main
```

---

## 📝 Recommended: Update Repository Settings

After pushing, consider:

1. **Add Topics** (on GitHub repo page)
   - nextjs
   - typescript
   - authentication
   - prisma
   - tailwindcss

2. **Enable Issues** (for bug tracking)

3. **Set up Branch Protection** (if working with team)

4. **Add Repository Description**
   - "Community Pledges - A modern web app for community commitments with authentication, user profiles, and dashboard"

5. **Set Repository Website**
   - Link to your deployed version (if you deploy)

---

## 🚀 Next Steps After Upload

1. **Deploy Your Application**
   - Vercel (recommended for Next.js)
   - Railway
   - Netlify
   - DigitalOcean App Platform

2. **Update Documentation**
   - Add deployment URL to README
   - Update NEXTAUTH_URL in deployment

3. **Set Up GitHub Actions** (optional)
   - Automated testing
   - Automatic deployments

---

## ✨ Your Repository is Ready!

Once pushed, your repository will be live at:
```
https://github.com/YOUR_USERNAME/commpledge
```

Share it with the world! 🎉

---

## 📞 Need Help?

- [GitHub Docs - Creating a Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [GitHub Docs - Pushing to GitHub](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)
- [GitHub CLI Documentation](https://cli.github.com/)

