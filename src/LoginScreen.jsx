import { useState } from "react";
import { Plane, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const C = {
  green: "#006B3F",
  greenLight: "#00895A",
  greenPale: "#E8F5EE",
  greenDark: "#004D2C",
  sand: "#FAF7F2",
  coral: "#E8734A",
  slate: "#1E293B",
  slateLight: "#64748B",
  slatePale: "#94A3B8",
  white: "#FFFFFF",
  border: "#E2E8F0",
  bg: "#F8FAFC",
};

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email.includes("@")) {
      setError("Introduce un email válido");
      return;
    }
    if (mode !== "forgot" && password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }
    setLoading(true);
    // simulamos delay de red
    setTimeout(() => {
      setLoading(false);
      if (mode === "forgot") {
        alert("Se ha enviado un enlace de recuperación a " + email);
        setMode("login");
        return;
      }
      onLogin({ email, name: name || email.split("@")[0] });
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(165deg, ${C.green} 0%, ${C.greenDark} 50%, ${C.slate} 100%)`,
      }}
    >
      {/* top hero */}
      <div
        style={{
          flex: "0 0 auto",
          padding: "60px 24px 40px",
          textAlign: "center",
          color: C.white,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "rgba(255,255,255,.15)",
            backdropFilter: "blur(10px)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Plane size={36} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>FlyCanarias</h1>
        <p style={{ fontSize: 15, opacity: 0.8, margin: 0 }}>Vuelos interislas al mejor precio</p>
      </div>

      {/* card */}
      <div
        style={{
          flex: 1,
          background: C.white,
          borderRadius: "28px 28px 0 0",
          padding: "32px 24px 40px",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.slate, marginBottom: 4 }}>
          {mode === "login"
            ? "Iniciar sesión"
            : mode === "register"
            ? "Crear cuenta"
            : "Recuperar contraseña"}
        </h2>
        <p style={{ fontSize: 14, color: C.slateLight, marginBottom: 24 }}>
          {mode === "login"
            ? "Accede a tus vuelos y reservas"
            : mode === "register"
            ? "Regístrate para empezar a volar"
            : "Te enviaremos un enlace al email"}
        </p>

        {/* name field (register only) */}
        {mode === "register" && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
              Nombre completo
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: "0 14px",
                background: C.bg,
              }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Manuel Bianchi"
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  padding: "14px 0",
                  fontSize: 15,
                  color: C.slate,
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}

        {/* email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
            Email
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1.5px solid ${error && !email.includes("@") ? C.coral : C.border}`,
              borderRadius: 12,
              padding: "0 14px",
              background: C.bg,
              transition: "border-color .2s",
            }}
          >
            <Mail size={18} color={C.slatePale} />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="tu@email.com"
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                padding: "14px 0",
                fontSize: 15,
                color: C.slate,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* password */}
        {mode !== "forgot" && (
          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
              Contraseña
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: `1.5px solid ${error && password.length < 4 ? C.coral : C.border}`,
                borderRadius: 12,
                padding: "0 14px",
                background: C.bg,
                transition: "border-color .2s",
              }}
            >
              <Lock size={18} color={C.slatePale} />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  padding: "14px 0",
                  fontSize: 15,
                  color: C.slate,
                  outline: "none",
                }}
              />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                {showPw ? <EyeOff size={18} color={C.slatePale} /> : <Eye size={18} color={C.slatePale} />}
              </button>
            </div>
          </div>
        )}

        {/* forgot link */}
        {mode === "login" && (
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <button
              onClick={() => { setMode("forgot"); setError(""); }}
              style={{ background: "none", border: "none", color: C.green, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0" }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        {/* error */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 10,
              color: "#DC2626",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: loading ? C.slateLight : C.green,
            color: C.white,
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: mode !== "login" ? 20 : 0,
            transition: "background .2s",
          }}
        >
          {loading ? (
            <span>Cargando...</span>
          ) : (
            <>
              {mode === "login" ? "Entrar" : mode === "register" ? "Crear cuenta" : "Enviar enlace"}
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* social login */}
        {mode !== "forgot" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "24px 0",
                color: C.slatePale,
                fontSize: 13,
              }}
            >
              <div style={{ flex: 1, height: 1, background: C.border }} />
              o continúa con
              <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {["Google", "Apple"].map((provider) => (
                <button
                  key={provider}
                  onClick={() => onLogin({ email: "demo@flycanarias.com", name: "Manuel Bianchi" })}
                  style={{
                    flex: 1,
                    padding: "14px",
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 12,
                    background: C.white,
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.slate,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{provider === "Google" ? "G" : ""}</span>
                  {provider}
                </button>
              ))}
            </div>
          </>
        )}

        {/* toggle mode */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          {mode === "login" ? (
            <span style={{ fontSize: 14, color: C.slateLight }}>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => { setMode("register"); setError(""); }}
                style={{ background: "none", border: "none", color: C.green, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                Regístrate
              </button>
            </span>
          ) : (
            <span style={{ fontSize: 14, color: C.slateLight }}>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => { setMode("login"); setError(""); }}
                style={{ background: "none", border: "none", color: C.green, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                Iniciar sesión
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
