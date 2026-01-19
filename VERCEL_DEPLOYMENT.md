# Vercel Deployment Guide

## The "No Output Directory" Error - SOLUTION

If you're seeing this error:
```
Error: No Output Directory named "public" found after the Build completed.
```

This means **Vercel is not detecting this as a Next.js project**. Follow these steps to fix it:

## ✅ Solution: Configure Vercel Project Settings

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project** → Settings → General

2. **Framework Preset**: Change from "Other" to **"Next.js"**

3. **Build & Development Settings**:
   - Build Command: `npm run build` (or leave empty for auto-detect)
   - Output Directory: **LEAVE EMPTY** (Next.js auto-configures this)
   - Install Command: `npm install` (or leave empty)
   - Development Command: `npm run dev` (or leave empty)

4. **Save** and **redeploy**

### Option 2: Delete and Re-import Project

If the above doesn't work:

1. **Delete the project** from Vercel dashboard
2. **Re-import** from GitHub
3. When importing, make sure to select:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (current directory)
4. Deploy

### Option 3: Via Vercel CLI

```bash
# Delete existing deployment configuration
rm -rf .vercel

# Redeploy with explicit framework
vercel --force

# When prompted:
# - Set up and deploy? Yes
# - Which scope? [Your team/personal]
# - Link to existing project? No
# - Project name? haya-studio-demo
# - Directory? ./ (press Enter)
# - Override settings? Yes
# - Build Command? npm run build
# - Output Directory? (leave empty, press Enter)
# - Development Command? npm run dev
```

## Why This Happens

Vercel tries to auto-detect the framework, but sometimes it fails and defaults to treating the project as a static site (looking for a `public` folder). By explicitly setting the Framework Preset to "Next.js", Vercel knows to:

1. Use Next.js build commands
2. Look for `.next` output (not `public`)
3. Configure serverless functions properly
4. Handle Edge Runtime routes

## Verify Deployment

After fixing the settings, your deployment logs should show:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (7/7)
✓ Deployment ready
```

And your app will be live at:
- `https://your-project.vercel.app/login`
- `https://your-project.vercel.app/manager`
- `https://your-project.vercel.app/instructor`

## Quick Test

After deployment, test these features:

1. **Login Page**: Visit `/login`
   - Try Manager login (password: demo123)
   - Try Instructor login (select any instructor, password: demo123)

2. **Manager Dashboard**: Visit `/manager`
   - Change date
   - View instructor availability
   - Click "Download PNG" (tests Edge Runtime)

3. **Instructor Portal**: Visit `/instructor`
   - Add weekly availability
   - Add a leave period
   - View 7-day preview

## Still Having Issues?

If you're still seeing the error after configuring the Framework Preset:

1. **Check Node.js version**: Vercel uses Node.js 18+ by default (our `package.json` specifies `>=18.17.0`)

2. **Clear Vercel build cache**:
   - In Vercel Dashboard → Deployments → [Latest Deployment]
   - Click "..." → Redeploy → Check "Clear Build Cache"

3. **Verify dependencies**: Make sure `package.json` includes:
   ```json
   {
     "dependencies": {
       "next": "^14.2.0",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "@vercel/og": "^0.6.2"
     }
   }
   ```

4. **Check build locally**:
   ```bash
   npm install
   npm run build
   ```
   Should complete without errors and create `.next` directory.

## Environment Variables

**None required!** This demo works out of the box with no environment variables.

## Custom Domain

After successful deployment, you can add a custom domain:
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Configure DNS as instructed

---

**Need help?** Check the [main README.md](./README.md) for more details about the project structure and features.
