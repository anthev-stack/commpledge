# 🎯 Community Pledges System - Complete Guide

## Overview

This is a smart crowdfunding platform for game servers that uses an **optimization algorithm** to reduce costs when pledges exceed requirements. The more people who pledge, the less everyone pays!

---

## 💡 How It Works

### The Magic: Smart Cost Optimization

When players pledge to support a server, the system automatically calculates the optimal amount to charge each person:

**Example:**
```
Server Cost: $30/month
Pledgers:
- Alice pledges $15
- Bob pledges $10  
- Carol pledges $8
- Dave pledges $5
Total: $38 (exceeds $30!)

Smart Optimization:
- Alice pays: $11.53 (saves $3.47!)
- Bob pays: $7.87 (saves $2.13!)
- Carol pays: $6.40 (saves $1.60!)
- Dave pays: $4.20 (saves $0.80!)
Total charged: $30 exactly

Everyone saves money! 🎉
```

---

## 🔢 The Algorithm

### Four Scenarios:

**1. Under-funded** (Total < Server Cost)
- Users pay exactly what they pledged
- Still accepting more pledges

**2. Exactly funded** (Total = Server Cost)
- Users pay exactly what they pledged
- Still accepting more pledges

**3. Over-funded** (Total > Server Cost)
- **Optimization kicks in!**
- Excess distributed as savings
- Higher pledgers get proportionally more savings
- Everyone pays less than they pledged

**4. At capacity** (Max people reached)
- Everyone pays minimum ($2)
- Not accepting new pledges

### Capacity Calculation:
```
Max People = Server Cost / $2 (minimum)
Example: $30 server = 15 max people
```

---

## 💰 Fee Structure

**Platform Fee: 2%** (reduced from 5%)
**Stripe Fee: 2.9% + $0.30**

### Example Breakdown:

**User pledges $10/month:**
```
Pledge amount:           $10.00
Platform fee (2%):       -$0.20
Stripe fee (2.9%+$0.30): -$0.59
───────────────────────────────
Server owner receives:    $9.21
```

---

## 📅 Payment Schedule

### How Monthly Charging Works:

1. **Server Owner** sets a **withdrawalDay** (day 1-28 of month)
2. **System charges pledgers** 2 days BEFORE withdrawal day
3. **Money arrives** in server owner's bank 2-5 days later

**Example:**
```
Withdrawal Day: 15th of month
Charge Date: 13th of month  
Money arrives: 15th-20th of month
```

### Why 2 Days Before?
Ensures money is processed and available when server owner needs it for hosting payment.

---

## 🎮 User Roles

The system has 5 user roles:

| Role | Can Pledge | Can Create Servers | Access |
|------|-----------|-------------------|---------|
| **USER** | ✅ Yes | ✅ Yes | Standard |
| **MODERATOR** | ✅ Yes | ✅ Yes | Can moderate |
| **ADMIN** | ✅ Yes | ✅ Yes | Full access |
| **SUSPENDED** | ❌ No | ❌ No | Limited |
| **BANNED** | ❌ No | ❌ No | Blocked |

### Suspension System:

**Failed Payments:**
- Track failed payment attempts
- After **3 failures** → Auto-suspend
- Suspended users cannot pledge
- Existing pledges cancelled

**Suspension Process:**
1. Payment fails → Counter increments
2. Counter reaches 3 → Account suspended
3. User notified (email)
4. Must contact admin to resolve

---

## 📊 Pledge Constraints

- **Minimum Pledge:** $2.00/month
- **Maximum Pledge:** $30.00/month
- **One pledge per user per server**
- **Must have payment method** saved before pledging
- **Suspended/banned users** cannot pledge

---

## 🔄 Monthly Processing (Automated)

### Vercel Cron Job

**Runs:** Daily at midnight (0 0 * * *)
**Location:** `/api/cron/process-withdrawals`

### What It Does:

1. **Find servers** with `withdrawalDay` = today + 2
2. **Get all active pledges** for those servers
3. **Calculate optimized costs** for each pledge
4. **Charge each pledger** using saved payment method
5. **Transfer funds** to server owner's Stripe Connect account
6. **Handle failures** and suspend if needed
7. **Create withdrawal record** for tracking
8. **Log all activity** for audit trail

### Security:

Cron endpoint protected by `CRON_SECRET` environment variable.

---

## 🎨 UI Features

### For Server Owners:

**Server Creation** (`/dashboard/server/create`):
- Set server name, game type
- **Set monthly cost** (required)
- **Choose withdrawal day** (1-28)
- Add description, IP, image

**Server Management:**
- View pledge count
- See total pledged vs cost
- Track optimization savings
- View pledger list
- Monitor withdrawals

### For Pledgers:

**Pledge Modal:**
- Shows current pledgers/capacity
- Select pledge amount ($2-$30)
- **See estimated payment** after optimization
- Shows potential savings
- Instant pledge creation

**Pledge Management:**
- View current pledges
- See what you'll actually pay
- Cancel pledges anytime
- Track savings from optimization

### Public Pages:

**Server Browse** (`/servers`):
- Filter by game type
- See pledge progress
- Shows capacity (X/Y slots filled)
- Progress bars

