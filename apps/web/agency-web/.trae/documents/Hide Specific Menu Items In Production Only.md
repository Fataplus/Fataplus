## Summary
Hide only the specified items in production and keep the rest visible:
- Links to: Sign In, Sign Up, Buttons, Colors, Typography
- Language selector button/component
Ensure desktop and mobile navigation both follow these rules.

## Changes
- Update `src/components/navigation/NavigationLinks.astro`
  - Add `const isProd = import.meta.env.PROD`.
  - Filter `navigationItems` when `isProd` is true to exclude items with `href`:
    - `/forms/signin`, `/forms/signup`, `/system/buttons`, `/system/colors`, `/system/typography`.
  - Render the (filtered) items as usual.

- Update `src/components/navigation/DesktopNav.astro`
  - Keep `<NavigationLinks />` visible (remove broad production gating).
  - Keep `<BlogSearch />` visible.
  - Hide only `<LanguageSwitcher />` in production using `isProd`:
    - `{!isProd && <LanguageSwitcher />}` at `src/components/navigation/DesktopNav.astro:28`.

- Update `src/components/navigation/MobileNav.astro`
  - Keep the menu toggle `<button id="menubutton">` visible (remove broad gating).
  - Keep `<NavigationLinks />` visible.
  - Hide only `<LanguageSwitcher />` in production using `isProd`:
    - `{!isProd && <LanguageSwitcher />}` near `src/components/navigation/MobileNav.astro:21–23`.

## Validation
- Run `npm run build` to ensure Astro compiles and static routes generate.
- Quick spot-check: 
  - In dev (`astro dev`), all items are visible.
  - In production build, the specified links and language selector are removed while other menu items remain.

## Version Control
- Commit with message: `feat(nav): hide specific items in production (signin, signup, system buttons/colors/typography, language selector)`.
- Push to `origin/main`.
- Confirm CI/build passes.

## Rollback Notes
- The previous broad gating that hid whole nav elements will be reverted to avoid over-hiding.

Would you like me to proceed with these changes and push to main?