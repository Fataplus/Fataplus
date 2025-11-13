# Data Readiness Audit Instructions

<workflow>
  <step n="1" goal="Inventory data sources">
    <action>List all relevant datasets, APIs, spreadsheets, and manual logs.</action>
    <action>Capture owners, formats, frequencies, and access constraints.</action>
  </step>
  <step n="2" goal="Assess quality & governance">
    <action>Evaluate completeness, accuracy, latency, and security.</action>
    <action>Identify privacy, compliance, or ethical concerns.</action>
  </step>
  <step n="3" goal="Evaluate infrastructure">
    <action>Review current stack (cloud, on-prem, connectivity) and tooling.</action>
    <action>Highlight gaps for AI deployment (edge cases, MLOps, monitoring).</action>
  </step>
  <step n="4" goal="Summarize readiness">
    <action>Score readiness levels (High/Medium/Low) for each concept.</action>
    <action>Recommend remediation and prerequisites.</action>
  </step>
  <step n="5" goal="Output report">
    <action>Fill template, store under {output_folder}/data-readiness, share next steps.</action>
  </step>
</workflow>
