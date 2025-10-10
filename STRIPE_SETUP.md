# Stripe Setup Guide for Donation System

This guide will help you set up Stripe for accepting donations and paying out to server owners.

## 🎯 What You're Setting Up

- **Stripe Payments**: Accept donations from players
- **Stripe Connect**: Pay out donations to server owners (no business account required!)
- **Stripe Webhooks**: Track payment status

---

## 📝 Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Sign up"
3. Create your account
4. Verify your email

---

## 🔑 Step 2: Get Your API Keys

### For Development (Test Mode):

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Make sure you're in **TEST MODE** (toggle in top right)
3. Go to **Developers** → **API keys**
4. You'll see:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_` - click "Reveal")

### Add to Your `.env` File:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

---

## 🔗 Step 3: Enable Stripe Connect

Stripe Connect allows server owners to receive money directly.

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Settings** (gear icon)
3. Click **Connect** in the left sidebar
4. Click **Get Started** on Stripe Connect
5. Choose **Express** (easiest, no business account required)
6. Fill in your platform details:
   - **Platform name**: Community Pledges (or your name)
   - **Description**: Donation platform for game servers
   - **Category**: Crowdfunding/Donations
7. Save settings

---

## 🪝 Step 4: Set Up Webhooks (After Deployment)

Webhooks notify your app when payments succeed/fail.

### For Local Development:

1. Install Stripe CLI: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Run:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

### For Production (Vercel):

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Enter your endpoint URL:
   ```
   https://your-app.vercel.app/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `account.external_account.created`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

---

## 🌐 Step 5: Add to Vercel

After deployment, add these to Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   STRIPE_SECRET_KEY=sk_live_your_live_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

---

## 💰 How It Works

### For Server Owners (Receiving Donations):

1. **Create a Server** listing on your platform
2. **Connect Stripe Account**:
   - Click "Connect Stripe" in dashboard
   - Complete Stripe Express onboarding (5 minutes)
   - No business registration required!
3. **Receive Donations**:
   - Donations go directly to their connected Stripe account
   - Payouts happen automatically (default: daily)

### For Donors (Making Donations):

1. Browse game servers
2. Click "Donate"
3. Enter amount and optional message
4. Pay with credit card (via Stripe Checkout)
5. Money goes directly to server owner

### Platform Fee (Optional):

You can take a small platform fee (e.g., 5%) by configuring `application_fee_amount` in the payment intent. This is optional!

---

## 🧪 Testing

### Test Cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any:
- Future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any ZIP code

---

## 🚨 Going Live

### When ready for production:

1. **Complete Stripe Activation**:
   - Go to Stripe Dashboard
   - Click "Activate your account"
   - Provide business details
   - Add bank account

2. **Switch to Live Mode**:
   - Toggle from "Test mode" to "Live mode" in Stripe Dashboard
   - Get new live API keys (start with `pk_live_` and `sk_live_`)
   - Update Vercel environment variables

3. **Test Everything**:
   - Make a real $1 donation
   - Verify server owner receives payout
   - Check webhook is working

---

## 📊 Stripe Connect Express Benefits

✅ **For Server Owners:**
- No business account required
- Simple onboarding (5 minutes)
- Accept payments as an individual
- Automatic payouts to bank account
- Stripe handles all compliance

✅ **For Your Platform:**
- Stripe handles all KYC/verification
- No liability for fraudulent payments
- Stripe manages disputes/chargebacks
- Easy integration

---

## 💡 Key Features

- **Direct Payouts**: Money goes directly to server owners
- **No Business Account**: Server owners can use personal accounts
- **Platform Fee**: Optional - take a small cut to cover costs
- **Automatic Payouts**: Daily/weekly/monthly (configurable)
- **Tax Forms**: Stripe handles 1099s automatically
- **Multiple Currencies**: Support international donors

---

## 🔐 Security

- All card data handled by Stripe (PCI compliant)
- Never touch sensitive payment info
- Stripe Connect handles identity verification
- Webhooks are signed and verified

---

## 📞 Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Connect Guide](https://stripe.com/docs/connect)
- [Stripe Support](https://support.stripe.com)

---

## 🎯 Quick Start Checklist

- [ ] Create Stripe account
- [ ] Get test API keys
- [ ] Add keys to `.env`
- [ ] Enable Stripe Connect (Express)
- [ ] Test creating a server
- [ ] Test Stripe Connect onboarding
- [ ] Test making a donation
- [ ] Set up webhooks
- [ ] Go live with production keys

---

**You're all set!** Server owners can now receive donations through Stripe Connect Express without needing a business account.

