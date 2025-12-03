# CreatorSpace - Feature Map & Architecture

## 🗺️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CREATORSPACE                           │
│                   Patreon Clone v2.0                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   FRONTEND LAYER     │
├──────────────────────┤
│ • Next.js 15         │
│ • React 19           │
│ • TailwindCSS        │
│ • Lucide Icons       │
└──────────────────────┘
         ↓
┌──────────────────────┐
│   API LAYER          │
├──────────────────────┤
│ • Next.js Routes     │
│ • NextAuth.js        │
│ • Error Handling     │
│ • Validation         │
└──────────────────────┘
         ↓
┌──────────────────────┐
│  DATABASE LAYER      │
├──────────────────────┤
│ • MongoDB            │
│ • Mongoose ODM       │
│ • Indexing           │
│ • Relationships      │
└──────────────────────┘
```

## 📊 Data Flow Diagram

```
USER JOURNEY:

1. AUTHENTICATION
   ┌─────────────┐
   │   Sign Up   │
   └──────┬──────┘
          │
          ↓
   ┌─────────────────────┐
   │  NextAuth.js OAuth  │
   └──────┬──────────────┘
          │
          ↓
   ┌─────────────────────┐
   │  Create User in DB  │
   └──────┬──────────────┘
          │
          ↓
   ┌─────────────────────┐
   │  Session Created    │
   └─────────────────────┘

2. PROFILE SETUP
   ┌──────────────────┐
   │  Edit Profile    │
   └────────┬─────────┘
            │
            ↓
   ┌──────────────────────────┐
   │  Update User Fields:     │
   │  • Bio                   │
   │  • Category              │
   │  • Social Links          │
   │  • Profile Pic           │
   │  • isCreator Flag        │
   └────────┬─────────────────┘
            │
            ↓
   ┌──────────────────┐
   │  Save to MongoDB │
   └──────────────────┘

3. DISCOVERY
   ┌──────────────────┐
   │  Explore Page    │
   └────────┬─────────┘
            │
            ├─→ Filter by Category
            ├─→ Search by Name/Bio
            ├─→ Pagination
            │
            ↓
   ┌──────────────────────────┐
   │  GET /api/creators       │
   │  Query MongoDB           │
   │  Return Paginated List   │
   └────────┬─────────────────┘
            │
            ↓
   ┌──────────────────┐
   │  Display Results │
   └──────────────────┘

4. SOCIAL FEATURES
   ┌──────────────────┐
   │  Follow Creator  │
   └────────┬─────────┘
            │
            ↓
   ┌──────────────────────────────┐
   │  POST /api/follow            │
   │  • Add to followers array    │
   │  • Add to following array    │
   │  • Create Notification       │
   └────────┬─────────────────────┘
            │
            ↓
   ┌──────────────────────────────┐
   │  Notification Created        │
   │  • Type: "follow"            │
   │  • Recipient: Creator        │
   │  • Sender: User              │
   └────────┬─────────────────────┘
            │
            ↓
   ┌──────────────────┐
   │  View in Notifs  │
   └──────────────────┘

5. CONTENT CREATION
   ┌──────────────────┐
   │  Create Post     │
   └────────┬─────────┘
            │
            ↓
   ┌──────────────────────────┐
   │  POST /api/posts         │
   │  • Title                 │
   │  • Content               │
   │  • Image                 │
   │  • Exclusive Flag        │
   └────────┬─────────────────┘
            │
            ↓
   ┌──────────────────┐
   │  Save to MongoDB │
   └────────┬─────────┘
            │
            ↓
   ┌──────────────────────┐
   │  Display on Profile  │
   │  & Dashboard         │
   └──────────────────────┘

6. ANALYTICS
   ┌──────────────────┐
   │  View Dashboard  │
   └────────┬─────────┘
            │
            ↓
   ┌──────────────────────────────┐
   │  GET /api/dashboard          │
   │  • Calculate Earnings        │
   │  • Count Supporters          │
   │  • Count Followers           │
   │  • Count Posts               │
   │  • Calculate Engagement      │
   └────────┬─────────────────────┘
            │
            ↓
   ┌──────────────────────────────┐
   │  Display Real-time Stats     │
   │  • Total Earnings            │
   │  • Follower Count            │
   │  • Recent Supporters         │
   │  • Engagement Metrics        │
   └──────────────────────────────┘
