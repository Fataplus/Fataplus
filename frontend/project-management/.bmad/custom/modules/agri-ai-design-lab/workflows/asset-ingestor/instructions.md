# Asset Ingestor Instructions

<workflow>
  <step n="1" goal="Identify assets">
    <action>Gather provided files (transcripts, CSVs, notes, photos).</action>
    <action>List metadata: author, date, location, language.</action>
  </step>
  <step n="2" goal="Assess quality">
    <action>Flag missing context, low audio quality, or translation needs.</action>
  </step>
  <step n="3" goal="Summarize & structure">
    <action>Extract key observations, quotes, metrics.</action>
    <action>Normalize into schema: {source, persona, need, pain, opportunity}.</action>
  </step>
  <step n="4" goal="Output dataset">
    <action>Populate template table and save into {output_folder}/research.</action>
    <action>List follow-up actions (e.g., request transcription).</action>
  </step>
</workflow>
