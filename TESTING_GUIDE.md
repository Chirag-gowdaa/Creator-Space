# CreatorSpace - Testing Guide

## 🧪 Testing Strategy

This guide provides comprehensive testing procedures for all features in CreatorSpace.

---

## 📋 Manual Testing Checklist

### 1. Authentication & Authorization

#### Sign Up Flow
- [ ] Navigate to `/signup`
- [ ] Click "Sign up with GitHub"
- [ ] Authorize the application
- [ ] Verify user is created in MongoDB
- [ ] Verify session is created
- [ ] Verify redirect to dashboard
- [ ] Check user data in database

#### Login Flow
- [ ] Sign out from dashboard
- [ ] Navigate to home page
- [ ] Click "Sign Up" button
- [ ] Go through GitHub OAuth
- [ ] Verify session persists after refresh
- [ ] Verify user data loads correctly

#### Protected Routes
- [ ] Try accessing `/dashboard` without authentication
- [ ] Verify redirect to home page
- [ ] Try accessing `/edit-profile` without authentication
- [ ] Verify redirect to home page
- [ ] Try accessing `/notifications` without authentication
- [ ] Verify redirect to home page

### 2. Profile Management

#### Edit Profile
- [ ] Navigate to `/edit-profile`
- [ ] Fill in all fields:
  - [ ] Name
  - [ ] Username
  - [ ] Bio (test character limit)
  - [ ] Category (test all 7 categories)
  - [ ] Profile picture URL
  - [ ] Cover picture URL
  - [ ] Social links (Twitter, Instagram, YouTube, Website)
- [ ] Click save
- [ ] Verify success message
- [ ] Verify data saved in database
- [ ] Verify changes reflect on public profile
- [ ] Test with empty optional fields
- [ ] Test with invalid URLs
- [ ] Test with very long bio

#### Profile Picture Preview
- [ ] Upload valid image URL
- [ ] Verify preview displays
- [ ] Test with invalid URL
- [ ] Verify error handling

#### Creator Badge
- [ ] Enable "I'm a Creator" checkbox
- [ ] Verify `isCreator` flag set to true
- [ ] Verify creator features become available
- [ ] Disable creator flag
- [ ] Verify creator features are hidden

### 3. Creator Discovery

#### Explore Page
- [ ] Navigate to `/explore`
- [ ] Verify page loads
- [ ] Verify creator grid displays
- [ ] Verify pagination works
- [ ] Check creator stats display correctly
- [ ] Verify follow button works

#### Category Filtering
- [ ] Click "All" category
- [ ] Verify all creators display
- [ ] Click "Music" category
- [ ] Verify only music creators display
- [ ] Test each category:
  - [ ] Music
  - [ ] Art
  - [ ] Gaming
  - [ ] Writing
  - [ ] Tech
  - [ ] Education
  - [ ] Other

#### Search Functionality
- [ ] Type creator name in search
- [ ] Verify results filter in real-time
- [ ] Search by username
- [ ] Search by bio keywords
- [ ] Search with empty results
- [ ] Verify "No creators found" message
- [ ] Test case-insensitive search
- [ ] Test special characters in search

#### Pagination
- [ ] Verify "Previous" button disabled on page 1
- [ ] Click "Next" button
- [ ] Verify page 2 loads
- [ ] Verify different creators display
- [ ] Click "Previous" button
- [ ] Verify page 1 loads again
- [ ] Test pagination with filters applied

### 4. Social Features

#### Follow System
- [ ] Navigate to `/explore`
- [ ] Click "Follow" button on a creator
- [ ] Verify button changes to "Following"
- [ ] Verify follower count increases
- [ ] Click "Following" button
- [ ] Verify button changes back to "Follow"
- [ ] Verify follower count decreases
- [ ] Check database for followers/following arrays

#### Notifications
- [ ] Follow a creator
- [ ] Navigate to `/notifications`
- [ ] Verify notification appears
- [ ] Verify notification shows correct type
- [ ] Verify notification shows creator name
- [ ] Verify timestamp displays correctly
- [ ] Click "Mark as read" button
- [ ] Verify notification style changes
- [ ] Verify unread count updates

#### Notification Types
- [ ] Test "follow" notification
- [ ] Test "support" notification (if payment made)
- [ ] Test "like" notification (if post liked)
- [ ] Test "comment" notification (if comment made)
- [ ] Verify each type shows correct icon
- [ ] Verify each type shows correct message

