## Goal
- Use `src/images/brands/Fataplus-Fav.svg` for the header logo and the site favicon.

## Implementation
- Update `src/components/assets/Logo.astro` to import `@/images/brands/Fataplus-Fav.svg` and render it via `<img>` with the existing `class` and props.
- Update `src/components/fundations/head/Favicons.astro` to reference the same SVG for the favicon (use an imported asset as the `href`).

## Notes
- Keep the current normalization for SVG imports (string vs object with `src`) to avoid broken images.
- The new favicon will be an SVG; keep `type="image/svg+xml"` in the `<link rel="icon" ...>` tag.

## Validation
- Hot-reload in dev and confirm the header displays the new logo.
- Open the page head to confirm the favicon link points to `Fataplus-Fav.svg`.
- Check the browser tab to verify the favicon updates.