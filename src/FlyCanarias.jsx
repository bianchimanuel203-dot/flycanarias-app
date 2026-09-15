import { useState, useEffect, useRef } from "react";
import {
  Plane,
  Search,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
  CreditCard,
  User,
  Home,
  Ticket,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Shield,
  Wifi,
  Coffee,
  Luggage,
  QrCode,
  Check,
  X,
  Bell,
  Heart,
  TrendingUp,
  Sun,
  Cloud,
  Palmtree,
  Eye,
  AlertCircle,
} from "lucide-react";

/* ─── palette & tokens ─── */
const C = {
  green: "#006B3F",
  greenLight: "#00895A",
  greenPale: "#E8F5EE",
  greenDark: "#004D2C",
  sand: "#FAF7F2",
  sandDark: "#F0EBE1",
  coral: "#E8734A",
  coralLight: "#FFF0EB",
  slate: "#1E293B",
  slateLight: "#64748B",
  slatePale: "#94A3B8",
  white: "#FFFFFF",
  border: "#E2E8F0",
  bg: "#F8FAFC",
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
  { dest: "Tenerife", price: 29, img: "🏔️", tagline: "Escápate al Teide" },
  { dest: "La Palma", price: 35, img: "🌴", tagline: "Isla Bonita te espera" },
  { dest: "Gran Canaria", price: 25, img: "🏖️", tagline: "Dunas de Maspalomas" },
];

const BOOKINGS = [
  {
    id: "FC-2026-4851",
    from: "ACE",
    to: "LPA",
    date: "18 Sep 2026",
    dep: "07:15",
    arr: "07:55",
    gate: "B4",
    seat: "12A",
    passenger: "Manuel Bianchi",
    status: "confirmed",
  },
];

/* ─── helpers ─── */
const airportName = (code) => AIRPORTS.find((a) => a.code === code);
const today = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

/* ─── components ─── */

/* bottom nav */
function BottomNav({ active, onNav }) {
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
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
        zIndex: 100,
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
              gap: 2,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? C.green : C.slatePale,
              fontSize: 11,
              fontWeight: isActive ? 600 : 400,
              transition: "color .2s",
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* airport selector modal */
function AirportPicker({ open, onSelect, onClose, title }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white,
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 480,
          maxHeight: "70vh",
          overflow: "auto",
          padding: "24px 20px",
        }}
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "14px 12px",
              background: "none",
              border: "none",
              borderBottom: `1px solid ${C.border}`,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: C.greenPale,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.green,
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
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

