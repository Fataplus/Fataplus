# 🚀 Fataplus CI/CD Pipeline

This repository uses GitHub Actions for continuous integration and deployment (CI/CD) of the Fataplus agricultural platform.

## 📋 **Pipeline Overview**

Our CI/CD pipeline automatically:

1. **🔍 Code Quality** - Linting, type checking, security audits
2. **🧪 Testing** - Unit, integration, and E2E tests
3. **🏗️ Building** - Production-ready builds
4. **🚀 Deployment** - Automatic deployment to NuxtHub/Cloudflare Workers
5. **📊 Monitoring** - Performance and security audits
6. **🔍 Preview** - PR preview deployments

## 🔄 **Workflow Triggers**

### Main Pipeline (`.github/workflows/ci-cd.yml`)
- **Push to `main`**: Full pipeline + production deployment
- **Push to `develop`**: Full pipeline (no deployment)
- **Pull Requests**: Full pipeline + preview deployment

### Manual Triggers
- Repository dispatch events
- Workflow dispatch (manual trigger)

## 🚀 **Deployment Strategy**

### Production Deployment
- **Trigger**: Push to `main` branch
- **Target**: https://fataplus-app.fenohery.workers.dev
- **Platform**: NuxtHub (Cloudflare Workers)
- **Features**: 
  - D1 Database (SQLite)
  - R2 Object Storage
  - KV Key-Value Store
  - Global CDN

### Preview Deployments
- **Trigger**: Pull requests
- **Target**: `https://preview-{PR_NUMBER}.fataplus-app.fenohery.workers.dev`
- **Duration**: Available until PR is merged/closed
- **Features**: Full feature parity with production

## 🔐 **Required Secrets**

> 📖 **Detailed Setup**: See [DEPLOYMENT_SECRETS.md](./DEPLOYMENT_SECRETS.md)

| Secret | Description | Required For |
|--------|-------------|--------------|
| `AUTH_SECRET` | JWT authentication secret | Authentication |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API access | Deployment |
| `NUXT_HUB_PROJECT_SECRET_KEY` | NuxtHub project auth | Deployment |
| `CLOUDINARY_URL` | Cloudinary image service | Image uploads |

## 🧪 **Testing Strategy**

### Test Types
- **Unit Tests**: `pnpm run test:unit` - Component/function testing
- **Integration Tests**: `pnpm run test:integration` - API/database testing  
- **E2E Tests**: `pnpm run test:e2e` - Full user workflow testing

### Test Environment
- **Database**: In-memory SQLite (`:memory:`)
- **Authentication**: Test JWT secret
- **Services**: Mocked external APIs

### Coverage Requirements
- **Minimum**: 70% code coverage
- **Target**: 85% code coverage
- **Critical paths**: 95% coverage (auth, payments, admin)

## 📊 **Quality Gates**

### Code Quality
- ✅ ESLint (zero errors)
- ✅ TypeScript compilation
- ✅ Prettier formatting
- ✅ Security audit (no high/critical vulnerabilities)

### Performance
- ✅ Build size limits (< 2MB)
- ✅ Lighthouse scores (Performance > 90)
- ✅ Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Security
- ✅ No hardcoded secrets
- ✅ Dependencies audit
- ✅ OWASP security checks
- ✅ SSL/TLS validation

## 🔧 **Pipeline Jobs**

### 1. 🔍 `lint-and-typecheck`
- Runs ESLint for code quality
- TypeScript compilation check
- Security audit of dependencies
- **Duration**: ~2 minutes

### 2. 🧪 `test` (Matrix)
- Runs unit and integration tests in parallel
- Matrix strategy for different test types
- Uploads coverage reports
- **Duration**: ~3-5 minutes

### 3. 🎭 `e2e-tests`
- Playwright E2E tests
- Full browser automation
- Screenshot artifacts on failure
- **Duration**: ~5-10 minutes