### 5. Dashboard & Analytics

#### Dashboard Load
- [ ] Navigate to `/dashboard`
- [ ] Verify page loads
- [ ] Verify all stats cards display
- [ ] Verify stats show correct data

#### Analytics Cards
- [ ] **Total Earnings**
  - [ ] Shows correct amount
  - [ ] Shows supporter count
  - [ ] Updates after payment
  
- [ ] **Followers**
  - [ ] Shows correct count
  - [ ] Updates after follow
  
- [ ] **Posts**
  - [ ] Shows correct count
  - [ ] Updates after post creation
  
- [ ] **Engagement**
  - [ ] Shows correct count
  - [ ] Updates after likes/comments

#### Recent Supporters
- [ ] Verify list displays
- [ ] Verify supporter names show
- [ ] Verify amounts show correctly
- [ ] Verify messages display
- [ ] Test with no supporters
- [ ] Verify empty state message

#### Quick Actions
- [ ] Click "Edit Profile" button
- [ ] Verify navigates to `/edit-profile`
- [ ] Click "Explore Creators" button
- [ ] Verify navigates to `/explore`
- [ ] Click "View Public Profile" button
- [ ] Verify navigates to creator profile

### 6. Post Management

#### Create Post
- [ ] Click "Create Post" button on dashboard
- [ ] Verify modal opens
- [ ] Fill in post form:
  - [ ] Title (test length validation)
  - [ ] Content (test length validation)
  - [ ] Image URL (optional)
  - [ ] Exclusive checkbox
- [ ] Click "Publish Post" button
- [ ] Verify success message
- [ ] Verify post appears on dashboard
- [ ] Verify post appears on creator profile

#### Post Display
- [ ] Navigate to creator profile
- [ ] Verify posts display
- [ ] Verify post title displays
- [ ] Verify post content displays
- [ ] Verify post image displays (if provided)
- [ ] Verify exclusive badge shows (if exclusive)

#### Post Engagement
- [ ] Click like button on post
- [ ] Verify like count increases
- [ ] Click like button again
- [ ] Verify like count decreases
- [ ] Test comment functionality (if implemented)

### 7. Responsive Design

#### Mobile (375px)
- [ ] Home page
  - [ ] Text readable
  - [ ] Buttons clickable
  - [ ] No horizontal scroll
  - [ ] Navigation works
  
- [ ] Explore page
  - [ ] Grid stacks to single column
  - [ ] Search works
  - [ ] Filters work
  - [ ] Pagination works
  
- [ ] Dashboard
  - [ ] Stats stack vertically
  - [ ] Cards readable
  - [ ] Buttons clickable
  
- [ ] Edit Profile
  - [ ] Form fields readable
  - [ ] Inputs usable
  - [ ] Submit button clickable

#### Tablet (768px)
- [ ] All pages load
- [ ] Layout adjusts properly
- [ ] Navigation works
- [ ] Forms are usable

#### Desktop (1920px)
- [ ] Full layout displays
- [ ] Spacing is correct
- [ ] Hover effects work
- [ ] All features visible

### 8. Error Handling

#### Network Errors
- [ ] Disconnect internet
- [ ] Try to load page
- [ ] Verify error message displays
- [ ] Reconnect internet
- [ ] Verify page loads

#### Validation Errors
- [ ] Try to create post without title
- [ ] Verify error message
- [ ] Try to create post without content
- [ ] Verify error message
- [ ] Try to edit profile with invalid URL
- [ ] Verify error message

#### Not Found Errors
- [ ] Navigate to non-existent creator
- [ ] Verify 404 message
- [ ] Navigate to non-existent post
- [ ] Verify 404 message

#### Unauthorized Errors
- [ ] Try to access admin endpoints
- [ ] Verify 403 error
- [ ] Try to delete another user's post
- [ ] Verify 403 error

### 9. Data Persistence

#### Database Checks
- [ ] Create user account
- [ ] Verify user in MongoDB
- [ ] Edit profile
- [ ] Verify changes in database
- [ ] Create post
- [ ] Verify post in database
- [ ] Follow creator
- [ ] Verify followers/following arrays updated
- [ ] Create notification
- [ ] Verify notification in database

