export default function LoginPage() {
  return (
    <html>
      <body style={{ background: "#0a0a0a", color: "#e8ff00", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>LOGIN PAGE</h1>
          <p>Page de connexion ArchiDZ</p>
          <a href="/register" style={{ color: "#e8ff00" }}>Register</a>
        </div>
      </body>
    </html>
  );
}
