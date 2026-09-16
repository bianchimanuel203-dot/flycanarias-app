import { useState, useEffect, useMemo, createContext, useContext } from "react";
import { supabase } from "./lib/supabaseClient";
import {
  Plane,
  Search,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  User,
  Home,
  Ticket,
  Settings,
  ChevronRight,
  Star,
  Shield,
  Wifi,
  Coffee,
  Luggage,
  Check,
  X,
  Bell,
  Heart,
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  HelpCircle,
  Phone,
  ClipboardCheck,
  Activity,
  Camera,
  MessageCircle,
} from "lucide-react";

/* ─── palette & tokens (marca FlyCanarias, estilo Binter) ─── */
const LIGHT = {
  green: "#00833E",
  greenMid: "#00A651",
  greenLight: "#00A651",
  greenPale: "#E6F5EC",
  greenDark: "#005C2C",
  yellow: "#FFD100",
  yellowPale: "#FFF6CC",
  gold: "#FFD100",
  goldPale: "#FFF6CC",
  sand: "#F8F8F8",
  coral: "#E1584A",
  coralPale: "#FDEEEC",
  slate: "#1A1A1A",
  slateLight: "#5C5C5C",
  slatePale: "#8A8A8A",
  white: "#FFFFFF",
  surface: "#FFFFFF",
  border: "#E5E5E5",
  bg: "#F8F8F8",
  shadowSm: "0 2px 8px rgba(0,0,0,0.08)",
  shadowMd: "0 10px 28px rgba(0,0,0,.09)",
  shadowLg: "0 20px 48px rgba(0,0,0,.16)",
};

const DARK = {
  ...LIGHT,
  greenPale: "rgba(0,131,62,.22)",
  yellowPale: "rgba(255,209,0,.20)",
  goldPale: "rgba(255,209,0,.20)",
  coralPale: "rgba(225,88,74,.22)",
  slate: "#FFFFFF",
  slateLight: "#B3B3B3",
  slatePale: "#8A8A8A",
  surface: "#1E1E1E",
  border: "#2C2C2C",
  bg: "#121212",
  shadowSm: "0 2px 8px rgba(0,0,0,.4)",
  shadowMd: "0 10px 28px rgba(0,0,0,.5)",
  shadowLg: "0 20px 48px rgba(0,0,0,.6)",
};

const ThemeContext = createContext(LIGHT);
const useTheme = () => useContext(ThemeContext);

/* ─── persistencia local (localStorage) ─── */
const LS_KEYS = {
  darkMode: "fc_dark_mode",
  personal: "fc_personal_data",
  payments: "fc_payment_methods",
  notifications: "fc_notifications",
  favorites: "fc_favorite_destinations",
  settings: "fc_settings",
  bookings: "fc_bookings",
};
function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento no disponible (modo privado, cuota, etc.) — ignorar
  }
}

/* ─── real Canary Islands photography (Unsplash) ─── */
const UNSPLASH = {
  Tenerife: "https://images.unsplash.com/photo-1555990793-da11153b2473?w=400",
  "Gran Canaria": "https://images.unsplash.com/photo-1573946475837-c5280f4e2f6b?w=400",
  "La Palma": "https://images.unsplash.com/photo-1564518096949-e7c8e3b6e98a?w=400",
  Lanzarote: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=400",
};

/* ─── data ─── */
const AIRPORTS = [
  { code: "ACE", city: "Lanzarote", name: "César Manrique" },
  { code: "FUE", city: "Fuerteventura", name: "El Matorral" },
  { code: "LPA", city: "Gran Canaria", name: "Gran Canaria" },
  { code: "TFN", city: "Tenerife Norte", name: "Los Rodeos" },
  { code: "TFS", city: "Tenerife Sur", name: "Reina Sofía" },
  { code: "SPC", city: "La Palma", name: "Mazo" },
  { code: "GMZ", city: "La Gomera", name: "La Gomera" },
  { code: "VDE", city: "El Hierro", name: "El Hierro" },
];

const FLIGHTS = [
  { id: 1, from: "ACE", to: "LPA", dep: "07:15", arr: "07:55", price: 39, duration: "40min", seats: 12, aircraft: "ATR 72-600" },
  { id: 2, from: "ACE", to: "LPA", dep: "10:30", arr: "11:10", price: 49, duration: "40min", seats: 5, aircraft: "ATR 72-600" },
  { id: 3, from: "ACE", to: "LPA", dep: "14:00", arr: "14:40", price: 35, duration: "40min", seats: 22, aircraft: "ATR 72-600" },
  { id: 4, from: "ACE", to: "LPA", dep: "18:45", arr: "19:25", price: 55, duration: "40min", seats: 3, aircraft: "Embraer E195-E2" },
  { id: 5, from: "ACE", to: "TFN", dep: "08:00", arr: "08:55", price: 45, duration: "55min", seats: 18, aircraft: "Embraer E195-E2" },
  { id: 6, from: "FUE", to: "TFN", dep: "09:20", arr: "10:10", price: 42, duration: "50min", seats: 8, aircraft: "ATR 72-600" },
  { id: 7, from: "LPA", to: "SPC", dep: "11:00", arr: "11:45", price: 52, duration: "45min", seats: 14, aircraft: "ATR 72-600" },
];

const PROMOS = [
  { dest: "Tenerife", price: 29, tagline: "Escápate al Teide" },
  { dest: "Gran Canaria", price: 25, tagline: "Dunas de Maspalomas" },
  { dest: "La Palma", price: 35, tagline: "Isla Bonita te espera" },
  { dest: "Lanzarote", price: 32, tagline: "Paisajes volcánicos" },
];

const INITIAL_BOOKINGS = [
  {
    id: "FC-2026-4851",
    from: "ACE",
    to: "LPA",
    date: "18 Sep 2026",
    dep: "07:15",
    arr: "07:55",
    gate: "B4",
    seat: "12A",
    status: "confirmed",
  },
];

/* URL de producción registrada en Supabase Auth → Redirect URLs */
const OAUTH_REDIRECT_URL = "https://flycanarias-app.vercel.app";

