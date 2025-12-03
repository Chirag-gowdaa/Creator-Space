# CreatorSpace - Patreon Clone

A modern creator monetization platform built with Next.js, React, MongoDB, and Razorpay. CreatorSpace enables creators to build communities, share exclusive content, and receive support from their fans.

## 🚀 Features

### Core Features
- **User Authentication** - Secure sign-up and login with NextAuth
- **Creator Profiles** - Customizable profiles with bio, social links, and profile pictures
- **Payment Integration** - Razorpay integration for seamless payments
- **Creator Discovery** - Browse and discover creators by category
- **Follow System** - Follow/unfollow creators and build communities
- **Notifications** - Real-time notifications for follows, supports, and interactions

### Creator Features
- **Creator Dashboard** - Analytics and earnings tracking
- **Post Creation** - Share updates and exclusive content with followers
- **Subscription Tiers** - Set up multiple support tiers for recurring revenue
- **Earnings Tracking** - Monitor total earnings and supporter count
- **Profile Customization** - Full profile editing with social links

### Discovery & Community
- **Explore Page** - Discover creators with category filtering and search
- **Creator Categories** - Music, Art, Gaming, Writing, Tech, Education, Other
- **Search Functionality** - Search creators by name, username, or bio
- **Pagination** - Browse creators with pagination support
- **Engagement Metrics** - View likes, comments, and follower counts

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **UI Components**: Lucide React Icons, shadcn/ui patterns
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/     # Authentication
│   ├── creators/               # Creator discovery API
│   ├── follow/                 # Follow/unfollow API
│   ├── posts/                  # Posts CRUD API
│   ├── notifications/          # Notifications API
│   ├── dashboard/              # Dashboard analytics API
│   └── profile/                # Profile management API
├── components/
│   ├── Navbar.jsx              # Navigation bar
│   ├── Footer.jsx              # Footer
│   ├── PaymentPage.jsx         # Payment component
│   └── NewsNavBar.jsx          # News navigation
├── explore/                    # Creator discovery page
├── dashboard/                  # Creator dashboard
├── edit-profile/               # Profile editing
├── notifications/              # Notifications page
├── creator-profile/            # Public creator profile
├── [username]/                 # Creator support page
└── page.js                     # Home page

models/
├── User.js                     # User schema with creator fields
├── Post.js                     # Post schema for content
├── Payment.js                  # Payment transactions
└── Notification.js             # Notification schema
```

## 🔑 Key Models

### User Model
```javascript
{
  email, username, name,
  profilePic, coverPic,
  bio, category,
  socialLinks: { twitter, instagram, youtube, website },
  followers, following,
  totalEarnings, totalSupports,
  isCreator, subscriptionTiers
}
```

### Post Model
```javascript
{
  creator, title, content, image,
  likes, comments,
  isExclusive, requiredTier,
  createdAt, updatedAt
}
```

### Notification Model
```javascript
{
  recipient, sender,
  type: ['follow', 'support', 'comment', 'like', 'message'],
  message, relatedPost, relatedPayment,
  isRead, createdAt
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Razorpay account

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd creator
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables in `.env.local`
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
RAZORPAY_ID=your-razorpay-key-id
RAZORPAY_SECRET=your-razorpay-secret
NEXT_PUBLIC_RAZORPAY_KEY=your-public-key
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 API Endpoints

### Creators
- `GET /api/creators` - Get creators with filtering and search
- `GET /api/creators?category=Music&search=john&page=1`

### Follow System
- `POST /api/follow` - Follow/unfollow creator
  ```json
  { "targetUserId": "id", "action": "follow" }
  ```

### Posts
- `GET /api/posts` - Get posts with pagination
- `GET /api/posts?creatorId=id&page=1`
- `POST /api/posts` - Create new post

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications` - Mark notification as read

### Dashboard
- `GET /api/dashboard` - Get creator analytics and stats

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile information

## 🎯 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section |
| Explore | `/explore` | Discover creators with filters |
| Dashboard | `/dashboard` | Creator analytics and stats |
| Edit Profile | `/edit-profile` | Profile customization |
| Creator Profile | `/creator-profile?username=...` | Public creator profile |
| Support Creator | `/:username` | Support/payment page |
| Notifications | `/notifications` | User notifications |
| Sign Up | `/signup` | User registration |

## 💡 Interview Highlights

### Architecture & Design
- **Scalable API Design** - RESTful endpoints with proper error handling
- **Database Schema** - Well-structured MongoDB models with relationships
- **Authentication** - Secure NextAuth.js implementation
- **Component Structure** - Reusable React components with hooks

### Features Implemented
- **Full-Stack Development** - Frontend, backend, and database integration
- **Real-time Notifications** - Notification system with read status
- **Search & Filtering** - Advanced creator discovery with multiple filters
- **Analytics Dashboard** - Real-time earnings and engagement metrics
- **Payment Integration** - Razorpay integration for transactions
- **Social Features** - Follow system with notifications

### Best Practices
- **Error Handling** - Comprehensive error handling and user feedback
- **Security** - Authentication checks on protected routes
- **Performance** - Pagination, lazy loading, and optimized queries
- **UX/UI** - Modern dark theme with responsive design
- **Code Organization** - Clear separation of concerns

## 🔐 Security Features

- NextAuth.js for secure authentication
- Protected API routes with session validation
- Environment variables for sensitive data
- CORS and request validation
- Secure payment handling with Razorpay

## 📈 Future Enhancements

- [ ] Subscription tier management
- [ ] Advanced analytics and charts
- [ ] Direct messaging between creators and supporters
- [ ] Content scheduling
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Video content support
- [ ] Livestream integration
- [ ] Merchandise integration
- [ ] Tax reporting

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please reach out through the Support page or contact the development team.
