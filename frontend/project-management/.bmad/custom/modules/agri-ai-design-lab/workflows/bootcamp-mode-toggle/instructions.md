# Bootcamp Mode Toggle Instructions

<workflow>
  <step n="1" goal="Determine current mode">
    <action>Check config value `bootcamp_mode_default` and any runtime overrides.</action>
  </step>
  <step n="2" goal="Collect preferences">
    <action>Ask user whether to enable or disable bootcamp mode.</action>
    <action>Capture cohort name, session date, and language preferences if enabling.</action>
  </step>
  <step n="3" goal="Apply changes">
    <action>Update in-memory settings (no file writes unless explicitly instructed).</action>
    <action>Adjust communication style and output paths if provided.</action>
  </step>
  <step n="4" goal="Confirm">
    <action>Summarize new mode, highlight behavior differences, and list next recommended workflows.</action>
  </step>
</workflow>
