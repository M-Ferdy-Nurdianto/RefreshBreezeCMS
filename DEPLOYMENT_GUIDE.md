# 🚀 Deployment Guide for Vercel

This guide will help you deploy your **Refresh Breeze** project to Vercel step-by-step.

## 1. Prepare Environment Variables

We have created a file ready for import: `vercel-env-import.txt`.

1. Open `vercel-env-import.txt` in your editor.
2. **IMPORTANT**: Update `FRONTEND_URL` to match your Vercel project's domain (e.g., `https://refresh-breeze-remake.vercel.app`).
   - If you don't know it yet, you can deploy once, get the URL, update the variable in Vercel settings, and redeploy.

## 2. Deploy using Vercel CLI (Recommended)

This method is the fastest and allows us to configure everything interactively.

1.  **Open Terminal** in the root directory (`c:\Githab\RB Remake`).
2.  Install Vercel CLI (if not installed):
    ```powershell
    npm install -g vercel
    ```
3.  Login to Vercel:
    ```powershell
    vercel login
    ```
4.  Initialize Deployment:

    ```powershell
    vercel
    ```

    Answer the prompts as follows:
    - **Set up and deploy?** `Y`
    - **Which scope?** (Select your account)
    - **Link to existing project?** `N` (Create new)
    - **Project Name?** `refresh-breeze-remake` (or your preference)
    - **In which directory is your code located?** `./` (Keep default)

    **Auto-detected settings:**
    Vercel might try to auto-detect a framework. Since this is a monorepo with custom config, we need to be careful.
    - **Want to modify these settings?** `Y`
    - **Build Command:** `npm run vercel-build` (We added this to root package.json)
    - **Output Directory:** `frontend/dist`
    - **Install Command:** `npm run install:all`

    _(Note: If Vercel asks for specific Framework preset, choose "Other" or "Vite" but ensure the Output Directory is correct)._

## 3. Configure Environment Variables on Vercel Dashboard

1.  Go to your Vercel Dashboard for the new project.
2.  Navigate to **Settings** > **Environment Variables**.
3.  Copy the content from `vercel-env-import.txt` (or copy-paste key-value pairs manually).
    - ensure `VITE_API_URL` is set to `/api`.
    - ensure `NODE_ENV` is `production`.

## 4. Final Deploy

After setting environment variables, you may need to redeploy for them to take effect.

```powershell
vercel --prod
```

## Troubleshooting

- **404 on API Routes**: Check `vercel.json` rewrites. It should direct `/api/*` to `api/index.js`.
- **Frontend Assets Not Loading**: Ensure Output Directory was set to `frontend/dist`.
- **CORS Errors**: Check `FRONTEND_URL` in environment variables matches the actual Vercel URL.
