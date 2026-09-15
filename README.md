# ✈️ FlyCanarias — App de Aerolínea Interislas

Aplicación web de reserva de vuelos interinsulares para las Islas Canarias. Proyecto de desarrollo frontend construido con React + Vite.

## 🖥️ Demo

👉 [Ver demo en vivo](https://flycanarias.vercel.app)

## 📱 Pantallas

| Pantalla | Descripción |
|----------|-------------|
| **Login** | Autenticación con email/contraseña, registro, recuperación de contraseña y login social (Google/Apple) |
| **Inicio** | Dashboard con próximo vuelo, ofertas interislas y servicios a bordo |
| **Búsqueda** | Buscador con selector de aeropuertos (8 islas), fecha, pasajeros y resultados con filtros |
| **Reserva** | Flujo de 3 pasos: detalles del vuelo → selección de asiento → pago |
| **Mis Vuelos** | Tarjeta de embarque digital con código QR |
| **Perfil** | Datos del usuario, programa de fidelización y configuración |

## 🛠️ Stack Tecnológico

- **React 18** — Componentes funcionales con Hooks
- **Vite 5** — Build tool y dev server
- **Lucide React** — Iconografía
- **CSS-in-JS** — Estilos inline para componentes autocontenidos
- **Vercel** — Despliegue y hosting

## 🏗️ Arquitectura

```
src/
├── main.jsx          # Entry point
├── index.css         # Reset CSS global
├── App.jsx           # Router: login → app
├── LoginScreen.jsx   # Autenticación simulada
└── FlyCanarias.jsx   # App principal (5 pantallas)
```

### Decisiones técnicas

- **SPA con estado en cliente**: navegación por estados de React (`useState`) sin dependencia de router externo, reduciendo bundle size
- **CSS-in-JS inline**: componentes completamente autocontenidos y portables sin conflictos de especificidad
- **Datos mock integrados**: aeropuertos, vuelos y reservas simulados para demostrar el flujo completo sin backend
- **Mobile-first**: diseñado para viewport de 480px con soporte para safe-area-inset

## 🚀 Instalación local

```bash
git clone https://github.com/TU_USUARIO/flycanarias-app.git
cd flycanarias-app
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

## 📦 Build para producción

```bash
npm run build
```

Los archivos estáticos se generan en `dist/`.

## 🗺️ Roadmap

- [ ] Backend con Supabase (auth real + base de datos)
- [ ] Pasarela de pago con Stripe
- [ ] Notificaciones push de estado de vuelo
- [ ] PWA con soporte offline
- [ ] Integración con API de precios reales

## 👤 Autor

**Manuel Bianchi**
- LinkedIn: [linkedin.com/in/manuelbianchi-it](https://linkedin.com/in/manuelbianchi-it)

## 📄 Licencia

MIT
