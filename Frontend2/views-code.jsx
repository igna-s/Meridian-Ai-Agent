const CodeEditorView = () => (
  <iframe
    src="vscode.html"
    style={{ width: "100%", height: "100%", border: "none", display: "block" }}
    title="VS Code — meridian-platform"
  />
);

window.CodeEditorView = CodeEditorView;