/* HOME */
function HomeScreen({ onNav, setSearchState }) {
  return (
    <div style={{ paddingBottom: 90 }}>
      {/* hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`,
          padding: "48px 20px 36px",
          color: C.white,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 2 }}>Bienvenido de nuevo</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Manuel ✈️</div>
          </div>
          <button style={{ background: "rgba(255,255,255,.15)", border: "none", borderRadius: 12, padding: 10, cursor: "pointer", color: C.white }}>
            <Bell size={20} />
          </button>
        </div>

        {/* quick search card */}
        <div
          style={{
            background: C.white,
            borderRadius: 16,
            padding: 20,
            color: C.slate,
            boxShadow: "0 8px 32px rgba(0,0,0,.12)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>¿A dónde volamos?</div>
          <button
            onClick={() => onNav("search")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              cursor: "pointer",
              color: C.slatePale,
              fontSize: 15,
            }}
          >
            <Search size={18} />
            Buscar vuelos entre islas
          </button>
        </div>
      </div>

      {/* next flight */}
      {BOOKINGS.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Tu próximo vuelo</div>
          <div
            style={{
              background: C.white,
              borderRadius: 16,
              padding: 18,
              border: `1px solid ${C.border}`,
            }}
            onClick={() => onNav("bookings")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.green,
                  background: C.greenPale,
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                Confirmado
              </span>
              <span style={{ fontSize: 13, color: C.slateLight }}>{BOOKINGS[0].date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.slate }}>{BOOKINGS[0].from}</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>{BOOKINGS[0].dep}</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px" }}>
                <Plane size={18} style={{ color: C.green, transform: "rotate(0deg)" }} />
                <div style={{ width: "80%", height: 1, background: C.border, margin: "4px 0" }} />
                <div style={{ fontSize: 11, color: C.slatePale }}>40min</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.slate }}>{BOOKINGS[0].to}</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>{BOOKINGS[0].arr}</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 14,
                paddingTop: 14,
                borderTop: `1px solid ${C.border}`,
                fontSize: 13,
                color: C.slateLight,
              }}
            >
              <span>Puerta: <b style={{ color: C.slate }}>{BOOKINGS[0].gate}</b></span>
              <span>Asiento: <b style={{ color: C.slate }}>{BOOKINGS[0].seat}</b></span>
              <span>Ref: <b style={{ color: C.slate }}>{BOOKINGS[0].id}</b></span>
            </div>
          </div>
        </div>
      )}

      {/* promos */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.slate }}>Ofertas interislas</div>
          <button style={{ background: "none", border: "none", color: C.green, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Ver todas
          </button>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {PROMOS.map((p, i) => (
            <div
              key={i}
              onClick={() => onNav("search")}
              style={{
                minWidth: 150,
                background: C.white,
                borderRadius: 16,
                border: `1px solid ${C.border}`,
                overflow: "hidden",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  height: 90,
                  background: `linear-gradient(135deg, ${C.greenPale} 0%, ${C.sandDark} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                }}
              >
                {p.img}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.slate }}>{p.dest}</div>
                <div style={{ fontSize: 12, color: C.slateLight, marginBottom: 6 }}>{p.tagline}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.coral }}>
                  Desde {p.price}€
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* services */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 12 }}>Servicios a bordo</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: Wifi, label: "WiFi a bordo", sub: "Gratis en todos los vuelos" },
            { icon: Coffee, label: "Catering", sub: "Snacks y bebidas" },
            { icon: Luggage, label: "Equipaje", sub: "23kg incluidos" },
            { icon: Shield, label: "Flex ticket", sub: "Cambios sin coste" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 14,
                padding: "16px 14px",
                border: `1px solid ${C.border}`,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: i % 2 === 0 ? C.greenPale : C.coralLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <s.icon size={18} color={i % 2 === 0 ? C.green : C.coral} />
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

/* SEARCH */
function SearchScreen({ onNav, onSelectFlight }) {
  const [from, setFrom] = useState("ACE");
  const [to, setTo] = useState("LPA");
  const [date, setDate] = useState(today());
  const [pax, setPax] = useState(1);
  const [results, setResults] = useState(null);
  const [picker, setPicker] = useState(null); // 'from' | 'to' | null
  const [sortBy, setSortBy] = useState("price"); // price | time

  const doSearch = () => {
    let r = FLIGHTS.filter((f) => f.from === from && f.to === to);
    if (r.length === 0) r = FLIGHTS.filter((f) => f.from === from);
    if (r.length === 0) r = FLIGHTS.slice(0, 4);
    setResults(r);
  };

  const sorted = results
    ? [...results].sort((a, b) => (sortBy === "price" ? a.price - b.price : a.dep.localeCompare(b.dep)))
    : null;

  return (
    <div style={{ paddingBottom: 90 }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`,
          padding: "48px 20px 28px",
          color: C.white,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Buscar vuelos</div>

        <div style={{ background: C.white, borderRadius: 16, padding: 16, color: C.slate }}>
          {/* from/to */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button
              onClick={() => setPicker("from")}
              style={{
                flex: 1,
                padding: "14px 12px",
                borderRadius: 12,
                background: C.bg,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 2 }}>Origen</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{from}</div>
              <div style={{ fontSize: 12, color: C.slateLight }}>{airportName(from)?.city}</div>
            </button>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => {
                  const tmp = from;
                  setFrom(to);
                  setTo(tmp);
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: C.greenPale,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ArrowRight size={16} color={C.green} />
              </div>
            </div>
            <button
              onClick={() => setPicker("to")}
              style={{
                flex: 1,
                padding: "14px 12px",
                borderRadius: 12,
                background: C.bg,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 2 }}>Destino</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{to}</div>
              <div style={{ fontSize: 12, color: C.slateLight }}>{airportName(to)?.city}</div>
            </button>
          </div>

          {/* date + pax */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                background: C.bg,
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 4 }}>
                <Calendar size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                Fecha
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.slate,
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{
                width: 100,
                padding: "12px",
                borderRadius: 12,
                background: C.bg,
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ fontSize: 11, color: C.slatePale, marginBottom: 4 }}>
                <Users size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                Pasajeros
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setPax(Math.max(1, pax - 1))}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    background: C.white,
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  –
                </button>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{pax}</span>
                <button
                  onClick={() => setPax(Math.min(9, pax + 1))}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    background: C.white,
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={doSearch}
            style={{
              width: "100%",
              padding: "16px",
              background: C.green,
              color: C.white,
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Search size={18} />
            Buscar vuelos
          </button>
        </div>
      </div>

      {/* results */}
      {sorted && (
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.slate }}>
              {sorted.length} vuelo{sorted.length !== 1 ? "s" : ""} encontrado{sorted.length !== 1 ? "s" : ""}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["price", "time"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${sortBy === s ? C.green : C.border}`,
                    background: sortBy === s ? C.greenPale : C.white,
                    color: sortBy === s ? C.green : C.slateLight,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {s === "price" ? "Precio" : "Hora"}
                </button>
              ))}
            </div>
          </div>

          {sorted.map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectFlight(f)}
              style={{
                background: C.white,
                borderRadius: 16,
                padding: 18,
                marginBottom: 12,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                transition: "box-shadow .2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Plane size={14} color={C.green} />
                  <span style={{ fontSize: 13, color: C.slateLight }}>{f.aircraft}</span>
                </div>
                {f.seats <= 5 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.coral,
                      background: C.coralLight,
                      padding: "3px 8px",
                      borderRadius: 10,
                    }}
                  >
                    {f.seats} plazas
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.slate }}>{f.dep}</div>
                  <div style={{ fontSize: 13, color: C.slateLight }}>{f.from}</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 10px" }}>
                  <div style={{ fontSize: 12, color: C.slatePale, marginBottom: 2 }}>{f.duration}</div>
                  <div style={{ width: "100%", height: 2, background: C.greenPale, borderRadius: 1, position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: -3,
                        right: 0,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: C.green,
                      }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.slate }}>{f.arr}</div>
                  <div style={{ fontSize: 13, color: C.slateLight }}>{f.to}</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  {[Wifi, Coffee, Luggage].map((Icon, i) => (
                    <Icon key={i} size={16} color={C.slatePale} />
                  ))}
                </div>
                <div>
                  <span style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{f.price}€</span>
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
        onSelect={(code) => {
          if (picker === "from") setFrom(code);
          else setTo(code);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
    </div>
  );
}

/* FLIGHT DETAIL / BOOKING */
function FlightDetail({ flight, onBack, onNav }) {
  const [step, setStep] = useState(0); // 0=detail, 1=seats, 2=pay, 3=confirmed
  const [selectedSeat, setSelectedSeat] = useState(null);
  const f = flight;

  const seats = Array.from({ length: 24 }, (_, i) => {
    const row = Math.floor(i / 4) + 1;
    const col = ["A", "B", "C", "D"][i % 4];
    const taken = Math.random() > 0.6;
    return { id: `${row}${col}`, row, col, taken };
  });

  if (step === 3) {
    return (
      <div style={{ minHeight: "100vh", background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Check size={40} color={C.green} strokeWidth={3} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.slate, marginBottom: 8 }}>¡Reserva confirmada!</div>
        <div style={{ fontSize: 15, color: C.slateLight, marginBottom: 28, maxWidth: 280 }}>
          Tu vuelo {f.from} → {f.to} está listo. Recibirás la tarjeta de embarque por email.
        </div>
        <div style={{ background: C.bg, borderRadius: 16, padding: 20, width: "100%", maxWidth: 320, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: C.slateLight }}>Referencia</span>
            <span style={{ fontWeight: 700, color: C.slate }}>FC-2026-{Math.floor(Math.random() * 9000 + 1000)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: C.slateLight }}>Asiento</span>
            <span style={{ fontWeight: 700, color: C.slate }}>{selectedSeat || "12A"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span style={{ color: C.slateLight }}>Total</span>
            <span style={{ fontWeight: 700, color: C.green }}>{f.price}€</span>
          </div>
        </div>
        <button
          onClick={() => onNav("bookings")}
          style={{ padding: "16px 40px", background: C.green, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
        >
          Ver mis vuelos
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`,
          padding: "48px 20px 28px",
          color: C.white,
        }}
      >
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,.15)", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: C.white, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft size={16} />
          Volver
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{f.from}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{airportName(f.from)?.city}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
            <Plane size={22} />
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{f.duration}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{f.to}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{airportName(f.to)?.city}</div>
          </div>
        </div>
      </div>

      {/* stepper */}
      <div style={{ display: "flex", padding: "16px 20px", gap: 8 }}>
        {["Detalles", "Asiento", "Pago"].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: i <= step ? C.green : C.border,
                marginBottom: 6,
                transition: "background .3s",
              }}
            />
            <span style={{ fontSize: 12, fontWeight: i === step ? 700 : 400, color: i <= step ? C.green : C.slatePale }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px" }}>
        {step === 0 && (
          <>
            <div style={{ background: C.white, borderRadius: 16, padding: 18, border: `1px solid ${C.border}`, marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 14 }}>Información del vuelo</div>
              {[
                { label: "Aeronave", value: f.aircraft },
                { label: "Salida", value: `${f.dep} — ${airportName(f.from)?.name}` },
                { label: "Llegada", value: `${f.arr} — ${airportName(f.to)?.name}` },
                { label: "Plazas disponibles", value: `${f.seats}` },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: C.slateLight }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: C.slate }}>{r.value}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.white, borderRadius: 16, padding: 18, border: `1px solid ${C.border}`, marginBottom: 20 }}>
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
          <div style={{ background: C.white, borderRadius: 16, padding: 18, border: `1px solid ${C.border}`, marginBottom: 20 }}>
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
                  const gap = s.col === "C";
                  return (
                    <>
                      {s.col === "C" && s.row === seats.find((x) => x.col === "C")?.row && (
                        <div key={`gap-${s.row}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.slatePale, fontWeight: 600 }}>
                          {s.row}
                        </div>
                      )}
                      <button
                        key={s.id}
                        onClick={() => !s.taken && setSelectedSeat(s.id)}
                        disabled={s.taken}
                        style={{
                          width: 38,
                          height: 34,
                          borderRadius: 6,
                          border: isSelected ? `2px solid ${C.green}` : "1px solid transparent",
                          background: s.taken ? C.slatePale : isSelected ? C.green : C.bg,
                          color: s.taken ? C.white : isSelected ? C.white : C.slate,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: s.taken ? "not-allowed" : "pointer",
                        }}
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
          <div style={{ background: C.white, borderRadius: 16, padding: 18, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 14 }}>Resumen de pago</div>
            {[
              { label: "Vuelo " + f.from + " → " + f.to, value: f.price + "€" },
              { label: "Asiento " + (selectedSeat || "—"), value: "Incluido" },
              { label: "Tasas aeroportuarias", value: "12€" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
                <span style={{ color: C.slateLight }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: C.slate }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontSize: 16 }}>
              <span style={{ fontWeight: 700, color: C.slate }}>Total</span>
              <span style={{ fontWeight: 800, color: C.green }}>{f.price + 12}€</span>
            </div>
            <div style={{ margin: "18px 0 8px", fontSize: 14, fontWeight: 600, color: C.slate }}>Método de pago</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 14,
                background: C.bg,
                borderRadius: 12,
                border: `1px solid ${C.green}`,
              }}
            >
              <CreditCard size={20} color={C.green} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>•••• •••• •••• 4851</div>
                <div style={{ fontSize: 12, color: C.slateLight }}>Visa · 09/28</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* sticky footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.white,
          borderTop: `1px solid ${C.border}`,
          padding: "14px 20px calc(14px + env(safe-area-inset-bottom, 0px))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 90,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: C.slateLight }}>Precio total</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{f.price + 12}€</div>
        </div>
        <button
          onClick={() => setStep(Math.min(step + 1, 3))}
          style={{
            padding: "14px 32px",
            background: C.green,
            color: C.white,
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {step === 2 ? "Confirmar pago" : "Continuar"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* BOOKINGS */
function BookingsScreen() {
  const b = BOOKINGS[0];
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: "48px 20px 20px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.slate, marginBottom: 20 }}>Mis vuelos</div>

        {/* boarding pass style */}
        <div
          style={{
            background: C.white,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            boxShadow: "0 4px 20px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`, padding: "20px 20px 16px", color: C.white }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Plane size={18} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>FlyCanarias</span>
              </div>
              <span style={{ fontSize: 13, opacity: 0.8 }}>{b.id}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 36, fontWeight: 800 }}>{b.from}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{b.dep}</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 6px" }}>
                <div style={{ width: "80%", borderBottom: "2px dashed rgba(255,255,255,.4)" }} />
                <Plane size={16} style={{ margin: "6px 0", opacity: 0.7 }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 36, fontWeight: 800 }}>{b.to}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{b.arr}</div>
              </div>
            </div>
          </div>

          {/* dashed separator */}
          <div style={{ position: "relative", height: 24, background: C.white }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 20,
                right: 20,
                borderBottom: `2px dashed ${C.border}`,
              }}
            />
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
                <div style={{ fontSize: 15, fontWeight: 600, color: C.slate }}>{b.passenger}</div>
              </div>
            </div>

            {/* QR code placeholder */}
            <div
              style={{
                marginTop: 18,
                padding: 16,
                background: C.bg,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  background: C.white,
                  borderRadius: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(8,1fr)",
                  gridTemplateRows: "repeat(8,1fr)",
                  gap: 1,
                  padding: 8,
                }}
              >
                {Array.from({ length: 64 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 1,
                      background: Math.random() > 0.45 ? C.slate : "transparent",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 12, color: C.slateLight }}>Tarjeta de embarque digital</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* PROFILE */
function ProfileScreen() {
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: "48px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenLight} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.white,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            MB
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.slate }}>Manuel Bianchi</div>
            <div style={{ fontSize: 14, color: C.slateLight }}>manuel@flycanarias.com</div>
            <div
              style={{
                marginTop: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: "#B8860B",
                background: "#FFF8E1",
                padding: "3px 10px",
                borderRadius: 10,
              }}
            >
              <Star size={12} />
              Club Isleño Gold
            </div>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { value: "24", label: "Vuelos", icon: Plane },
            { value: "3.840", label: "Millas", icon: TrendingUp },
            { value: "Gold", label: "Status", icon: Star },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 14,
                padding: 16,
                textAlign: "center",
                border: `1px solid ${C.border}`,
              }}
            >
              <s.icon size={20} color={C.green} style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 20, fontWeight: 800, color: C.slate }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.slateLight }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* menu items */}
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          {[
            { icon: User, label: "Datos personales" },
            { icon: CreditCard, label: "Métodos de pago" },
            { icon: Bell, label: "Notificaciones" },
            { icon: Heart, label: "Destinos favoritos" },
            { icon: Shield, label: "Seguridad" },
            { icon: Settings, label: "Configuración" },
          ].map((item, i, arr) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                cursor: "pointer",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
              }}
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
            style={{
              padding: "14px 40px",
              background: "none",
              border: `1px solid ${C.coral}`,
              borderRadius: 12,
              color: C.coral,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function FlyCanariasApp() {
  const [screen, setScreen] = useState("home");
  const [selectedFlight, setSelectedFlight] = useState(null);

  const onNav = (s) => {
    setSelectedFlight(null);
    setScreen(s);
  };

  const onSelectFlight = (f) => {
    setSelectedFlight(f);
    setScreen("detail");
  };

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: C.bg,
        minHeight: "100vh",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {screen === "home" && <HomeScreen onNav={onNav} />}
      {screen === "search" && <SearchScreen onNav={onNav} onSelectFlight={onSelectFlight} />}
      {screen === "detail" && selectedFlight && (
        <FlightDetail flight={selectedFlight} onBack={() => setScreen("search")} onNav={onNav} />
      )}
      {screen === "bookings" && <BookingsScreen />}
      {screen === "profile" && <ProfileScreen />}

      {screen !== "detail" && <BottomNav active={screen} onNav={onNav} />}
    </div>
  );
}
