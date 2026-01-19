# Deployment Checklist for Sonic Sight

## Pre-Deployment ✓

- [ ] **Regenerate Firebase API Key**
  - Go to Firebase Console > Project Settings
  - Delete current API key
  - Create new restricted API key
  - Update in environment variables (not in code!)

- [ ] **Test Locally**
  ```bash
  firebase serve
  ```
  - Test speech recognition
  - Test API calls
  - Check all buttons work
  - Verify responsive design

- [ ] **Update Backend URL**
  - Decide on backend hosting (Railway, Render, Cloud Run)
  - Deploy backend
  - Get production URL
  - Update in `script.js` line ~330

- [ ] **Update CORS**
  - In `server.js`, restrict to your Firebase domain:
  ```javascript
  app.use(cors({ 
      origin: 'https://sonic-sight-5735c.web.app' 
  }));
  ```

- [ ] **Files Ready**
  - [ ] index.html
  - [ ] style.css
  - [ ] script.js
  - [ ] server.js (for backend deployment)
  - [ ] logo.png
  - [ ] package.json (with dependencies)

## Firebase Hosting Deployment

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Create Public Folder
```bash
mkdir public
copy index.html public\
copy style.css public\
copy script.js public\
copy logo.png public\
```

### Step 4: Configure Firebase (if not done)
```bash
firebase init hosting
```

### Step 5: Deploy
```bash
firebase deploy --only hosting
```

## Backend Deployment (Choose One)

### Option 1: Railway.app (Recommended)

1. Sign up at https://railway.app
2. Install Railway CLI: `npm i -g @railway/cli`
3. Run:
```bash
railway login
railway init
railway link
railway up
```
4. Get URL from Railway dashboard
5. Set as environment variable: `BACKEND_URL=https://your-railway-url`

### Option 2: Google Cloud Run

1. Install Google Cloud SDK
2. Create `.env.production` with your Gemini API key
3. Deploy:
```bash
gcloud run deploy sonic-sight-api --source . --platform managed --region us-central1
```

### Option 3: Render.com

1. Sign up at https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Set environment variables
5. Deploy

## Post-Deployment ✓

- [ ] **Test Production**
  - Visit: https://sonic-sight-5735c.web.app
  - Test speech recognition
  - Test API responses
  - Check console for errors

- [ ] **Monitor**
  - Watch Firebase hosting logs: `firebase hosting:releases:list`
  - Monitor backend logs
  - Check error rates

- [ ] **Performance**
  - Test on mobile
  - Test on different browsers
  - Check load time
  - Verify all assets load

- [ ] **Security**
  - Verify HTTPS is enabled ✅ (Firebase provides)
  - Check CORS is restricted
  - Verify API keys are not exposed in frontend code
  - Test that sensitive data is not logged

## Troubleshooting

### Issue: Blank Page After Deploy
- Check browser console (F12)
- Verify file paths are correct
- Check firebase.json is configured correctly

### Issue: API Calls Failing
- Verify backend URL in script.js
- Check CORS settings on backend
- Test backend URL directly in browser

### Issue: Speech Recognition Not Working
- Requires HTTPS ✅ (Firebase provides this)
- Check microphone permissions
- Test in different browser

### Issue: Firebase Auth Errors
- Regenerate API key
- Update firebaseConfig in index.html
- Check project credentials

## Rollback Deployment

If something goes wrong:

```bash
# View all releases
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:releases:rollback

# Or delete specific release
firebase hosting:channel:delete CHANNEL_ID
```

## Update After Deployment

To update your app after first deployment:

1. Make changes locally
2. Test with `firebase serve`
3. Deploy with `firebase deploy --only hosting`

That's it! Firebase automatically handles versioning and caching.

## Domain Setup (Optional)

To use custom domain:

1. Firebase Console > Hosting > Connected Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (usually 24 hours)

---

**Your Firebase Project:**
- Project ID: `sonic-sight-5735c`
- Hosting URL: `https://sonic-sight-5735c.web.app`
- Firebase Console: https://console.firebase.google.com/project/sonic-sight-5735c

