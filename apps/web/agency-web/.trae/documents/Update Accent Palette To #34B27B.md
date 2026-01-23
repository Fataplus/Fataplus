## Goal
- Change the app accent palette to a green based on `#34B27B` while keeping the Base (neutral) palette unchanged.
- Ensure the Colors system page reflects the new accent shades.

## Implementation
- Edit `src/styles/global.css`:
  - Set `--color-accent-500: #34B27B`.
  - Define `--color-accent-{50..950}` using CSS `color-mix(in oklch, #34B27B <percent>, white/black)` to produce consistent tints/shades:
    - Light tints: `accent-50..accent-400` via mix with `white` (10%, 20%, 40%, 60%).
    - Base: `accent-500 = #34B27B`.
    - Dark shades: `accent-600..accent-950` via mix with `black` (15%, 30%, 45%, 60%, 75%).
- Do not modify any `--color-base-*` variables.
- Keep Content palette mapped to Base neutrals as-is.
- No component code changes required; existing `bg-accent-*` and `text-accent-*` classes will pick up new values automatically.

## Validation
- Open `http://localhost:4321/system/colors` and confirm:
  - Accent swatches display as green across the full scale.
  - Base and Content sections remain unchanged.
- Spot-check a few UI elements using accent colors (buttons, outlines) to confirm visual update.

## Notes
- Using `oklch` with `color-mix` keeps perceptual uniformity across tints/shades.
- If you prefer exact HEX values for each shade instead of `color-mix`, I can provide a fixed palette after you approve this approach.