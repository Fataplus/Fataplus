# 🔐 GitHub Secrets Setup for Fataplus CI/CD

This document outlines the GitHub secrets required for the Fataplus CI/CD pipeline to work properly.

## 🚀 Required Secrets

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 1. 🔑 **AUTH_SECRET**
- **Name**: `AUTH_SECRET`
- **Value**: Your JWT authentication secret (minimum 32 characters)
- **Example**: `your-super-secure-jwt-secret-key-here-min-32-chars`
- **Used for**: JWT token signing/verification in production

```bash
# Generate a secure secret:
openssl rand -base64 32
```

### 2. 🌐 **CLOUDFLARE_API_TOKEN**
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Value**: Your Cloudflare API token with Workers deployment permissions
- **Used for**: NuxtHub deployment to Cloudflare Workers

#### How to create Cloudflare API Token:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Custom token"** template
4. **Permissions needed**:
   - `Zone:Zone:Read` (for your domain)
   - `Zone:DNS:Edit` (for your domain)
   - `Account:Workers Scripts:Edit`
   - `Account:Workers Subdomain:Edit`
   - `Account:Workers KV Storage:Edit`
   - `Account:Workers Observability:Edit` ⚠️ **Required for NuxtHub**
5. **Account Resources**: `Include - All accounts`
6. **Zone Resources**: `Include - All zones` or specific zone
7. **Client IP Address Filtering**: Leave empty
8. **TTL**: Set appropriate expiration

### 3. 🎯 **NUXT_HUB_PROJECT_SECRET_KEY**
- **Name**: `NUXT_HUB_PROJECT_SECRET_KEY`
- **Value**: Your NuxtHub project secret key
- **Used for**: NuxtHub project authentication

### 4. 🎨 **CLOUDINARY_URL**
- **Name**: `CLOUDINARY_URL`
- **Value**: `cloudinary://117237553857868:NuL2vSW7KgYMG51NU-XQzZInFVk@fefe-design`
- **Used for**: Image upload and management in production

#### How to get NuxtHub Project Secret:
1. Go to [NuxtHub Admin Panel](https://admin.hub.nuxt.com)
2. Select your `fataplus-app` project
3. Go to **Settings** → **General**
4. Copy the **Project Secret Key**

## 🌍 Environment Setup

### Production Environment
Create a production environment in your GitHub repository:

1. Go to **Settings** → **Environments**
2. Click **"New environment"**
3. Name: `production`
4. **Environment protection rules**:
   - ✅ Required reviewers (optional)
   - ✅ Wait timer: 0 minutes
   - ✅ Restrict pushes to protected branches
5. **Environment secrets**: Add the above secrets here as well

### Preview Environment (Optional)
For PR preview deployments:

1. Name: `preview`
2. Same secrets as production
3. Less restrictive protection rules

## 🔍 Verification

Test your secrets by pushing to the `main` branch. The CI/CD pipeline should:

1. ✅ Build successfully
2. ✅ Run all tests
3. ✅ Deploy to production
4. ✅ Show deployment URL in logs

## 🚨 Security Best Practices

1. **Rotate secrets regularly** (every 90 days)
2. **Use environment protection** for production
3. **Monitor secret usage** in Actions logs
4. **Never commit secrets** to code
5. **Use least privilege** for API tokens

## 📚 Useful Links

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Cloudflare API Tokens](https://developers.cloudflare.com/api/tokens/)
- [NuxtHub Documentation](https://hub.nuxt.com)
- [NuxtHub Deployment Guide](https://hub.nuxt.com/docs/getting-started/deploy)

---

## ⚡ Quick Setup Commands

```bash
# 1. Generate AUTH_SECRET
openssl rand -base64 32

# 2. Add to GitHub Secrets (via UI)
# 3. Get Cloudflare token (via UI)
# 4. Get NuxtHub secret (via UI)

# 5. Test deployment
git add .
git commit -m "🚀 Setup CI/CD pipeline"
git push origin main
```

**Note**: After setting up all secrets, your first push to main will trigger the full CI/CD pipeline! 🎉 