```

## 🔄 Component Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   │   ├── Explore
│   │   ├── Dashboard
│   │   └── Profile Dropdown
│   └── Search Bar
│
├── Pages
│   ├── Home (/)
│   │   ├── Hero Section
│   │   ├── CTA Buttons
│   │   └── Footer
│   │
│   ├── Explore (/explore)
│   │   ├── Search Bar
│   │   ├── Category Filter
│   │   ├── Creator Grid
│   │   │   ├── Creator Card
│   │   │   │   ├── Profile Image
│   │   │   │   ├── Stats
│   │   │   │   ├── Follow Button
│   │   │   │   └── View Profile Button
│   │   │   └── ...
│   │   └── Pagination
│   │
│   ├── Dashboard (/dashboard)
│   │   ├── Header
│   │   ├── Stats Grid
│   │   │   ├── Earnings Card
│   │   │   ├── Followers Card
│   │   │   ├── Posts Card
│   │   │   └── Engagement Card
│   │   ├── Recent Supporters
│   │   ├── Quick Actions
│   │   └── Create Post Modal
│   │
│   ├── Edit Profile (/edit-profile)
│   │   ├── Basic Info Form
│   │   ├── Images Form
│   │   ├── Social Links Form
│   │   └── Submit Button
│   │
│   ├── Notifications (/notifications)
│   │   ├── Header
│   │   ├── Notification List
│   │   │   ├── Notification Item
│   │   │   │   ├── Icon
│   │   │   │   ├── Message
│   │   │   │   ├── Timestamp
│   │   │   │   └── Mark as Read Button
│   │   │   └── ...
│   │   └── Empty State
│   │
│   └── Creator Profile (/creator-profile)
│       ├── Cover Image
│       ├── Profile Header
│       │   ├── Profile Picture
│       │   ├── Name & Bio
│       │   ├── Stats
│       │   └── Follow Button
│       ├── Social Links
│       ├── Posts Section
│       │   ├── Post Card
│       │   │   ├── Image
│       │   │   ├── Title
│       │   │   ├── Content
│       │   │   └── Engagement
│       │   └── ...
│       └── Footer
│
└── Footer
    ├── Links
    ├── Social
    └── Copyright
```

## 📡 API Endpoint Map

```
/api/
├── auth/
│   └── [...nextauth]
│       └── NextAuth.js Configuration
│
├── creators/
│   └── route.js
│       ├── GET  - Fetch creators with filters
│       │   ├── Query: category, search, page
│       │   └── Response: creators[], pagination
│       └── Features:
│           ├── Multi-field search
│           ├── Category filtering
│           ├── Pagination
│           └── Sorting by earnings
│
├── follow/
│   └── route.js
│       └── POST - Follow/unfollow creator
│           ├── Body: targetUserId, action
│           ├── Updates: followers/following arrays
│           ├── Creates: Notification
│           └── Response: success message
│
├── posts/
│   └── route.js
│       ├── GET  - Fetch posts
│       │   ├── Query: creatorId, page
│       │   └── Response: posts[], pagination
│       └── POST - Create new post
│           ├── Body: title, content, image, isExclusive
│           ├── Creates: Post document
│           └── Response: post data
│
├── notifications/
│   └── route.js
│       ├── GET - Fetch notifications
│       │   ├── Auth: Required
│       │   └── Response: notifications[], unreadCount
│       └── PUT - Mark as read
│           ├── Body: notificationId
│           └── Response: updated notification
│
├── dashboard/
│   └── route.js
│       └── GET - Fetch analytics
│           ├── Auth: Required
│           └── Response: stats object
│               ├── totalEarnings
│               ├── totalSupports
│               ├── followers
│               ├── postsCount
│               ├── totalLikes
│               ├── totalComments
│               └── recentPayments
│
└── profile/
    └── route.js
        ├── GET - Fetch user profile
        │   ├── Auth: Required
        │   └── Response: user object
        ├── POST - Create/update profile (legacy)
        │   └── Body: email, username, name, pics
        └── PUT - Update profile (new)
            ├── Auth: Required
            ├── Body: name, bio, category, socialLinks, etc.
            └── Response: updated user
```

## 🗄️ Database Schema Relationships

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ _id             │
│ email           │
│ name            │
│ username        │
│ bio             │
│ category        │
│ profilePic      │
│ coverPic        │
│ socialLinks     │
│ followers[]     │────┐
│ following[]     │    │
│ totalEarnings   │    │
│ totalSupports   │    │
│ isCreator       │    │
│ subscriptionTiers
│ createdAt       │    │
└─────────────────┘    │
        ▲              │
        │              │
        └──────────────┘
         (Self-reference)

