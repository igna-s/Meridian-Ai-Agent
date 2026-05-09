const CodeEditorView = () => {
  const iframeRef = React.useRef(null);

  const sendKey = () => {
    const key = window.getGroqKey ? window.getGroqKey() : localStorage.getItem('meridian-groq-key') || '';
    if (key && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'GROQ_KEY', key }, '*');
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