/* ─── helpers ─── */
const airportName = (code) => AIRPORTS.find((a) => a.code === code);
const today = () => new Date().toISOString().split("T")[0];
const qrUrl = (data) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(data)}`;
const initials = (email) => (email ? email.slice(0, 2).toUpperCase() : "FC");
const formatBookingDate = (d) =>
  d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");

/* ─── shared style helpers (funciones de C para soportar modo oscuro) ─── */
const sectionTitle = (C) => ({
  fontSize: 16,
  fontWeight: 900,
  textTransform: "uppercase",
  color: C.slate,
  marginBottom: 14,
  letterSpacing: -0.2,
});
const priceStrong = (C) => ({ fontWeight: 900, color: C.green });
const badgeYellow = (C) => ({
  display: "inline-block",
  background: C.yellow,
  color: "#1A1A1A",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.3,
  padding: "5px 10px",
  borderRadius: 6,
});

/* ─── extras del flujo de reserva ─── */
const LUGGAGE_OPTIONS = [
  { value: "none", label: "Sin equipaje facturado", desc: "Solo equipaje de cabina (10kg)", price: 0 },
  { value: "1", label: "1 maleta 23kg", desc: "Una maleta facturada", price: 15 },
  { value: "2", label: "2 maletas 23kg", desc: "Dos maletas facturadas", price: 25 },
];
const INSURANCE_OPTIONS = [
  { value: "none", label: "Sin seguro", desc: "No añadir seguro de viaje", price: 0 },
  { value: "basic", label: "Seguro básico", desc: "Cobertura de cancelación", price: 8 },
  { value: "full", label: "Seguro completo", desc: "Cancelación + asistencia médica", price: 15 },
];
const SEAT_OPTIONS = [
  { value: "standard", label: "Asiento estándar", desc: "Ubicación asignada automáticamente", price: 0 },
  { value: "premium", label: "Extra legroom (filas 1-3)", desc: "Más espacio para las piernas", price: 12 },
];
const priceOf = (options, value) => options.find((o) => o.value === value)?.price || 0;

/* ─── shared white top header (logo + bell + avatar) ─── */
function TopHeader({ onNav, userEmail }) {
  const C = useTheme();
  return (
    <div
      style={{
        background: C.surface,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.3 }}>
        <span style={{ color: C.slate }}>Fly</span>
        <span style={{ color: C.green }}>Canarias</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          aria-label="Notificaciones"
          style={{ background: "none", border: "none", cursor: "pointer", color: C.slate, padding: 6, display: "flex" }}
        >
          <Bell size={22} />
        </button>
        <button
          onClick={() => onNav("profile")}
          aria-label="Perfil"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: C.green,
            color: C.white,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          {initials(userEmail)}
        </button>
      </div>
    </div>
  );
}

/* ─── green sub-header con botón volver (pantallas de perfil) ─── */
function SubHeader({ title, onBack }) {
  const C = useTheme();
  return (
    <div style={{ background: C.green, padding: "48px 20px 20px", color: C.white, display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={onBack}
        aria-label="Volver"
        style={{ background: "rgba(255,255,255,.16)", border: "none", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.white, flexShrink: 0 }}
      >
        <ArrowLeft size={18} />
      </button>
      <div style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", letterSpacing: -0.2 }}>{title}</div>
    </div>
  );
}

/* ─── toggle switch reutilizable ─── */
function Toggle({ on, onChange }) {
  const C = useTheme();
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      style={{ width: 46, height: 28, borderRadius: 14, border: "none", cursor: "pointer", background: on ? C.green : C.border, position: "relative", transition: "background .2s", flexShrink: 0, padding: 0 }}
    >
      <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,.3)", transition: "left .2s" }} />
    </button>
  );
}

/* ─── selector segmentado reutilizable ─── */
function SegmentedControl({ options, value, onChange }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 4, gap: 4 }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            minHeight: 40,
            border: "none",
            borderRadius: 9,
            cursor: "pointer",
            background: value === opt.value ? C.green : "transparent",
            color: value === opt.value ? "#FFFFFF" : C.slateLight,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── fila de opción con radio, usada en Extras de reserva ─── */
function ExtraOption({ icon: Icon, title, desc, priceLabel, free, selected, onSelect }) {
  const C = useTheme();
  return (
    <button
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        minHeight: 44,
        padding: "14px 12px",
        background: selected ? C.greenPale : C.bg,
        border: `1.5px solid ${selected ? C.green : C.border}`,
        borderRadius: 14,
        cursor: "pointer",
        textAlign: "left",
        marginBottom: 10,
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: selected ? C.green : C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color={selected ? "#FFFFFF" : C.slateLight} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.slate }}>{title}</div>
        <div style={{ fontSize: 12, color: C.slateLight }}>{desc}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: free ? C.slateLight : C.green }}>{priceLabel}</span>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${selected ? C.green : C.border}`,
            background: selected ? C.green : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {selected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}