┌─────────────────┐
│      Post       │
├─────────────────┤
│ _id             │
│ creator ────────┼──→ User._id
│ title           │
│ content         │
│ image           │
│ likes[]         │────┐
│ comments[]      │    │
│   ├─ user ─────┼────┼──→ User._id
│   ├─ text      │    │
│   └─ createdAt │    │
│ isExclusive     │    │
│ requiredTier    │    │
│ createdAt       │    │
└─────────────────┘    │
        ▲              │
        │              │
        └──────────────┘
      (References User)

┌──────────────────┐
│  Notification    │
├──────────────────┤
│ _id              │
│ recipient ───────┼──→ User._id
│ sender ──────────┼──→ User._id
│ type             │
│ message          │
│ relatedPost ─────┼──→ Post._id
│ relatedPayment ──┼──→ Payment._id
│ isRead           │
│ createdAt        │
└──────────────────┘

┌──────────────────┐
│    Payment       │
├──────────────────┤
│ _id              │
│ to_user          │
│ from_user        │
│ amount           │
│ message          │
│ oid              │
│ done             │
│ createdAt        │
└──────────────────┘
```

## 🔐 Authentication Flow

```
User Visits App
    ↓
Check NextAuth Session
    ├─ Session Exists
    │   ├─ Render Authenticated UI
    │   ├─ Show Dashboard Link
    │   └─ Show Profile Dropdown
    │
    └─ No Session
        ├─ Render Public UI
        ├─ Show Sign Up Button
        └─ Show Login Button
            ↓
        User Clicks Sign Up
            ↓
        Redirected to GitHub OAuth
            ↓
        GitHub Authenticates
            ↓
        Callback to NextAuth
            ↓
        Create User in MongoDB
            ↓
        Session Created
            ↓
        Redirect to Dashboard
```

## 🎯 Feature Dependencies

```
Authentication (NextAuth)
    ↓
    ├─→ User Profile
    │       ├─→ Edit Profile
    │       └─→ View Profile
    │
    ├─→ Creator Features
    │       ├─→ Dashboard
    │       │   ├─→ Analytics
    │       │   └─→ Create Posts
    │       │
    │       └─→ Posts
    │           ├─→ Like/Comment
    │           └─→ Exclusive Content
    │
    ├─→ Social Features
    │       ├─→ Follow System
    │       │   └─→ Notifications
    │       │
    │       └─→ Explore Page
    │           ├─→ Search
    │           ├─→ Filter
    │           └─→ Pagination
    │
    └─→ Payments (Razorpay)
        └─→ Support Creator
```

## 📈 Scalability Architecture

```
Current (Single Server):
┌──────────────┐
│   Frontend   │
│  (Vercel)    │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  API Routes  │
│  (Vercel)    │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   MongoDB    │
│   (Atlas)    │
└──────────────┘

Future (Scaled):
┌──────────────┐
│   Frontend   │
│  (CDN)       │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│  Load Balancer   │
└──────┬───────────┘
       │
   ┌───┴───┬───────┬───────┐
   ↓       ↓       ↓       ↓
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ API │ │ API │ │ API │ │ API │
│  1  │ │  2  │ │  3  │ │  N  │
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   │       │       │       │
   └───────┴───────┴───────┘
           │
           ↓
    ┌──────────────┐
    │   Redis      │
    │  (Cache)     │
    └──────┬───────┘
           │
           ↓
    ┌──────────────┐
    │   MongoDB    │
    │  (Replica)   │
    └──────────────┘
```

## 🚀 Deployment Architecture

```
GitHub Repository
    ↓
    ├─→ Push to main
    │
    ↓
GitHub Actions (CI/CD)
    ├─→ Run Tests
    ├─→ Run Linter
    └─→ Build Project
        ↓
    ↓
Vercel Deployment
    ├─→ Deploy Frontend
    ├─→ Deploy API Routes
    └─→ Set Environment Variables
        ↓
    ↓
Production URL
    └─→ https://creatorspace.vercel.app
```

---

This feature map provides a complete overview of the CreatorSpace architecture, data flows, and relationships. Use it to understand the system design and explain it during interviews.
