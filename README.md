# FataPlus - Agricultural Super App

## Project info

**URL**: https://lovable.dev/projects/a9149304-b64f-44d4-b66a-e061066f109d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a9149304-b64f-44d4-b66a-e061066f109d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- PocketBase (Database & Authentication)
- React Query
- React Router

## Database Setup

This project uses PocketBase as the database and authentication provider.

### Local Development

Follow these steps to set up your local development database:

1. Download PocketBase from [pocketbase.io](https://pocketbase.io/)
2. Run the setup script to initialize PocketBase with the correct schema:

```sh
./scripts/setup-pocketbase.sh
```

3. Access the PocketBase admin UI at http://127.0.0.1:8090/_/
4. Create an admin account
5. Update your environment variables in `.env.local` with your PocketBase URL:

```sh
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### Production

For production, the PocketBase instance is hosted at:

- **Application Name**: Fataplus
- **Application URL**: https://backend.fata.plus
- **Admin UI**: https://backend.fata.plus/_/

The production environment variables are configured in `.env.production`:

```sh
VITE_POCKETBASE_URL=https://backend.fata.plus
```

## Deployment with Vercel

This project is configured for deployment with Vercel and includes CI/CD workflows:

1. Sign up for a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm i -g vercel`
3. Login to Vercel: `vercel login`
4. Link your project: `vercel link`
5. Add your environment variables to Vercel:
   - VITE_POCKETBASE_URL
6. Deploy your project: `vercel --prod`

### GitHub Actions Integration

To enable automatic deployments with GitHub Actions, add these secrets to your GitHub repository:

- VERCEL_TOKEN: Your Vercel API token
- VERCEL_ORG_ID: Your Vercel organization ID
- VERCEL_PROJECT_ID: Your Vercel project ID
- VITE_POCKETBASE_URL: Your PocketBase URL

## Custom Domain Setup

To use a custom domain with your Vercel deployment:

1. Go to your project settings in Vercel
2. Navigate to the Domains section
3. Add your custom domain and follow the verification steps
