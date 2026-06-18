# Firebase Hosting Setup Guide

This guide will help you deploy your Rangaara React app to Firebase Hosting.

## Prerequisites

1. A Google account
2. Node.js and npm installed
3. Firebase CLI tools (already installed as dev dependency)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name (e.g., "rangaara-ecommerce")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Firebase Hosting

1. In your Firebase project, click on "Hosting" in the left sidebar
2. Click "Get started"
3. Follow the setup instructions

## Step 3: Login to Firebase CLI

Open your terminal in the project directory and run:

```bash
npx firebase login
```

This will open a browser window for you to authenticate with your Google account.

## Step 4: Initialize Firebase in Your Project

Run the following command:

```bash
npx firebase init hosting
```

When prompted:
- **Select an existing project** or create a new one
- **What do you want to use as your public directory?** → Enter: `build`
- **Configure as a single-page app?** → Yes (y)
- **Set up automatic builds and deploys with GitHub?** → No (n) for now
- **File build/index.html already exists. Overwrite?** → No (n)

## Step 5: Update .firebaserc

After initialization, your `.firebaserc` file should be automatically updated with your project ID. If not, manually edit it:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 6: Build and Deploy

### Option 1: Using npm scripts (Recommended)

```bash
# Build and deploy in one command
npm run firebase:deploy
```

### Option 2: Manual deployment

```bash
# Build the React app
npm run build

# Deploy to Firebase
npx firebase deploy --only hosting
```

## Step 7: Access Your Deployed Site

After deployment, Firebase will provide you with a URL like:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

You can also find this URL in the Firebase Console under Hosting.

## Additional Commands

### Preview locally before deploying

```bash
npm run firebase:serve
```

This builds your app and serves it locally at `http://localhost:5000`

### Deploy to a specific project

```bash
npx firebase use <project-id>
npx firebase deploy
```

### View deployment history

Visit your Firebase Console → Hosting to see all deployments.

## Troubleshooting

### Error: "Firebase project not found"
- Make sure you've created the project in Firebase Console
- Verify the project ID in `.firebaserc` matches your Firebase project

### Error: "Build directory not found"
- Run `npm run build` first to create the `build` directory
- Make sure `firebase.json` points to the correct directory (`build`)

### Authentication issues
- Run `npx firebase login --reauth` to re-authenticate
- Make sure you're logged in with the correct Google account

## Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify your domain
4. Update your DNS records as instructed

## Continuous Deployment

To set up automatic deployments from GitHub:
1. Go to Firebase Console → Hosting
2. Click "Get started" under "GitHub" integration
3. Follow the setup wizard to connect your repository

---

**Note:** Make sure to commit your `.firebaserc` file (but NOT `.firebase/` folder) to your repository so your team can use the same Firebase project.
