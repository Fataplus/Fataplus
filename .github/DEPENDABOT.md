# 🤖 Dependabot Configuration - Fataplus

## 📋 Overview

Dependabot automatically monitors and updates dependencies for the Fataplus agricultural platform. This ensures we stay up-to-date with security patches and feature improvements.

## 🕐 Schedule

| Ecosystem | Day | Time (Madagascar) | Frequency |
|-----------|-----|-------------------|-----------|
| **NPM Dependencies** | Monday | 09:00 | Weekly |
| **Docker** | Tuesday | 10:00 | Weekly |
| **GitHub Actions** | Wednesday | 11:00 | Weekly |

## 📦 Dependency Groups

### 🎯 Nuxt Ecosystem
- `nuxt*`, `@nuxt/*`, `@nuxthub/*`
- `h3`, `nitro*`
- **Auto-merge**: Patch & Minor updates

### 🖼️ Vue Ecosystem  
- `vue*`, `@vue/*`
- **Auto-merge**: Patch & Minor updates

### 📘 TypeScript Ecosystem
- `typescript`, `@typescript-eslint/*`, `@types/*`
- **Auto-merge**: Patch & Minor updates

### 🔒 Security Updates
- **ALL packages** for security vulnerabilities
- **Highest Priority** - Manual review required

## 🚀 Process

1. **Dependabot scans** dependencies weekly
2. **Creates PRs** for outdated packages
3. **CI/CD runs** quality checks automatically
4. **Auto-merge** for patch/minor if tests pass
5. **Manual review** required for major updates

## 🔧 Managing Dependencies

### ✅ Safe to Auto-merge
- ✅ Patch updates (1.2.3 → 1.2.4)
- ✅ Minor updates (1.2.0 → 1.3.0)
- ✅ Security patches (any version)

### ⚠️ Requires Review
- ⚠️ Major updates (1.x.x → 2.x.x)
- ⚠️ Breaking changes in ecosystem
- ⚠️ Beta/RC versions

### ❌ Manual Actions

```bash
# Update specific package manually
npm update @nuxthub/core

# Check for security vulnerabilities
npm audit

# Fix security issues
npm audit fix
```

## 🏷️ Labels

- `dependencies` - All dependency updates
- `automerge` - Safe for automatic merging
- `security` - Security-related updates
- `breaking-change` - Requires careful review

## 🇲🇬 Madagascar-Specific

- **Timezone**: Indian/Antananarivo
- **Business hours**: Updates scheduled during working hours
- **Internet considerations**: Grouped updates to minimize bandwidth usage

---

**🎯 Goal**: Keep Fataplus secure, modern, and efficient with minimal manual intervention! 