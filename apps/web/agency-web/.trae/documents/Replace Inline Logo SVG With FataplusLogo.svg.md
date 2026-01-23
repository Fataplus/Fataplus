## Target
- Replace the inline SVG in `src/components/assets/Logo.astro:10-22` with the file `src/images/brands/FataplusLogo.svg`.
- Keep existing props so `class` and other attributes still work where `<Logo />` is used (Desktop/Mobile nav).

## Implementation
- Import asset: `import FataplusLogo from '@/images/brands/FataplusLogo.svg'` in `Logo.astro:1-8`.
- Render using Astro assets:
  - Use `<Image src={FataplusLogo} alt='Fataplus Logo' class={className} {...rest} />` to preserve size classes and attrs.
  - Remove the current hardcoded `<svg>` markup.
- Verify usage in:
  - `src/components/navigation/DesktopNav.astro:20`
  - `src/components/navigation/MobileNav.astro:17`

## Notes
- The provided SVG uses fixed fills (`#18CF4C`); color classes like `text-base-900` will no longer alter its color. Size/layout classes still apply.
- If you want color-theming via `currentColor`, I can optionally convert fills in `FataplusLogo.svg` to `currentColor` after this change.

## Validation
- Run dev and check header in light/dark modes.
- Confirm image renders without layout shifts.

Approve and I will apply the change, verify locally, and adjust if you want themeable color.