**Server Detail** (`/servers/[id]`):
- Full server information
- Pledge progress visualization
- Recent pledgers list
- "Make a Pledge" button

---

## 🔐 Payment Method Requirements

### For Pledgers:
**Must** save payment method in Settings BEFORE pledging:
1. Go to Settings → Payment Methods
2. Add a card (saved securely by Stripe)
3. Then can pledge to servers

### For Server Owners:
**Must** connect Stripe payout account in Settings:
1. Select country
2. Connect Stripe Express account
3. Complete onboarding (bank details, ID verification)
4. Then can create servers and receive payouts

---

## 📈 Optimization Examples

### Scenario 1: Early Stage (Under-funded)
```
Server: $30/month
Pledges: $10, $5, $8 = $23 total

Charges:
- $10 pledger pays: $10
- $5 pledger pays: $5
- $8 pledger pays: $8

Total: $23 (need $7 more)
Status: Accepting pledges
```

### Scenario 2: Fully Funded
```
Server: $30/month
Pledges: $15, $10, $5 = $30 total

Charges:
- $15 pledger pays: $15
- $10 pledger pays: $10
- $5 pledger pays: $5

Total: $30 exactly
Status: Accepting more pledges (optimization will kick in)
```

### Scenario 3: Optimized (Best Case!)
```
Server: $30/month
Pledges: $15, $10, $8, $7, $5 = $45 total
Excess: $15

Optimization reduces costs:
- $15 pledger pays: $10.00 (saves $5.00!)
- $10 pledger pays: $6.67 (saves $3.33!)
- $8 pledger pays: $5.33 (saves $2.67!)
- $7 pledger pays: $4.67 (saves $2.33!)
- $5 pledger pays: $3.33 (saves $1.67!)

Total: $30 exactly
Everyone saves! Total savings: $15 distributed fairly
Status: Accepting more (up to 15 people)
```

### Scenario 4: Maximum Capacity
```
Server: $30/month
Pledgers: 15 people (max)
All amounts: various

Charges:
Everyone pays: $2 (minimum)
Total: $30

Status: NOT accepting (at capacity)
```

---

## 🛠️ Technical Implementation

### Key Files:

**Algorithm:**
- `lib/optimization.ts` - Core optimization algorithm
- `lib/constants.ts` - Fee calculations and limits

**API Endpoints:**
- `POST /api/servers/[id]/pledge` - Create pledge
- `DELETE /api/servers/[id]/pledge` - Cancel pledge
- `GET /api/servers/[id]/pledge` - Get status
- `GET /api/cron/process-withdrawals` - Monthly processing (Vercel Cron)

**Database Models:**
- `Pledge` - Monthly pledges
- `Withdrawal` - Monthly withdrawal records
- `ActivityLog` - Audit trail
- `User` - Includes roles and payment failure tracking
- `Server` - Includes cost and withdrawalDay

---

## 🎯 Key Features

✅ **Smart Optimization** - Automatic cost reduction
✅ **Monthly Recurring** - Automated charging
✅ **Payment Failure Handling** - 3 strikes = suspension
✅ **User Roles** - Moderation system built-in
✅ **Capacity Management** - Max pledgers enforced
✅ **Fair Distribution** - Proportional savings
✅ **Secure Payments** - Stripe integration
✅ **Direct Payouts** - Money goes to server owners
✅ **Activity Logging** - Full audit trail
✅ **Multi-Country Support** - 41 countries

---

## 🚀 User Journey

### Server Owner:
1. Sign up → Select country
2. Connect Stripe Express (bank details)
3. Create server listing
4. Set monthly cost & withdrawal day
5. Share with community
6. Receive automatic monthly payouts!

### Pledger:
1. Sign up → Select country
2. Add payment method (card)
3. Browse servers
4. Pledge $2-$30/month
5. See estimated cost (with optimization)
6. Auto-charged monthly
7. Save money as more people join!

---

## 📊 Benefits

### For Pledgers:
- Pay less when more people join
- Transparent cost breakdown
- Cancel anytime
- Secure payment storage
- Support favorite servers

### For Server Owners:
- Predictable monthly income
- No business account needed
- Automatic payments
- Direct bank deposits
- Community engagement

### For Platform:
- 2% sustainable fee
- Automated processing
- Minimal overhead
- Scalable system

---

## 🔮 Future Enhancements

Ready to build:
- Staff dashboard for admins/moderators
- Currency converter for international display
- Email notifications for charges
- Discord webhooks for pledges
- Server analytics/stats
- Pledge history page
- Withdrawal history
- Monthly reports

---

## ⚙️ Cron Configuration

**Vercel Cron** (configured in `vercel.json`):
```json
{
  "crons": [{
    "path": "/api/cron/process-withdrawals",
    "schedule": "0 0 * * *"
  }]
}
```

**Environment Variable Required:**
```
CRON_SECRET="your-random-secret-here"
```

Add this to Vercel environment variables for security!

---

## 🎉 System Complete!

Your Community Pledges platform is now a fully functional crowdfunding system with:
- ✅ Smart optimization
- ✅ Automated monthly processing
- ✅ Payment failure handling
- ✅ User roles & moderation
- ✅ Stripe integration
- ✅ Multi-country support

**The more people who pledge, the less everyone pays!** 🚀

