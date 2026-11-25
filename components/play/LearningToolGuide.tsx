export function LearningToolGuide({kind}: {kind: 'json-studio' | 'text-compare'}) {
  return <article className="prose-page">
    {kind === 'json-studio' ? <>
      <h2>How to validate, format and compare JSON</h2>
      <p>Paste an API response or configuration into Source JSON. Choose Validate &amp; format to check its syntax and indent the result, or Minify to remove formatting whitespace. JSON requires double-quoted property names and does not accept comments or trailing commas.</p>
      <p>To compare two documents, put the second one in Comparison JSON and choose Compare JSON. The result lists added, removed and changed values at their paths. Object property order is ignored; array order matters.</p>
      <h3>Read a comparison result</h3>
      <p>If one document has <code>{'{"active":true}'}</code> and the other has <code>{'{"active":false}'}</code>, the result shows a changed value at <code>{'$["active"]'}</code>. Compare the before and after values before applying a change to your application.</p>
      <p>After formatting, expand the value tree and use Copy path to copy a bracket-notation path. Copy source copies the left input. Download JSON exports that input, including formatting changes you have applied; it does not export a difference report.</p>
      <h3>Input and display limits</h3>
      <p>Each input accepts up to 50,000 characters. Comparison shows at most 200 differences. The value tree displays up to 100 entries per object or array and stops expanding after 12 nested levels. Keep the original file when inspecting a larger document.</p>
      <h3>Privacy and saving</h3>
      <p>Validation and comparison run in this browser. Inputs are not uploaded or saved automatically. Copy or download your result before leaving the page.</p>
    </> : <>
      <h2>How to compare two text versions</h2>
      <p>Paste the earlier version into Original text and the newer version into Changed text, then choose Compare text. The result keeps matching lines in sequence and marks removed lines with a minus sign and added lines with a plus sign. A replacement can appear as a removal followed by an addition.</p>
      <h3>Understand the whitespace option</h3>
      <p>Ignore whitespace removes all whitespace within each line when deciding whether two lines match. For example, <code>a b</code> and <code>ab</code> count as the same line with this option enabled. Keep it off when spaces are meaningful, such as Python indentation or text inside a string.</p>
      <p>Changing a word from <code>Learn</code> to <code>Practise</code> produces one removed line and one added line. This tool compares lines rather than highlighting individual changed characters. It does not merge the two inputs.</p>
      <h3>Limits and copying</h3>
      <p>Each input accepts up to 50,000 characters, and the comparison accepts at most 400 lines per side. Copy source copies Original text; it does not copy the combined difference view. Split a longer document into smaller sections to inspect it.</p>
      <h3>Privacy and saving</h3>
      <p>Comparison runs on your device. Inputs are not uploaded or saved automatically. Keep a separate copy of your work before closing the page.</p>
    </>}
    <p><a href="/tools">Browse coding tools</a> · <a href={kind === 'json-studio' ? '/tools/text-compare' : '/tools/json-studio'}>{kind === 'json-studio' ? 'Compare plain text' : 'Compare JSON values'}</a> · <a href="/privacy">Privacy details</a></p>
  </article>;
}
