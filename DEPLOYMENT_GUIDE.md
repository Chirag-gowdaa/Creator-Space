# CreatorSpace - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying CreatorSpace to production using Vercel and MongoDB Atlas.

---

## 📋 Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Code reviewed and merged
- [ ] Documentation updated
- [ ] Security audit completed
- [ ] Performance optimized

---

## 🔧 Environment Setup

### Local Development
```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Fill in environment variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
RAZORPAY_ID=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret
NEXT_PUBLIC_RAZORPAY_KEY=your-public-key
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret

# Run development server
npm run dev
```

### Production Environment Variables

Create these in your deployment platform:

```
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=strong-random-secret-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/creatorspace
RAZORPAY_ID=your-production-razorpay-id
RAZORPAY_SECRET=your-production-razorpay-secret
NEXT_PUBLIC_RAZORPAY_KEY=your-production-public-key
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
NODE_ENV=production
```

---

## 🗄️ Database Setup

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create organization and project

2. **Create Cluster**
   - Click "Create" to build a new cluster
   - Choose "Shared" for free tier
   - Select region (closest to your users)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set permissions to "Atlas Admin"
   - Click "Add User"

4. **Get Connection String**
   - Go to "Databases"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Use this as `MONGODB_URI`

5. **Create Database**
   - In MongoDB Atlas, create database named "creatorspace"
   - Create collections:
     - users
     - posts
     - payments
     - notifications

### Database Indexes

Create these indexes for better performance:

```javascript
// In MongoDB Atlas or MongoDB Compass

// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 })
db.users.createIndex({ category: 1 })
db.users.createIndex({ isCreator: 1 })

// Posts collection
db.posts.createIndex({ creator: 1 })
db.posts.createIndex({ createdAt: -1 })
db.posts.createIndex({ isExclusive: 1 })

// Payments collection
db.payments.createIndex({ to_user: 1 })
db.payments.createIndex({ from_user: 1 })
db.payments.createIndex({ done: 1 })
db.payments.createIndex({ createdAt: -1 })

// Notifications collection
db.notifications.createIndex({ recipient: 1 })
db.notifications.createIndex({ createdAt: -1 })
db.notifications.createIndex({ isRead: 1 })
```

---

## 🔐 Security Setup

### GitHub OAuth Setup

1. **Go to GitHub Settings**
   - https://github.com/settings/developers
   - Click "New OAuth App"

2. **Fill in Application Details**
   - Application name: CreatorSpace
   - Homepage URL: https://yourdomain.com
   - Authorization callback URL: https://yourdomain.com/api/auth/callback/github

3. **Get Credentials**
   - Copy Client ID → `GITHUB_ID`
   - Click "Generate a new client secret"
   - Copy Client Secret → `GITHUB_SECRET`

### Razorpay Setup

1. **Create Razorpay Account**
   - Go to https://razorpay.com
   - Sign up for account
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings → API Keys
   - Copy Key ID → `RAZORPAY_ID`
   - Copy Key Secret → `RAZORPAY_SECRET`
   - Copy Public Key → `NEXT_PUBLIC_RAZORPAY_KEY`

### NextAuth Secret

Generate a secure secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -base64 32
```

---

## 📦 Build & Deployment

### Build Locally

```bash
# Build the project
npm run build

# Test production build locally
npm run start
```

### Deploy to Vercel

#### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add MONGODB_URI
vercel env add RAZORPAY_ID
vercel env add RAZORPAY_SECRET
vercel env add NEXT_PUBLIC_RAZORPAY_KEY
vercel env add GITHUB_ID
vercel env add GITHUB_SECRET
```

#### Option 2: Using GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select your project
   - Click "Import"

3. **Configure Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add all required variables
   - Click "Deploy"

### Deploy to Other Platforms

#### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### Railway
```bash
npm install -g @railway/cli
railway login
railway deploy
```

#### Heroku
```bash
npm install -g heroku
heroku login
heroku create creatorspace
git push heroku main
```

---

## ✅ Post-Deployment

### Verification Checklist

- [ ] Site loads at production URL
- [ ] Authentication works
- [ ] Database connection works
- [ ] All pages load
- [ ] All features work
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] SSL certificate valid
- [ ] Redirects work correctly
- [ ] Email notifications work (if enabled)

### Monitoring Setup

#### Vercel Analytics
- Automatically enabled
- Monitor at https://vercel.com/dashboard
- Check Core Web Vitals
- Monitor error rates

#### MongoDB Monitoring
- Go to MongoDB Atlas
- Check "Monitoring" tab
- Monitor query performance
- Check storage usage
- Set up alerts

#### Error Tracking (Optional)
- Set up Sentry for error tracking
- Set up LogRocket for session replay
- Set up New Relic for APM

### Backup Strategy

```bash
# Backup MongoDB
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/creatorspace" \
  --out=./backup

# Restore from backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/creatorspace" \
  ./backup
```

---

## 🔄 Continuous Deployment

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Rollback Procedure

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy specific commit
git revert <commit-hash>
git push origin main
```

---

## 🚨 Troubleshooting

### Common Deployment Issues

#### Issue: Database Connection Failed
```
Solution:
1. Check MONGODB_URI is correct
2. Verify IP whitelist in MongoDB Atlas
3. Check username and password
4. Test connection locally first
```

#### Issue: Environment Variables Not Loading
```
Solution:
1. Verify variables are set in deployment platform
2. Check variable names match exactly
3. Restart deployment after adding variables
4. Check for typos in variable names
```

#### Issue: Authentication Not Working
```
Solution:
1. Verify NEXTAUTH_URL matches production URL
2. Check GitHub OAuth credentials
3. Verify callback URL in GitHub settings
4. Check NEXTAUTH_SECRET is set
```

#### Issue: Razorpay Payments Failing
```
Solution:
1. Verify Razorpay keys are correct
2. Check Razorpay account is active
3. Verify payment mode (test vs production)
4. Check CORS settings
```

#### Issue: Slow Performance
```
Solution:
1. Enable Vercel Analytics
2. Check MongoDB query performance
3. Add database indexes
4. Enable caching
5. Optimize images
6. Use CDN for static assets
```

---

## 📊 Performance Optimization

### Image Optimization
```javascript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
/>
```

### Database Optimization
```javascript
// Use select() to limit fields
User.find().select('name email profilePic')

// Use lean() for read-only queries
User.find().lean()

// Use pagination
User.find().skip(skip).limit(limit)
```

### API Optimization
```javascript
// Add caching headers
res.setHeader('Cache-Control', 'public, max-age=3600')

// Compress responses
import compression from 'compression'
app.use(compression())
```

---

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] API keys rotated
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Monitor error logs
- Check database performance
- Review user feedback

**Monthly:**
- Update dependencies
- Review security logs
- Optimize database
- Backup data

**Quarterly:**
- Security audit
- Performance review
- Feature planning
- User analytics review

### Monitoring Tools

- **Vercel Analytics**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub**: https://github.com
- **Razorpay Dashboard**: https://dashboard.razorpay.com

---

## 🎉 Deployment Complete!

Your CreatorSpace application is now live in production!

**Next Steps:**
1. Monitor application performance
2. Gather user feedback
3. Plan feature updates
4. Scale infrastructure as needed

---

**Happy deploying! 🚀**
