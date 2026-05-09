const CodeEditorView = () => {
  const iframeRef = React.useRef(null);

  const sendKey = () => {
    const url = window.getAmdUrl ? window.getAmdUrl() : '';
    if (url && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'AMD_URL', url }, '*');
    }
  };

  return (
    <iframe
      ref={iframeRef}
      src="vscode.html"
      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      title="VS Code — meridian-platform"
      onLoad={sendKey}
    />
  );
};

window.CodeEditorView = CodeEditorView;