#### Session Persistence
- [ ] Sign in
- [ ] Refresh page
- [ ] Verify session persists
- [ ] Close browser
- [ ] Reopen browser
- [ ] Navigate to app
- [ ] Verify session persists
- [ ] Sign out
- [ ] Verify session cleared

### 10. Performance

#### Page Load Times
- [ ] Measure home page load time
- [ ] Measure explore page load time
- [ ] Measure dashboard load time
- [ ] Verify all load in < 3 seconds

#### Search Performance
- [ ] Search with 1 character
- [ ] Verify results return quickly
- [ ] Search with multiple words
- [ ] Verify results return quickly
- [ ] Filter by category
- [ ] Verify results return quickly

#### Pagination Performance
- [ ] Load page 1
- [ ] Verify loads quickly
- [ ] Go to page 10
- [ ] Verify loads quickly
- [ ] Go to last page
- [ ] Verify loads quickly

---

## 🔍 API Testing

### Using cURL or Postman

#### Test Creator Discovery API
```bash
# Get all creators
curl http://localhost:3000/api/creators

# Filter by category
curl "http://localhost:3000/api/creators?category=Music"

# Search creators
curl "http://localhost:3000/api/creators?search=john"

# Pagination
curl "http://localhost:3000/api/creators?page=2"
```

#### Test Follow API
```bash
# Follow creator
curl -X POST http://localhost:3000/api/follow \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"USER_ID","action":"follow"}'

# Unfollow creator
curl -X POST http://localhost:3000/api/follow \
  -H "Content-Type: application/json" \
  -d '{"targetUserId":"USER_ID","action":"unfollow"}'
```

#### Test Posts API
```bash
# Get posts
curl http://localhost:3000/api/posts

# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","content":"Post content","image":"","isExclusive":false}'
```

#### Test Notifications API
```bash
# Get notifications
curl http://localhost:3000/api/notifications

# Mark as read
curl -X PUT http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"notificationId":"NOTIFICATION_ID"}'
```

#### Test Dashboard API
```bash
# Get analytics
curl http://localhost:3000/api/dashboard
```

#### Test Profile API
```bash
# Get profile
curl http://localhost:3000/api/profile

# Update profile
curl -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name","bio":"New bio","category":"Music"}'
```

---

## 🐛 Bug Testing

### Common Issues to Test

- [ ] Duplicate follows (prevent following twice)
- [ ] Duplicate posts (prevent posting same content twice)
- [ ] Empty search results (show proper message)
- [ ] Invalid URLs (show validation error)
- [ ] Very long text (truncate or show error)
- [ ] Special characters in search (handle properly)
- [ ] Rapid clicks (prevent duplicate submissions)
- [ ] Session expiration (redirect to login)
- [ ] Concurrent requests (handle properly)
- [ ] Large file uploads (reject if too large)

---

## 📊 Performance Testing

### Load Testing
- Test with 100+ creators
- Test with 1000+ posts
- Test with 10000+ notifications
- Verify pagination handles large datasets
- Verify search is fast with large datasets

### Memory Testing
- Monitor memory usage while browsing
- Verify no memory leaks
- Check browser console for warnings

### Network Testing
- Test on slow 3G connection
- Test on fast 5G connection
- Test with network throttling
- Verify graceful degradation

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] All manual tests pass
- [ ] All API tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] All pages load
- [ ] All features work
- [ ] Responsive design works
- [ ] Error handling works
- [ ] Database operations work
- [ ] Authentication works
- [ ] Performance is acceptable
- [ ] Security checks pass
- [ ] Documentation is complete

---

## 📝 Test Report Template

```markdown
# Test Report - [Date]

## Summary
- Tests Run: X
- Tests Passed: X
- Tests Failed: X
- Success Rate: X%

## Passed Tests
- [ ] Feature 1
- [ ] Feature 2

## Failed Tests
- [ ] Feature X - Issue description

## Issues Found
1. Issue 1 - Severity: High
2. Issue 2 - Severity: Medium

## Recommendations
- Recommendation 1
- Recommendation 2

## Sign-off
- Tester: [Name]
- Date: [Date]
- Status: [Ready/Not Ready]
```

---

## 🚀 Continuous Testing

### Automated Tests (Future)
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for user flows
- Performance tests
- Security tests

### Manual Testing Schedule
- After each feature addition
- Before each deployment
- Weekly regression testing
- Monthly comprehensive testing

---

**Good luck with testing! 🧪**
