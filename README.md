# ✈️ FlyCanarias — App de Aerolínea Interislas

App móvil de reserva de vuelos interinsulares para las Islas Canarias.
Construida con React + Vite, autenticación real con Supabase y desplegada en Vercel.

🔗 [Ver demo en vivo](https://flycanarias-app.vercel.app)

---

## 📱 Pantallas

| Pantalla | Descripción |
|----------|-------------|
| **Login** | Autenticación real con Supabase (email/contraseña + Google OAuth) |
| **Inicio** | Dashboard con próximo vuelo, ofertas interislas y servicios a bordo |
| **Búsqueda** | 8 aeropuertos canarios, fecha, pasajeros, filtros por precio/hora |
| **Reserva** | Flujo 3 pasos: detalles → selección de asiento → pago |
| **Mis Vuelos** | Tarjeta de embarque digital con código QR y check-in simulado |
| **Perfil** | Datos del usuario, programa de fidelización Club Isleño |

---

## 🛠️ Stack

- **React 18** — Componentes funcionales con Hooks
- **Vite 5** — Build tool y dev server
- **Supabase Auth** — Autenticación real (email + Google OAuth)
- **Lucide React** — Iconografía
- **CSS-in-JS** — Estilos inline, sin dependencias de CSS externo
- **Vercel** — Despliegue continuo desde GitHub

---

## 🏗️ Arquitectura

src/
├── main.jsx # Entry point
├── index.css # Reset CSS global
├── App.jsx # Gate de auth: guest → app
├── lib/
│ └── supabaseClient.js # Cliente Supabase
└── FlyCanarias.jsx # App principal (todas las pantallas)


### Decisiones técnicas

- **SPA con estado en cliente** — navegación por `useState` sin router externo, reduciendo bundle size
- **Gate de login diferido** — Home y Búsqueda accesibles sin sesión; login solo al intentar reservar
- **CSS-in-JS inline** — componentes autocontenidos sin conflictos de especificidad
- **Datos mock** — aeropuertos, vuelos y reservas simulados para demostrar el flujo completo
- **Mobile-first** — diseñado para 480px con soporte `safe-area-inset`

---

## 🚀 Instalación local

```bash
git clone https://github.com/bianchimanuel203-dot/flycanarias-app.git
cd flycanarias-app
npm install
cp .env.example .env.local
# Añade tus variables de Supabase en .env.local
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

---

## 🔑 Variables de entorno

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=


---

## 🗺️ Roadmap

- [x] Supabase Auth (email + Google OAuth)
- [x] Gate de login diferido
- [x] Check-in simulado
- [x] Boarding pass con QR
- [ ] Stripe pagos en modo test
- [ ] Notificaciones push
- [ ] PWA con soporte offline