/* ─── AUTH SCREEN (integrated) ─── */
function AuthScreen({ onClose }) {
  const C = useTheme();
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setInfo("");
    setGoogleLoading(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: OAUTH_REDIRECT_URL },
    });
    if (err) {
      setError(err.message || "No se ha podido iniciar sesión con Google");
      setGoogleLoading(false);
    }
    // en éxito, Supabase redirige a Google; no hay más que hacer aquí
  };

  const handleSubmit = async () => {
    setError("");
    setInfo("");
    if (!email.includes("@")) {
      setError("Introduce un email válido");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setInfo("Cuenta creada. Revisa tu email para confirmar el registro.");
      }
    } catch (e) {
      setError(e.message || "No se ha podido completar la operación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: C.green,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div style={{ flex: "0 0 auto", padding: "64px 24px 36px", textAlign: "center", color: C.white, position: "relative" }}>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Volver sin iniciar sesión"
            style={{ position: "absolute", top: 20, left: 20, background: "rgba(255,255,255,.16)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", color: C.white, display: "flex" }}
          >
            <X size={20} />
          </button>
        )}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "rgba(255,255,255,.14)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Plane size={34} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: -0.3 }}>FlyCanarias</h1>
        <p style={{ fontSize: 15, opacity: 0.85, margin: 0 }}>Vuelos interislas al mejor precio</p>
      </div>

      <div
        style={{
          flex: 1,
          background: C.surface,
          borderRadius: "28px 28px 0 0",
          padding: "32px 24px 40px",
          boxShadow: "0 -20px 50px rgba(0,0,0,.2)",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.slate, marginBottom: 4 }}>
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>
        <p style={{ fontSize: 14, color: C.slateLight, marginBottom: 24 }}>
          {mode === "login" ? "Accede a tus vuelos y reservas" : "Regístrate para empezar a volar"}
        </p>

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
            }}
          >
            <Mail size={18} color={C.slatePale} />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="tu@email.com"
              style={{ flex: 1, border: "none", background: "transparent", padding: "14px 0", fontSize: 16, color: C.slate, outline: "none" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>
            Contraseña
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1.5px solid ${error && password.length < 6 ? C.coral : C.border}`,
              borderRadius: 12,
              padding: "0 14px",
              background: C.bg,
            }}
          >
            <Lock size={18} color={C.slatePale} />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ flex: 1, border: "none", background: "transparent", padding: "14px 0", fontSize: 16, color: C.slate, outline: "none" }}
            />
            <button onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              {showPw ? <EyeOff size={18} color={C.slatePale} /> : <Eye size={18} color={C.slatePale} />}
            </button>
          </div>
        </div>

        <div style={{ height: 20 }} />

        {error && (
          <div style={{ padding: "10px 14px", background: C.coralPale, border: "1px solid #F5C6C0", borderRadius: 10, color: C.coral, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {info && (
          <div style={{ padding: "10px 14px", background: C.greenPale, border: `1px solid ${C.greenLight}`, borderRadius: 10, color: C.green, fontSize: 13, marginBottom: 16 }}>
            {info}
          </div>
        )}

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
            boxShadow: C.shadowMd,
          }}
        >
          {loading ? "Cargando..." : (
            <>
              {mode === "login" ? "Entrar" : "Crear cuenta"}
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: C.slatePale }}>o continúa con</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: "100%",
            padding: "14px",
            background: C.surface,
            color: C.slate,
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: googleLoading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.03z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
          </svg>
          {googleLoading ? "Conectando..." : "Continuar con Google"}
        </button>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          {mode === "login" ? (
            <span style={{ fontSize: 14, color: C.slateLight }}>
              ¿No tienes cuenta?{" "}
              <button onClick={() => { setMode("register"); setError(""); setInfo(""); }} style={{ background: "none", border: "none", color: C.green, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Regístrate
              </button>
            </span>
          ) : (
            <span style={{ fontSize: 14, color: C.slateLight }}>
              ¿Ya tienes cuenta?{" "}
              <button onClick={() => { setMode("login"); setError(""); setInfo(""); }} style={{ background: "none", border: "none", color: C.green, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Iniciar sesión
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── bottom nav (white, floating) ─── */
function BottomNav({ active, onNav }) {
  const C = useTheme();
  const tabs = [
    { id: "home", icon: Home, label: "Inicio" },
    { id: "search", icon: Search, label: "Buscar" },
    { id: "bookings", icon: Ticket, label: "Vuelos" },
    { id: "profile", icon: User, label: "Perfil" },
  ];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0 calc(10px + env(safe-area-inset-bottom, 0px))",
          pointerEvents: "auto",
          boxShadow: "0 -8px 24px rgba(0,0,0,.06)",
        }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onNav(t.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isActive ? C.green : C.slatePale,
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                transition: "color .2s, transform .2s",
                transform: isActive ? "translateY(-1px)" : "none",
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.3 : 1.7} />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* airport selector modal */
function AirportPicker({ open, onSelect, onClose, title }) {
  const C = useTheme();
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.surface, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, maxHeight: "70vh", overflow: "auto", padding: "24px 20px", boxShadow: C.shadowLg }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: C.slate }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight }}>
            <X size={22} />
          </button>
        </div>
        {AIRPORTS.map((a) => (
          <button
            key={a.code}
            onClick={() => onSelect(a.code)}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 12px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", color: C.green, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {a.code}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.slate }}>{a.city}</div>
              <div style={{ fontSize: 13, color: C.slateLight }}>{a.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── SCREENS ─── */

function HomeScreen({ onNav, userEmail, bookings }) {
  const C = useTheme();
  const actionTabs = [
    { id: "search", icon: Search, label: "Buscar vuelos" },
    { id: "bookings", icon: Ticket, label: "Mis reservas" },
    { id: "checkin", icon: ClipboardCheck, label: "Check-in" },
    { id: "status", icon: Activity, label: "Estado de vuelo" },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      <TopHeader onNav={onNav} userEmail={userEmail} />

      {/* HERO */}
      <div style={{ background: C.green, padding: "28px 20px 64px", position: "relative", overflow: "hidden" }}>
        <Plane
          size={230}
          style={{ position: "absolute", top: -40, right: -60, color: "rgba(255,255,255,.14)", transform: "rotate(35deg)" }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", marginBottom: 8 }}>
            {userEmail ? `Bienvenido, ${userEmail.split("@")[0]}` : "Bienvenido"}
          </div>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, color: C.white, textTransform: "uppercase", lineHeight: 1.05, letterSpacing: -0.5 }}>
            Vuela entre islas
          </h1>
        </div>
      </div>

      {/* floating price card */}
      <div style={{ padding: "0 20px", marginTop: -48, position: "relative", zIndex: 2 }}>
        <div
          onClick={() => onNav("search")}
          style={{ background: C.surface, borderRadius: 18, padding: 20, boxShadow: C.shadowLg, cursor: "pointer" }}
        >
          <span style={badgeYellow(C)}>Canariazo</span>
          <div style={{ fontSize: 14, color: C.slateLight, marginTop: 10, marginBottom: 2 }}>Vuelos ida desde</div>
          <div style={{ fontSize: 32, ...priceStrong(C) }}>27€</div>
        </div>
      </div>

      {/* action tabs */}
      <div style={{ padding: "20px 20px 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {actionTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onNav(t.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minHeight: 44, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 4px", cursor: "pointer", boxShadow: C.shadowSm }}
          >
            <t.icon size={20} color={C.green} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.slate, textAlign: "center", lineHeight: 1.2 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {bookings.length > 0 && (
        <div style={{ padding: "24px 20px 0" }}>
          <div style={sectionTitle(C)}>Tu próximo vuelo</div>
          <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, cursor: "pointer" }} onClick={() => onNav("bookings")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.green, background: C.greenPale, padding: "4px 10px", borderRadius: 6 }}>Confirmado</span>
              <span style={{ fontSize: 13, color: C.slateLight }}>{bookings[0].date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.slate }}>{bookings[0].from}</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>{bookings[0].dep}</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px" }}>
                <Plane size={18} style={{ color: C.green }} />
                <div style={{ width: "80%", height: 1, background: C.border, margin: "4px 0" }} />
                <div style={{ fontSize: 11, color: C.slatePale }}>40min</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.slate }}>{bookings[0].to}</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>{bookings[0].arr}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 13, color: C.slateLight }}>
              <span>Puerta: <b style={{ color: C.slate }}>{bookings[0].gate}</b></span>
              <span>Asiento: <b style={{ color: C.slate }}>{bookings[0].seat}</b></span>
              <span>Ref: <b style={{ color: C.slate }}>{bookings[0].id}</b></span>
            </div>
          </div>
        </div>
      )}

      {/* DESTINOS DESTACADOS */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={sectionTitle(C)}>Destinos destacados</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {PROMOS.map((p, i) => (
            <div
              key={i}
              onClick={() => onNav("search")}
              style={{ borderRadius: 18, overflow: "hidden", cursor: "pointer", position: "relative", height: 150, boxShadow: C.shadowSm }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${UNSPLASH[p.dest]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.65) 100%)" }} />
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, color: C.white }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{p.dest}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: C.yellow }}>Desde {p.price}€</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 20px 0" }}>
        <div style={sectionTitle(C)}>Servicios a bordo</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: Wifi, label: "WiFi a bordo", sub: "Gratis en todos los vuelos" },
            { icon: Coffee, label: "Catering", sub: "Snacks y bebidas" },
            { icon: Luggage, label: "Equipaje", sub: "23kg incluidos" },
            { icon: Shield, label: "Flex ticket", sub: "Cambios sin coste" },
          ].map((s, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 16, padding: "16px 14px", boxShadow: C.shadowSm, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: i % 2 === 0 ? C.greenPale : C.yellowPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={18} color={i % 2 === 0 ? C.green : "#B8940A"} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{s.label}</div>
                <div style={{ fontSize: 11, color: C.slateLight }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchScreen({ onNav, onSelectFlight, userEmail }) {
  const C = useTheme();
  const [from, setFrom] = useState("ACE");
  const [to, setTo] = useState("LPA");
  const [date, setDate] = useState(today());
  const [pax, setPax] = useState(1);
  const [results, setResults] = useState(null);
  const [picker, setPicker] = useState(null);
  const [sortBy, setSortBy] = useState("price");

  const doSearch = () => {
    let r = FLIGHTS.filter((f) => f.from === from && f.to === to);
    if (r.length === 0) r = FLIGHTS.filter((f) => f.from === from);
    if (r.length === 0) r = FLIGHTS.slice(0, 4);
    setResults(r);
  };

  const sorted = results ? [...results].sort((a, b) => (sortBy === "price" ? a.price - b.price : a.dep.localeCompare(b.dep))) : null;

  return (
    <div style={{ paddingBottom: 100 }}>
      <TopHeader onNav={onNav} userEmail={userEmail} />

      <div style={{ background: C.green, padding: "24px 20px 28px", color: C.white }}>
        <div style={{ fontSize: 22, fontWeight: 900, textTransform: "uppercase", marginBottom: 20, letterSpacing: -0.3 }}>Buscar vuelos</div>

        <div style={{ background: C.surface, borderRadius: 18, padding: 16, color: C.slate, boxShadow: C.shadowLg }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button onClick={() => setPicker("from")} style={{ flex: 1, padding: "14px 12px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 2 }}>Origen</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{from}</div>
              <div style={{ fontSize: 12, color: C.slateLight }}>{airportName(from)?.city}</div>
            </button>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                style={{ width: 36, height: 36, borderRadius: "50%", background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ArrowRight size={16} color={C.green} />
              </div>
            </div>
            <button onClick={() => setPicker("to")} style={{ flex: 1, padding: "14px 12px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 2 }}>Destino</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{to}</div>
              <div style={{ fontSize: 12, color: C.slateLight }}>{airportName(to)?.city}</div>
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, padding: "12px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 4 }}>
                <Calendar size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                Fecha
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ border: "none", background: "transparent", fontSize: 16, fontWeight: 600, color: C.slate, width: "100%", outline: "none" }}
              />
            </div>
            <div style={{ width: 100, padding: "12px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 4 }}>
                <Users size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                Pasajeros
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setPax(Math.max(1, pax - 1))} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>–</button>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{pax}</span>
                <button onClick={() => setPax(Math.min(9, pax + 1))} style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
              </div>
            </div>
          </div>

          <button
            onClick={doSearch}
            style={{ width: "100%", padding: "16px", background: C.green, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Search size={18} />
            Buscar vuelos
          </button>
        </div>
      </div>

      {sorted && (
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.slate, textTransform: "uppercase" }}>
              {sorted.length} vuelo{sorted.length !== 1 ? "s" : ""} encontrado{sorted.length !== 1 ? "s" : ""}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["price", "time"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${sortBy === s ? C.green : C.border}`, background: sortBy === s ? C.greenPale : C.surface, color: sortBy === s ? C.green : C.slateLight, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  {s === "price" ? "Precio" : "Hora"}
                </button>
              ))}
            </div>
          </div>

          {sorted.map((f) => (
            <div key={f.id} onClick={() => onSelectFlight(f)} style={{ background: C.surface, borderRadius: 18, padding: 18, marginBottom: 12, boxShadow: C.shadowSm, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Plane size={14} color={C.green} />
                  <span style={{ fontSize: 13, color: C.slateLight }}>{f.aircraft}</span>
                </div>
                {f.seats <= 5 && (
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.coral, background: C.coralPale, padding: "3px 8px", borderRadius: 6 }}>{f.seats} plazas</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.slate }}>{f.dep}</div>
                  <div style={{ fontSize: 13, color: C.slateLight }}>{f.from}</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 10px" }}>
                  <div style={{ fontSize: 12, color: C.slatePale, marginBottom: 2 }}>{f.duration}</div>
                  <div style={{ width: "100%", height: 2, background: C.greenPale, borderRadius: 1, position: "relative" }}>
                    <div style={{ position: "absolute", top: -3, right: 0, width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.slate }}>{f.arr}</div>
                  <div style={{ fontSize: 13, color: C.slateLight }}>{f.to}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", gap: 12 }}>
                  {[Wifi, Coffee, Luggage].map((Icon, i) => (<Icon key={i} size={16} color={C.slatePale} />))}
                </div>
                <div>
                  <span style={{ fontSize: 28, ...priceStrong(C) }}>{f.price}€</span>
                  <span style={{ fontSize: 12, color: C.slateLight }}> /persona</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AirportPicker
        open={picker !== null}
        title={picker === "from" ? "Selecciona origen" : "Selecciona destino"}
        onSelect={(code) => { if (picker === "from") setFrom(code); else setTo(code); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
    </div>
  );
}

function FlightDetail({ flight, onBack, onNav, onConfirmBooking, session, onRequireAuth }) {
  const C = useTheme();
  const [step, setStep] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [luggage, setLuggage] = useState("none");
  const [insurance, setInsurance] = useState("none");
  const [premiumSeat, setPremiumSeat] = useState("standard");
  const [confirmation, setConfirmation] = useState(null);
  const f = flight;

  const seats = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const row = Math.floor(i / 4) + 1;
        const col = ["A", "B", "C", "D"][i % 4];
        const taken = Math.random() > 0.6;
        return { id: `${row}${col}`, row, col, taken };
      }),
    [f.id]
  );

  const extrasTotal = priceOf(LUGGAGE_OPTIONS, luggage) + priceOf(INSURANCE_OPTIONS, insurance) + priceOf(SEAT_OPTIONS, premiumSeat);
  const total = f.price + 12 + extrasTotal;

  const confirmBooking = () => {
    const booking = {
      id: `FC-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      from: f.from,
      to: f.to,
      date: formatBookingDate(new Date()),
      dep: f.dep,
      arr: f.arr,
      gate: `${["A", "B", "C"][f.id % 3]}${(f.id % 6) + 1}`,
      seat: selectedSeat || "12A",
      luggage,
      insurance,
      premiumSeat,
      extrasTotal,
      total,
      status: "confirmed",
    };
    setConfirmation(booking);
    onConfirmBooking(booking);
    setStep(4);
  };

  if (step === 4 && confirmation) {
    const extrasList = [
      luggage !== "none" && { label: LUGGAGE_OPTIONS.find((o) => o.value === luggage).label, price: priceOf(LUGGAGE_OPTIONS, luggage) },
      insurance !== "none" && { label: INSURANCE_OPTIONS.find((o) => o.value === insurance).label, price: priceOf(INSURANCE_OPTIONS, insurance) },
      premiumSeat !== "standard" && { label: SEAT_OPTIONS.find((o) => o.value === premiumSeat).label, price: priceOf(SEAT_OPTIONS, premiumSeat) },
    ].filter(Boolean);

    return (
      <div style={{ minHeight: "100dvh", background: C.surface, display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px calc(32px + env(safe-area-inset-bottom, 0px))", textAlign: "center" }}>
        <div className="fc-pop-in" style={{ width: 80, height: 80, borderRadius: "50%", background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Check size={40} color={C.green} strokeWidth={3} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.slate, marginBottom: 4, textTransform: "uppercase" }}>¡Reserva confirmada!</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.green, marginBottom: 20 }}>{confirmation.id}</div>

        <div style={{ background: C.bg, borderRadius: 16, padding: 20, width: "100%", maxWidth: 320, marginBottom: 24, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: C.slate }}>{f.from}</span>
            <Plane size={16} color={C.green} />
            <span style={{ fontSize: 18, fontWeight: 900, color: C.slate }}>{f.to}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.slateLight, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
            <span>{f.dep} → {f.arr}</span>
            <span>Asiento {confirmation.seat}</span>
          </div>
          {extrasList.map((ex, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.slateLight, marginBottom: 6 }}>
              <span>{ex.label}</span>
              <span style={{ color: C.green, fontWeight: 700 }}>+{ex.price}€</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontWeight: 700, color: C.slate }}>Total</span>
            <span style={{ fontSize: 18, ...priceStrong(C) }}>{confirmation.total}€</span>
          </div>
        </div>

        <button onClick={() => onNav("bookings")} style={{ width: "100%", maxWidth: 320, minHeight: 48, padding: "16px", background: C.green, color: "#FFFFFF", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: C.shadowMd, marginBottom: 10 }}>
          Ver mi boarding pass
        </button>
        <button onClick={() => onNav("home")} style={{ width: "100%", maxWidth: 320, minHeight: 48, padding: "16px", background: "none", color: C.slate, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 110 }}>
      <div style={{ background: C.green, padding: "48px 20px 28px", color: "#FFFFFF" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,.16)", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: "#FFFFFF", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, minHeight: 44 }}>
          <ArrowLeft size={16} />
          Volver
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{f.from}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{airportName(f.from)?.city}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
            <Plane size={22} />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{f.duration}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{f.to}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{airportName(f.to)?.city}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", padding: "16px 20px", gap: 8 }}>
        {["Detalles", "Asiento", "Extras", "Pago"].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 4, borderRadius: 2, background: i <= step ? C.green : C.border, marginBottom: 6, transition: "background .3s" }} />
            <span style={{ fontSize: 11, fontWeight: i === step ? 700 : 400, color: i <= step ? C.green : C.slatePale }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px" }}>
        {step === 0 && (
          <>
            <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 14 }}>Información del vuelo</div>
              {[
                { label: "Aeronave", value: f.aircraft },
                { label: "Salida", value: `${f.dep} — ${airportName(f.from)?.name}` },
                { label: "Llegada", value: `${f.arr} — ${airportName(f.to)?.name}` },
                { label: "Plazas disponibles", value: `${f.seats}` },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", fontSize: 14 }}>
                  <span style={{ color: C.slateLight }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: C.slate }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 10 }}>Incluido en tu billete</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { icon: Luggage, label: "23kg equipaje" },
                  { icon: Wifi, label: "WiFi gratis" },
                  { icon: Coffee, label: "Snack + bebida" },
                  { icon: Shield, label: "Cancelación flex" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: C.greenPale, borderRadius: 10, fontSize: 13, color: C.green, fontWeight: 600 }}>
                    <s.icon size={14} />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 6 }}>Elige tu asiento</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 14, fontSize: 12, color: C.slateLight }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: C.green }} /> Seleccionado</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: C.border }} /> Libre</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: C.slatePale }} /> Ocupado</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 30px 1fr 1fr", gap: 6, maxWidth: 240 }}>
                {seats.map((s) => {
                  const isSelected = selectedSeat === s.id;
                  return (
                    <>
                      {s.col === "C" && (
                        <div key={`gap-${s.row}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.slatePale, fontWeight: 600 }}>
                          {s.row}
                        </div>
                      )}
                      <button
                        key={s.id}
                        onClick={() => !s.taken && setSelectedSeat(s.id)}
                        disabled={s.taken}
                        style={{ width: 38, height: 34, borderRadius: 6, border: isSelected ? `2px solid ${C.green}` : "1px solid transparent", background: s.taken ? C.slatePale : isSelected ? C.green : C.bg, color: s.taken ? "#FFFFFF" : isSelected ? "#FFFFFF" : C.slate, fontSize: 11, fontWeight: 600, cursor: s.taken ? "not-allowed" : "pointer" }}
                      >
                        {s.id}
                      </button>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 4 }}>Equipaje facturado</div>
              <div style={{ fontSize: 12, color: C.slateLight, marginBottom: 12 }}>Además del equipaje de mano de 10kg incluido</div>
              {LUGGAGE_OPTIONS.map((o) => (
                <ExtraOption
                  key={o.value}
                  icon={Luggage}
                  title={o.label}
                  desc={o.desc}
                  priceLabel={o.price === 0 ? "Gratis" : `+${o.price}€`}
                  free={o.price === 0}
                  selected={luggage === o.value}
                  onSelect={() => setLuggage(o.value)}
                />
              ))}
            </div>

            <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Seguro de viaje</div>
              {INSURANCE_OPTIONS.map((o) => (
                <ExtraOption
                  key={o.value}
                  icon={Shield}
                  title={o.label}
                  desc={o.desc}
                  priceLabel={o.price === 0 ? "Gratis" : `+${o.price}€`}
                  free={o.price === 0}
                  selected={insurance === o.value}
                  onSelect={() => setInsurance(o.value)}
                />
              ))}
            </div>

            <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Asiento premium</div>
              {SEAT_OPTIONS.map((o) => (
                <ExtraOption
                  key={o.value}
                  icon={Star}
                  title={o.label}
                  desc={o.desc}
                  priceLabel={o.price === 0 ? "Incluido" : `+${o.price}€`}
                  free={o.price === 0}
                  selected={premiumSeat === o.value}
                  onSelect={() => setPremiumSeat(o.value)}
                />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 14 }}>Resumen de pago</div>
            {[
              { label: "Vuelo " + f.from + " → " + f.to, value: f.price + "€" },
              { label: "Asiento " + (selectedSeat || "—"), value: "Incluido" },
              { label: "Tasas aeroportuarias", value: "12€" },
              luggage !== "none" && { label: LUGGAGE_OPTIONS.find((o) => o.value === luggage).label, value: `${priceOf(LUGGAGE_OPTIONS, luggage)}€` },
              insurance !== "none" && { label: INSURANCE_OPTIONS.find((o) => o.value === insurance).label, value: `${priceOf(INSURANCE_OPTIONS, insurance)}€` },
              premiumSeat !== "standard" && { label: SEAT_OPTIONS.find((o) => o.value === premiumSeat).label, value: `${priceOf(SEAT_OPTIONS, premiumSeat)}€` },
            ].filter(Boolean).map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
                <span style={{ color: C.slateLight }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: C.slate }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontSize: 16 }}>
              <span style={{ fontWeight: 700, color: C.slate }}>Total</span>
              <span style={{ fontSize: 20, ...priceStrong(C) }}>{total}€</span>
            </div>
            <div style={{ margin: "18px 0 8px", fontSize: 14, fontWeight: 600, color: C.slate }}>Método de pago</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: C.bg, borderRadius: 12, border: `1px solid ${C.green}` }}>
              <CreditCard size={20} color={C.green} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>•••• •••• •••• 4851</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>Visa · 09/28</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 90 }}>
        <div style={{ width: "100%", maxWidth: 480, background: "rgba(255,255,255,.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: `1px solid ${C.border}`, padding: "14px 20px calc(14px + env(safe-area-inset-bottom, 0px))", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: C.slateLight }}>Precio total</div>
            <div style={{ fontSize: 22, ...priceStrong(C) }}>{total}€</div>
          </div>
          <button
            onClick={() => {
              if (!session) { onRequireAuth(); return; }
              if (step === 3) confirmBooking(); else setStep(step + 1);
            }}
            disabled={step === 1 && !selectedSeat}
            style={{ padding: "14px 32px", minHeight: 48, background: step === 1 && !selectedSeat ? C.slatePale : C.green, color: "#FFFFFF", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: step === 1 && !selectedSeat ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: C.shadowMd }}
          >
            {step === 3 ? "Confirmar pago" : "Continuar"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingsScreen({ onNav, userEmail, bookings }) {
  const C = useTheme();
  const [checkedIn, setCheckedIn] = useState({});
  return (
    <div style={{ paddingBottom: 100 }}>
      <TopHeader onNav={onNav} userEmail={userEmail} />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={sectionTitle(C)}>Mis vuelos</div>

        {bookings.map((b) => (
        <div key={b.id} style={{ background: C.surface, borderRadius: 22, overflow: "hidden", boxShadow: C.shadowLg, marginBottom: 16 }}>
          <div style={{ background: C.green, padding: "20px 20px 16px", color: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Plane size={18} />
                <span style={{ fontWeight: 800, fontSize: 15 }}>FlyCanarias</span>
              </div>
              <span style={{ fontSize: 13, opacity: 0.8 }}>{b.id}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 36, fontWeight: 900 }}>{b.from}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{b.dep}</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 6px" }}>
                <div style={{ width: "80%", borderBottom: "2px dashed rgba(255,255,255,.4)" }} />
                <Plane size={16} style={{ margin: "6px 0", opacity: 0.75 }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 36, fontWeight: 900 }}>{b.to}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{b.arr}</div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", height: 24, background: C.surface }}>
            <div style={{ position: "absolute", top: "50%", left: 20, right: 20, borderBottom: `2px dashed ${C.border}` }} />
            <div style={{ position: "absolute", top: "50%", left: -12, transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: C.bg }} />
            <div style={{ position: "absolute", top: "50%", right: -12, transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: C.bg }} />
          </div>

          <div style={{ padding: "4px 20px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[
                { label: "Fecha", value: b.date },
                { label: "Puerta", value: b.gate },
                { label: "Asiento", value: b.seat },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.slate }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <User size={16} color={C.slateLight} />
              <div>
                <div style={{ fontSize: 11, color: C.slatePale }}>Pasajero</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.slate }}>{userEmail || "—"}</div>
              </div>
            </div>

            <div style={{ marginTop: 18, padding: 16, background: C.bg, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <img
                src={qrUrl(`${b.id}|${b.from}-${b.to}|${b.seat}|${userEmail || ""}`)}
                alt="Código QR de la tarjeta de embarque"
                width={140}
                height={140}
                style={{ borderRadius: 12, background: C.surface, padding: 8 }}
              />
              <span style={{ fontSize: 12, color: C.slateLight }}>Tarjeta de embarque digital</span>
            </div>

            <button
              onClick={() => setCheckedIn((prev) => ({ ...prev, [b.id]: true }))}
              disabled={!!checkedIn[b.id]}
              style={{
                width: "100%",
                marginTop: 14,
                padding: "13px",
                background: checkedIn[b.id] ? C.greenPale : C.green,
                color: checkedIn[b.id] ? C.green : "#FFFFFF",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: checkedIn[b.id] ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 44,
              }}
            >
              {checkedIn[b.id] ? (
                <>
                  <Check size={16} />
                  Check-in realizado
                </>
              ) : (
                "Hacer check-in"
              )}
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}

function CheckinScreen({ onNav, userEmail, bookings }) {
  const C = useTheme();
  const [query, setQuery] = useState("");
  const [checkedIn, setCheckedIn] = useState({});
  const filtered = bookings.filter((b) => !query.trim() || b.id.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div style={{ paddingBottom: 100 }}>
      <TopHeader onNav={onNav} userEmail={userEmail} />
      <div style={{ padding: "20px" }}>
        <div style={sectionTitle(C)}>Check-in online</div>

        <div style={{ background: C.surface, borderRadius: 18, padding: 16, boxShadow: C.shadowSm, marginBottom: 18 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 8 }}>
            Código de reserva
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. FC-2026-4851"
            style={{ width: "100%", minHeight: 44, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 12, padding: "14px 14px", fontSize: 16, color: C.slate, outline: "none" }}
          />
        </div>

        {filtered.length === 0 && (
          <div style={{ background: C.surface, borderRadius: 18, padding: 24, textAlign: "center", color: C.slateLight, boxShadow: C.shadowSm }}>
            No se encontró ninguna reserva con ese código.
          </div>
        )}

        {filtered.map((b) => (
          <div key={b.id} style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.green, background: C.greenPale, padding: "4px 10px", borderRadius: 6 }}>{b.id}</span>
              <span style={{ fontSize: 13, color: C.slateLight }}>{b.date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.slate }}>{b.from}</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>{b.dep}</div>
              </div>
              <Plane size={18} style={{ color: C.green }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.slate }}>{b.to}</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>{b.arr}</div>
              </div>
            </div>
            <button
              onClick={() => setCheckedIn((prev) => ({ ...prev, [b.id]: true }))}
              disabled={!!checkedIn[b.id]}
              style={{
                width: "100%",
                padding: "13px",
                background: checkedIn[b.id] ? C.greenPale : C.green,
                color: checkedIn[b.id] ? C.green : "#FFFFFF",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: checkedIn[b.id] ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                minHeight: 44,
              }}
            >
              {checkedIn[b.id] ? (<><Check size={16} /> Check-in realizado</>) : "Confirmar check-in"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusScreen({ onNav, userEmail }) {
  const C = useTheme();
  const [from, setFrom] = useState("ACE");
  const [to, setTo] = useState("LPA");
  const [picker, setPicker] = useState(null);
  const [result, setResult] = useState(null);

  const search = () => {
    const match = FLIGHTS.find((f) => f.from === from && f.to === to) || FLIGHTS[0];
    setResult(match);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <TopHeader onNav={onNav} userEmail={userEmail} />
      <div style={{ padding: "20px" }}>
        <div style={sectionTitle(C)}>Estado de vuelo</div>

        <div style={{ background: C.surface, borderRadius: 18, padding: 16, boxShadow: C.shadowSm, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <button onClick={() => setPicker("from")} style={{ flex: 1, padding: "14px 12px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 2 }}>Origen</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.slate }}>{from}</div>
            </button>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                style={{ width: 36, height: 36, borderRadius: "50%", background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ArrowRight size={16} color={C.green} />
              </div>
            </div>
            <button onClick={() => setPicker("to")} style={{ flex: 1, padding: "14px 12px", borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 2 }}>Destino</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.slate }}>{to}</div>
            </button>
          </div>
          <button
            onClick={search}
            style={{ width: "100%", minHeight: 48, padding: "16px", background: C.green, color: "#FFFFFF", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Activity size={18} />
            Consultar estado
          </button>
        </div>

        {result && (
          <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.green, background: C.greenPale, padding: "4px 10px", borderRadius: 6 }}>A tiempo</span>
              <span style={{ fontSize: 13, color: C.slateLight }}>{result.aircraft}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.slate }}>{result.dep}</div>
                <div style={{ fontSize: 13, color: C.slateLight }}>{result.from}</div>
              </div>
              <Plane size={20} style={{ color: C.green }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.slate }}>{result.arr}</div>
                <div style={{ fontSize: 13, color: C.slateLight }}>{result.to}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 13, color: C.slateLight }}>
              <span>Puerta: <b style={{ color: C.slate }}>{["A", "B", "C"][result.id % 3]}{(result.id % 6) + 1}</b></span>
              <span>Duración: <b style={{ color: C.slate }}>{result.duration}</b></span>
            </div>
          </div>
        )}
      </div>

      <AirportPicker
        open={picker !== null}
        title={picker === "from" ? "Selecciona origen" : "Selecciona destino"}
        onSelect={(code) => { if (picker === "from") setFrom(code); else setTo(code); setPicker(null); }}
        onClose={() => setPicker(null)}
      />
    </div>
  );
}

function ProfileScreen({ onNav, userEmail, onSignOut }) {
  const C = useTheme();
  const menuItems = [
    { icon: User, label: "Datos personales", nav: "personal" },
    { icon: CreditCard, label: "Métodos de pago", nav: "payment" },
    { icon: Bell, label: "Notificaciones", nav: "notifications" },
    { icon: Heart, label: "Destinos favoritos", nav: "favorites" },
    { icon: Shield, label: "Seguridad", nav: "security" },
    { icon: Settings, label: "Configuración", nav: "settings" },
    { icon: HelpCircle, label: "Ayuda", nav: "help" },
  ];
  return (
    <div style={{ paddingBottom: 100 }}>
      <TopHeader onNav={onNav} userEmail={userEmail} />
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: 22, fontWeight: 900, boxShadow: C.shadowMd }}>
            {initials(userEmail)}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.slate }}>{userEmail?.split("@")[0] || "Viajero"}</div>
            <div style={{ fontSize: 14, color: C.slateLight }}>{userEmail}</div>
            <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#8A6D00", background: C.yellowPale, padding: "3px 10px", borderRadius: 6 }}>
              <Star size={12} />
              Club Isleño Gold
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { value: "24", label: "Vuelos", icon: Plane },
            { value: "3.840", label: "Millas", icon: TrendingUp },
            { value: "Gold", label: "Status", icon: Star },
          ].map((s, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 16, padding: 16, textAlign: "center", boxShadow: C.shadowSm }}>
              <s.icon size={20} color={C.green} style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 20, fontWeight: 900, color: C.slate }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.slateLight }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 18, boxShadow: C.shadowSm, overflow: "hidden" }}>
          {menuItems.map((item, i, arr) => (
            <div
              key={i}
              onClick={() => onNav(item.nav)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", minHeight: 44, cursor: "pointer", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <item.icon size={20} color={C.slateLight} />
                <span style={{ fontSize: 15, color: C.slate }}>{item.label}</span>
              </div>
              <ChevronRight size={18} color={C.slatePale} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={onSignOut}
            style={{ padding: "14px 40px", minHeight: 48, background: "none", border: `1px solid ${C.coral}`, borderRadius: 12, color: C.coral, fontSize: 15, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

/* splash while checking session */
/* ─── PERFIL: datos personales ─── */
const EMPTY_PERSONAL = { fullName: "", phone: "", birthDate: "", nationality: "", docId: "", photo: null };

function PersonalDataScreen({ onBack, userEmail }) {
  const C = useTheme();
  const [data, setData] = useState(() => loadLS(LS_KEYS.personal, EMPTY_PERSONAL));
  const [saved, setSaved] = useState(false);

  const update = (key, value) => { setData((d) => ({ ...d, [key]: value })); setSaved(false); };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result);
    reader.readAsDataURL(file);
  };

  const save = () => {
    saveLS(LS_KEYS.personal, data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ paddingBottom: 140 }}>
      <SubHeader title="Datos personales" onBack={onBack} />
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <label style={{ position: "relative", cursor: "pointer" }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: data.photo ? `#000 url(${data.photo}) center/cover no-repeat` : C.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 28,
                fontWeight: 900,
                boxShadow: C.shadowMd,
              }}
            >
              {!data.photo && initials(userEmail)}
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.bg}` }}>
              <Camera size={14} color="#1A1A1A" />
            </div>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
          </label>
          <span style={{ fontSize: 12, color: C.slateLight, marginTop: 8 }}>Toca para cambiar la foto</span>
        </div>

        {[
          { key: "fullName", label: "Nombre completo", type: "text", placeholder: "Tu nombre y apellidos" },
          { key: "phone", label: "Teléfono", type: "tel", placeholder: "+34 600 000 000" },
          { key: "birthDate", label: "Fecha de nacimiento", type: "date", placeholder: "" },
          { key: "nationality", label: "Nacionalidad", type: "text", placeholder: "Española" },
          { key: "docId", label: "Número de pasaporte/DNI", type: "text", placeholder: "12345678A" },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>{f.label}</label>
            <input
              type={f.type}
              value={data[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={{ width: "100%", minHeight: 44, border: `1px solid ${C.border}`, background: C.surface, borderRadius: 12, padding: "12px 14px", fontSize: 16, color: C.slate, outline: "none" }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>Email</label>
          <div style={{ width: "100%", minHeight: 44, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 12, padding: "12px 14px", fontSize: 16, color: C.slateLight, display: "flex", alignItems: "center" }}>
            {userEmail || "—"}
          </div>
          <span style={{ fontSize: 11, color: C.slatePale }}>Gestionado por tu cuenta, no editable</span>
        </div>

        <button
          onClick={save}
          style={{ width: "100%", minHeight: 48, padding: "14px", background: saved ? C.greenPale : C.green, color: saved ? C.green : "#FFFFFF", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {saved ? (<><Check size={18} /> Cambios guardados</>) : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

/* ─── PERFIL: métodos de pago ─── */
function guessCardBrand(number) {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(n)) return "Mastercard";
  return "Tarjeta";
}

function PaymentMethodsScreen({ onBack }) {
  const C = useTheme();
  const [cards, setCards] = useState(() =>
    loadLS(LS_KEYS.payments, [{ id: 1, brand: "Visa", last4: "4851", holder: "MANUEL BIANCHI", expiry: "09/28" }])
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ number: "", holder: "", expiry: "", cvv: "" });

  useEffect(() => { saveLS(LS_KEYS.payments, cards); }, [cards]);

  const addCard = () => {
    const clean = form.number.replace(/\s/g, "");
    if (clean.length < 12 || !form.holder.trim() || !form.expiry.trim() || form.cvv.trim().length < 3) return;
    setCards((prev) => [...prev, { id: Date.now(), brand: guessCardBrand(clean), last4: clean.slice(-4), holder: form.holder.toUpperCase(), expiry: form.expiry }]);
    setForm({ number: "", holder: "", expiry: "", cvv: "" });
    setModalOpen(false);
  };

  const removeCard = (id) => setCards((prev) => prev.filter((c) => c.id !== id));

  return (
    <div style={{ paddingBottom: 120 }}>
      <SubHeader title="Métodos de pago" onBack={onBack} />
      <div style={{ padding: 20 }}>
        {cards.map((c) => (
          <div key={c.id} style={{ background: C.surface, borderRadius: 16, padding: 18, boxShadow: C.shadowSm, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CreditCard size={20} color={C.green} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.slate }}>{c.brand} •••• {c.last4}</div>
              <div style={{ fontSize: 12, color: C.slateLight }}>{c.holder} · Caduca {c.expiry}</div>
            </div>
            <button
              onClick={() => removeCard(c.id)}
              aria-label="Eliminar tarjeta"
              style={{ width: 44, height: 44, background: "none", border: "none", cursor: "pointer", color: C.slatePale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        ))}

        <button
          onClick={() => setModalOpen(true)}
          style={{ width: "100%", minHeight: 48, padding: "14px", background: C.surface, border: `1.5px dashed ${C.green}`, borderRadius: 12, color: C.green, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <CreditCard size={18} /> Añadir nueva tarjeta
        </button>
      </div>

      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setModalOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: C.surface, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 20px calc(24px + env(safe-area-inset-bottom, 0px))", boxShadow: C.shadowLg }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: C.slate }}>Nueva tarjeta</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight }}>
                <X size={22} />
              </button>
            </div>
            <p style={{ fontSize: 12, color: C.slatePale, marginBottom: 16 }}>Simulado — no se procesan pagos reales.</p>
            {[
              { key: "number", label: "Número de tarjeta", placeholder: "1234 5678 9012 3456", inputMode: "numeric" },
              { key: "holder", label: "Titular", placeholder: "NOMBRE APELLIDOS", inputMode: "text" },
              { key: "expiry", label: "Caducidad", placeholder: "MM/AA", inputMode: "text" },
              { key: "cvv", label: "CVV", placeholder: "123", inputMode: "numeric" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>{f.label}</label>
                <input
                  value={form[f.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  inputMode={f.inputMode}
                  style={{ width: "100%", minHeight: 44, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 12, padding: "12px 14px", fontSize: 16, color: C.slate, outline: "none" }}
                />
              </div>
            ))}
            <button
              onClick={addCard}
              style={{ width: "100%", minHeight: 48, padding: "14px", background: C.green, color: "#FFFFFF", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8 }}
            >
              Guardar tarjeta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PERFIL: notificaciones ─── */
const NOTIF_DEFS = [
  { key: "flightChanges", label: "Cambios en mi vuelo", desc: "Avisos de horario, puerta o cancelación" },
  { key: "reminder24h", label: "Recordatorio 24h antes", desc: "Aviso el día antes de volar" },
  { key: "promos", label: "Ofertas y promociones", desc: "Descuentos y ofertas especiales" },
  { key: "checkinReady", label: "Check-in disponible", desc: "Cuando se abre el check-in online" },
  { key: "liveStatus", label: "Estado del vuelo en tiempo real", desc: "Seguimiento en vivo del vuelo" },
];
const DEFAULT_NOTIFS = Object.fromEntries(NOTIF_DEFS.map((n) => [n.key, true]));

function NotificationsScreen({ onBack }) {
  const C = useTheme();
  const [notifs, setNotifs] = useState(() => loadLS(LS_KEYS.notifications, DEFAULT_NOTIFS));
  useEffect(() => { saveLS(LS_KEYS.notifications, notifs); }, [notifs]);
  const toggle = (key) => setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ paddingBottom: 100 }}>
      <SubHeader title="Notificaciones" onBack={onBack} />
      <div style={{ padding: 20 }}>
        <div style={{ background: C.surface, borderRadius: 18, boxShadow: C.shadowSm, overflow: "hidden" }}>
          {NOTIF_DEFS.map((n, i) => (
            <div
              key={n.key}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 18px", minHeight: 44, borderBottom: i < NOTIF_DEFS.length - 1 ? `1px solid ${C.border}` : "none" }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{n.label}</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>{n.desc}</div>
              </div>
              <Toggle on={!!notifs[n.key]} onChange={() => toggle(n.key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PERFIL: destinos favoritos ─── */
function FavoritesScreen({ onBack, onNav }) {
  const C = useTheme();
  const [favorites, setFavorites] = useState(() => loadLS(LS_KEYS.favorites, []));
  useEffect(() => { saveLS(LS_KEYS.favorites, favorites); }, [favorites]);
  const toggleFav = (dest) => setFavorites((prev) => (prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]));

  return (
    <div style={{ paddingBottom: 100 }}>
      <SubHeader title="Destinos favoritos" onBack={onBack} />
      <div style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Object.keys(UNSPLASH).map((dest) => {
            const isFav = favorites.includes(dest);
            return (
              <div
                key={dest}
                onClick={() => onNav("search")}
                style={{ position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: C.shadowSm, aspectRatio: "4 / 3", cursor: "pointer" }}
              >
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${UNSPLASH[dest]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.65) 100%)" }} />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFav(dest); }}
                  aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                  style={{ position: "absolute", top: 8, right: 8, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,.35)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Heart size={16} color={isFav ? "#E1584A" : "#FFFFFF"} fill={isFav ? "#E1584A" : "none"} />
                </button>
                <div style={{ position: "absolute", left: 12, right: 12, bottom: 10, color: "#FFFFFF", fontWeight: 800, fontSize: 15 }}>{dest}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── PERFIL: seguridad ─── */
function SecurityScreen({ onBack, userEmail, session, onNav }) {
  const C = useTheme();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const googleLinked = !!session?.user?.identities?.some((i) => i.provider === "google");

  const changePassword = async () => {
    setPwError(""); setPwMsg("");
    if (newPw.length < 6) { setPwError("La nueva contraseña debe tener al menos 6 caracteres"); return; }
    if (newPw !== confirmPw) { setPwError("Las contraseñas no coinciden"); return; }
    setPwLoading(true);
    try {
      const { error: reauthErr } = await supabase.auth.signInWithPassword({ email: userEmail, password: current });
      if (reauthErr) throw new Error("La contraseña actual no es correcta");
      const { error: updateErr } = await supabase.auth.updateUser({ password: newPw });
      if (updateErr) throw updateErr;
      setPwMsg("Contraseña actualizada correctamente");
      setCurrent(""); setNewPw(""); setConfirmPw("");
    } catch (e) {
      setPwError(e.message || "No se ha podido cambiar la contraseña");
    } finally {
      setPwLoading(false);
    }
  };

  const signOutEverywhere = async () => {
    setGlobalLoading(true);
    await supabase.auth.signOut({ scope: "global" });
    setGlobalLoading(false);
    onNav("home");
  };

  const deleteAccount = async () => {
    await supabase.auth.signOut();
    onNav("home");
  };

  return (
    <div style={{ paddingBottom: 140 }}>
      <SubHeader title="Seguridad" onBack={onBack} />
      <div style={{ padding: 20 }}>
        <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 14 }}>Cambiar contraseña</div>
          {[
            { label: "Contraseña actual", value: current, set: setCurrent },
            { label: "Nueva contraseña", value: newPw, set: setNewPw },
            { label: "Confirmar nueva contraseña", value: confirmPw, set: setConfirmPw },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C.slate, display: "block", marginBottom: 6 }}>{f.label}</label>
              <input
                type="password"
                value={f.value}
                onChange={(e) => { f.set(e.target.value); setPwError(""); setPwMsg(""); }}
                style={{ width: "100%", minHeight: 44, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 12, padding: "12px 14px", fontSize: 16, color: C.slate, outline: "none" }}
              />
            </div>
          ))}
          {pwError && <div style={{ padding: "10px 14px", background: C.coralPale, borderRadius: 10, color: C.coral, fontSize: 13, marginBottom: 12 }}>{pwError}</div>}
          {pwMsg && <div style={{ padding: "10px 14px", background: C.greenPale, borderRadius: 10, color: C.green, fontSize: 13, marginBottom: 12 }}>{pwMsg}</div>}
          <button
            onClick={changePassword}
            disabled={pwLoading}
            style={{ width: "100%", minHeight: 48, padding: "14px", background: C.green, color: "#FFFFFF", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: pwLoading ? "wait" : "pointer" }}
          >
            {pwLoading ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </div>

        <div style={{ background: C.surface, borderRadius: 18, padding: 18, boxShadow: C.shadowSm, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.slate }}>Autenticación con Google</div>
            <div style={{ fontSize: 12, color: C.slateLight }}>Vinculada a tu cuenta de FlyCanarias</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "5px 10px", borderRadius: 6, background: googleLinked ? C.greenPale : C.coralPale, color: googleLinked ? C.green : C.coral, flexShrink: 0 }}>
            {googleLinked ? "Activo" : "Inactivo"}
          </span>
        </div>

        <button
          onClick={signOutEverywhere}
          disabled={globalLoading}
          style={{ width: "100%", minHeight: 48, padding: "14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, color: C.slate, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <LogOut size={16} /> {globalLoading ? "Cerrando sesiones..." : "Cerrar sesión en todos los dispositivos"}
        </button>

        <button
          onClick={() => setConfirmDelete(true)}
          style={{ width: "100%", minHeight: 48, padding: "14px", background: C.coral, border: "none", borderRadius: 12, color: "#FFFFFF", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
        >
          Eliminar cuenta
        </button>

        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setConfirmDelete(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 20px calc(24px + env(safe-area-inset-bottom, 0px))" }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.slate, marginBottom: 8 }}>¿Eliminar tu cuenta?</div>
              <p style={{ fontSize: 13, color: C.slateLight, marginBottom: 18 }}>
                Se cerrará tu sesión y se registrará tu solicitud de baja. Un agente confirmará la eliminación definitiva de tus datos por email.
              </p>
              <button
                onClick={deleteAccount}
                style={{ width: "100%", minHeight: 48, padding: "14px", background: C.coral, color: "#FFFFFF", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}
              >
                Sí, eliminar cuenta
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{ width: "100%", minHeight: 48, padding: "14px", background: "none", border: `1px solid ${C.border}`, borderRadius: 12, color: C.slate, fontSize: 15, fontWeight: 600, cursor: "pointer" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PERFIL: ayuda ─── */
const FAQS = [
  { q: "¿Cómo cambio mi vuelo?", a: "Ve a \"Mis vuelos\", selecciona la reserva y elige la opción de modificar fecha u hora. Puede aplicarse una diferencia de tarifa." },
  { q: "¿Cuál es la política de equipaje?", a: "El billete incluye 10kg de equipaje de mano. Puedes añadir equipaje facturado (23kg) desde el paso de Extras al reservar." },
  { q: "¿Cómo hago el check-in online?", a: "Desde la pantalla de Check-in, introduce tu código de reserva y confirma. Se abre 48h antes del vuelo." },
  { q: "¿Puedo viajar con mascotas?", a: "Sí, se admiten mascotas pequeñas en cabina con reserva previa y suplemento. Consulta condiciones con atención al cliente." },
  { q: "¿Cómo solicito reembolso?", a: "Escríbenos desde esta pantalla de Ayuda o al email de soporte indicando tu localizador y motivo de la solicitud." },
];

function FaqItem({ q, a }) {
  const C = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", minHeight: 44, padding: "14px 4px", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 10 }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{q}</span>
        <ChevronRight size={18} color={C.slatePale} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
      </button>
      <div style={{ maxHeight: open ? 240 : 0, overflow: "hidden", transition: "max-height .25s ease" }}>
        <p style={{ fontSize: 13, color: C.slateLight, padding: "0 4px 14px", margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

function HelpChat() {
  const C = useTheme();
  const [messages, setMessages] = useState([{ from: "bot", text: "¡Hola! Soy el asistente de FlyCanarias. ¿En qué puedo ayudarte?" }]);
  const [input, setInput] = useState("");

  const respond = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("equipaje") || lower.includes("maleta")) return FAQS[1].a;
    if (lower.includes("check")) return FAQS[2].a;
    if (lower.includes("mascota") || lower.includes("perro") || lower.includes("gato")) return FAQS[3].a;
    if (lower.includes("reembolso") || lower.includes("cancel") || lower.includes("devol")) return FAQS[4].a;
    if (lower.includes("cambi") || lower.includes("modific")) return FAQS[0].a;
    return "Gracias por tu mensaje. Un agente humano revisará tu consulta y te responderá por email en menos de 24h.";
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: respond(text) }]);
    }, 500);
  };

  return (
    <div style={{ background: C.surface, borderRadius: 18, boxShadow: C.shadowSm, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 14, fontWeight: 700, color: C.slate }}>Chat de ayuda</div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", background: m.from === "user" ? C.green : C.bg, color: m.from === "user" ? "#FFFFFF" : C.slate, padding: "9px 13px", borderRadius: 14, fontSize: 13, maxWidth: "80%" }}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${C.border}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Escribe tu consulta..."
          style={{ flex: 1, minHeight: 44, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 12, padding: "0 14px", fontSize: 16, color: C.slate, outline: "none" }}
        />
        <button onClick={send} aria-label="Enviar" style={{ width: 44, height: 44, borderRadius: 12, background: C.green, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ArrowRight size={18} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}

function HelpScreen({ onBack }) {
  const C = useTheme();
  return (
    <div style={{ paddingBottom: 140 }}>
      <SubHeader title="Ayuda" onBack={onBack} />
      <div style={{ padding: 20 }}>
        <div style={{ background: C.surface, borderRadius: 18, padding: "4px 18px", boxShadow: C.shadowSm, marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, padding: "14px 0 4px" }}>Preguntas frecuentes</div>
          {FAQS.map((f, i) => (<FaqItem key={i} q={f.q} a={f.a} />))}
        </div>

        <div style={{ background: C.surface, borderRadius: 18, boxShadow: C.shadowSm, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "14px 16px", fontSize: 15, fontWeight: 700, color: C.slate, borderBottom: `1px solid ${C.border}` }}>Contacto</div>
          {[
            { icon: Mail, label: "Email", value: "hola@flycanarias.com" },
            { icon: Phone, label: "Teléfono", value: "+34 928 000 000" },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <c.icon size={16} color={C.green} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.slatePale }}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{c.value}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E7F7EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageCircle size={16} color="#25D366" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.slatePale }}>WhatsApp</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>+34 928 000 000</div>
            </div>
          </div>
        </div>

        <HelpChat />
      </div>
    </div>
  );
}

function Splash() {
  const C = useTheme();
  return (
    <div style={{ minHeight: "100dvh", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Plane size={34} color="#FFFFFF" />
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function FlyCanariasApp() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [screen, setScreen] = useState("home");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [authPrompt, setAuthPrompt] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // una vez hay sesión activa, cierra cualquier prompt de login pendiente
  useEffect(() => {
    if (session) setAuthPrompt(false);
  }, [session]);

  const onNav = (s) => { setSelectedFlight(null); setScreen(s); };
  const onSelectFlight = (f) => { setSelectedFlight(f); setScreen("detail"); };
  const onConfirmBooking = (booking) => setBookings((prev) => [booking, ...prev]);
  const onSignOut = async () => {
    await supabase.auth.signOut();
    setScreen("home");
  };

  if (authLoading) return <Splash />;

  // Home y Búsqueda son siempre accesibles sin sesión. "Mis reservas", "Check-in" y
  // "Perfil" requieren cuenta porque muestran datos del usuario. La pantalla de detalle
  // de vuelo (búsqueda de info, asiento) es libre; el login solo se pide al intentar
  // reservar (ver onRequireAuth en FlightDetail).
  const needsAuth = !session && ["bookings", "profile", "checkin"].includes(screen);
  if (needsAuth || (authPrompt && !session)) {
    return <AuthScreen onClose={() => { setAuthPrompt(false); onNav("home"); }} />;
  }

  const userEmail = session?.user?.email;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: C.bg, minHeight: "100dvh", maxWidth: 480, margin: "0 auto", position: "relative", WebkitFontSmoothing: "antialiased" }}>
      {screen === "home" && <HomeScreen onNav={onNav} userEmail={userEmail} bookings={session ? bookings : []} />}
      {screen === "search" && <SearchScreen onNav={onNav} onSelectFlight={onSelectFlight} userEmail={userEmail} />}
      {screen === "detail" && selectedFlight && (
        <FlightDetail
          flight={selectedFlight}
          onBack={() => setScreen("search")}
          onNav={onNav}
          onConfirmBooking={onConfirmBooking}
          session={session}
          onRequireAuth={() => setAuthPrompt(true)}
        />
      )}
      {screen === "bookings" && <BookingsScreen onNav={onNav} userEmail={userEmail} bookings={bookings} />}
      {screen === "checkin" && <CheckinScreen onNav={onNav} userEmail={userEmail} bookings={bookings} />}
      {screen === "status" && <StatusScreen onNav={onNav} userEmail={userEmail} />}
      {screen === "profile" && <ProfileScreen onNav={onNav} userEmail={userEmail} onSignOut={onSignOut} />}

      {screen !== "detail" && <BottomNav active={screen} onNav={onNav} />}
    </div>
  );
}