### 4. 🏗️ `build`
- Production build with optimizations
- Build artifact uploads
- Bundle size analysis
- **Duration**: ~2-3 minutes

### 5. 🚀 `deploy-production` (main only)
- NuxtHub deployment
- Environment variable injection
- Deployment verification
- **Duration**: ~3-5 minutes

### 6. 🔍 `deploy-preview` (PRs only)
- Preview environment deployment
- PR comment with preview URL
- SuperAdmin credentials included
- **Duration**: ~3-5 minutes

### 7. 📊 `lighthouse`
- Performance audit
- Accessibility checks
- SEO optimization
- **Duration**: ~2-3 minutes

### 8. 🚨 `notify`
- Success/failure notifications
- Deployment status updates
- Team alerts
- **Duration**: ~30 seconds

## 🎯 **Branch Strategy**

### Protected Branches
- **`main`**: Production branch (requires PR + reviews)
- **`develop`**: Development branch (staging)

### Branch Rules
- ✅ Require PR before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require linear history
- ✅ Include administrators

## 📱 **Mobile & Responsive Testing**

### Device Testing (E2E)
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: iPhone 12, Samsung Galaxy S21
- **Tablet**: iPad, Android tablet
- **Low bandwidth**: 3G simulation

### Responsive Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+
- **Ultra-wide**: 1440px+

## 🇲🇬 **Madagascar Context**

### Localization Testing
- **French (FR)**: Primary language
- **Malagasy (MG)**: Secondary language
- **Currency**: Madagascar Ariary (MGA)
- **Products**: Local agricultural products

### Regional Considerations
- **Connectivity**: Low bandwidth optimization
- **Devices**: Mobile-first approach
- **Payment**: Local payment methods
- **Culture**: Agricultural calendar awareness

## 🔄 **Continuous Improvement**

### Metrics Tracking
- **Build time**: Target < 15 minutes total
- **Test execution**: Target < 10 minutes
- **Deployment time**: Target < 5 minutes
- **Success rate**: Target > 95%

### Regular Maintenance
- **Monthly**: Dependency updates
- **Quarterly**: Security audit
- **Bi-annually**: Performance review
- **Annually**: Infrastructure assessment

## 🛠️ **Troubleshooting**

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules .nuxt .output
pnpm install
pnpm run build
```

#### Test Failures
```bash
# Run tests locally
pnpm run test:unit
pnpm run test:integration
pnpm run test:e2e --debug
```

#### Deployment Issues
```bash
# Check environment variables
echo $AUTH_SECRET
echo $CLOUDFLARE_API_TOKEN
echo $NUXT_HUB_PROJECT_SECRET_KEY

# Manual deployment
pnpm run deploy
```

### Debug Mode
Enable debug logging by adding this to your workflow:

```yaml
env:
  DEBUG: true
  ACTIONS_STEP_DEBUG: true
```

## 📞 **Support**

### Pipeline Issues
- Check workflow logs in GitHub Actions tab
- Review [DEPLOYMENT_SECRETS.md](./DEPLOYMENT_SECRETS.md)
- Verify environment variables
- Test locally first

### Production Issues
- Check [NuxtHub Admin Panel](https://admin.hub.nuxt.com)
- Monitor Cloudflare Dashboard
- Review application logs
- Check database health

### Team Contacts
- **DevOps**: Fataplus DevOps Team
- **Backend**: Fataplus Backend Team  
- **Frontend**: Fataplus Frontend Team
- **Product**: Fataplus Product Team

---

## 🎉 **Getting Started**

1. **📋 Setup secrets** (see [DEPLOYMENT_SECRETS.md](./DEPLOYMENT_SECRETS.md))
2. **🔧 Configure environments** in GitHub repository settings
3. **🚀 Push to main** to trigger first deployment
4. **✅ Verify** deployment at https://fataplus-app.fenohery.workers.dev

**Happy coding! 🌾🇲🇬** 