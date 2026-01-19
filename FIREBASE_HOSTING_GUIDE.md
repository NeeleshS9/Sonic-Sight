# Firebase Hosting Guide for Sonic Sight

## Prerequisites
- Firebase account (https://firebase.google.com)
- Node.js installed
- Your project files ready

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Initialize Firebase in Your Project

Navigate to your project folder and run:

```bash
cd "e:\Team Project"
firebase login
firebase init hosting
```

**During initialization, select:**
- ✅ Use an existing project (select `sonic-sight-5735c`)
- **Public directory:** Leave as `public` (or use current directory)
- **Single page app:** Choose `No` (unless you want SPA rewriting)
- **Enable automatic builds:** Choose `No`

## Step 3: Prepare Your Project Structure

Create a `public` folder in your project:

```bash
mkdir public
```

Copy these files to the `public` folder:
- `index.html`
- `style.css`
- `script.js`
- `logo.png`
- `logo2.png`
- Any other assets

```bash
copy index.html public\
copy style.css public\
copy script.js public\
copy logo.png public\
copy logo2.png public\
```

## Step 4: Update Backend URL for Production

**Before deploying, you need to:**

1. Deploy your backend (server.js) to a service
2. Update the API endpoint in script.js

### Option A: Deploy Backend to Heroku (Free tier discontinued)

**Alternative: Use a backend service like:**
- **Railway.app** (recommended, free tier available)
- **Render.com** (free tier with limitations)
- **AWS Lambda** (with API Gateway)
- **Google Cloud Run** (part of Firebase ecosystem)

### Option B: Use Google Cloud Run (Recommended)

```bash
# Build Docker image and deploy to Cloud Run
gcloud run deploy sonic-sight-api --source . --platform managed --region us-central1
```

### Update script.js with Production URL

After deploying backend, update the API endpoint:

```javascript
// In script.js, change:
fetch('http://localhost:3000/api/chat', {...})

// To:
fetch('https://YOUR-BACKEND-URL.run.app/api/chat', {...})
```

## Step 5: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Your app will be live at:
```
https://sonic-sight-5735c.web.app
https://sonic-sight-5735c.firebaseapp.com
```

## Step 6: Verify Deployment

- Check: `firebase hosting:channel:list`
- View logs: `firebase hosting:channel:delete CHANNEL_ID`
- Rollback: `firebase hosting:releases:list`

---

## Complete Hosting Options

| Service | Frontend | Backend | Cost | Best For |
|---------|----------|---------|------|----------|
| **Firebase Hosting** | ✅ | ❌ | Free (10GB/month) | Frontend only |
| **Railway.app** | ✅ | ✅ | Free trial | Full stack |
| **Render.com** | ✅ | ✅ | Free tier | Full stack |
| **Vercel** | ✅ | ✅ | Free | Full stack (Next.js) |
| **AWS** | ✅ | ✅ | Pay-as-you-go | Enterprise |

---

## Recommended Solution: Firebase + Railway

### 1. Deploy Frontend (Firebase Hosting)
```bash
firebase deploy --only hosting
```

### 2. Deploy Backend (Railway)

Sign up at https://railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize Railway project
railway init

# Link to existing project
railway link

# Deploy
railway up
```

Get your backend URL from Railway dashboard and update script.js

---

## Environment Variables

### Create `.env` file in your project root:

```
VITE_API_URL=https://your-backend-url.railway.app
VITE_FIREBASE_API_KEY=AIzaSyBPPwFVnrMSkUcO9b14RXCMD7Y9hOD3dkY
```

### For server.js backend, create `.env`:

```
API_KEY=your_gemini_api_key
PORT=3000
```

---

## Important Security Notes ⚠️

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Regenerate Firebase API key** for production (your current key is exposed)
3. **Update CORS in server.js**:

```javascript
app.use(cors({ 
    origin: 'https://sonic-sight-5735c.web.app' 
}));
```

4. **Use HTTPS only** - Firebase Hosting provides free SSL/TLS

---

## Troubleshooting

### Issue: "Module not found"
- Ensure all files are in the `public` folder
- Check file paths in index.html are correct

### Issue: "Backend not responding"
- Verify backend URL is correct
- Check CORS settings on backend
- Ensure backend is deployed and running

### Issue: "Firebase config not found"
- Check `firebaseConfig` in index.html
- Verify project credentials are correct

### Issue: "Speech recognition not working"
- Firebase Hosting requires HTTPS (it provides this ✅)
- Check browser permissions for microphone access
- Test locally first with `firebase serve`

---

## Test Locally Before Deploying

```bash
firebase serve
```

Visit: `http://localhost:5000`

---

## Delete or Roll Back Deployment

```bash
# View all releases
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:releases:rollback

# Delete specific version
firebase hosting:channel:delete CHANNEL_NAME
```

---

## Need Help?

- Firebase Docs: https://firebase.google.com/docs/hosting
- Railway Docs: https://docs.railway.app
- Your Project: sonic-sight-5735c

