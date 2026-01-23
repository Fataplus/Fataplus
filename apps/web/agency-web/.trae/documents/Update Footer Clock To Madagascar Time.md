## Goal
- Make the footer clock div follow Madagascar time and reflect the correct city label.

## Implementation
- Update `src/components/global/Footer.astro`:
  - Change `toLocaleString` timezone from `"Europe/Helsinki"` to `"Indian/Antananarivo"` in `updateClock()`.
  - Update the location text from `"Helsinki, Finland"` to `"Antananarivo, Madagascar"`.
- Keep existing 12-hour formatting and interval updates unchanged.

## Notes
- Uses the IANA timezone `Indian/Antananarivo` (UTC+3, no DST).
- No changes to styles or layout.

## Validation
- Run the dev server and confirm the clock shows Madagascar time.
- Confirm the label displays `Antananarivo, Madagascar`. 