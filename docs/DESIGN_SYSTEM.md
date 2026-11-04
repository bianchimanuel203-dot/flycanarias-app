# Design system: FlyCanarias app

## Brand
- Brand roles (primary, secondary, accent): demo, no aplica. Colour tokens follow.
- Tone: demo, no aplica.
- Logo and assets: no logo file. Favicon only: public/favicon.svg (public/favicon.svg:1-4).
- Colour mismatch: theme-color #004D35 (index.html:7), favicon #006B3F (public/favicon.svg:2), app green #00833E (src/FlyCanarias.jsx:41).
- Light (src/FlyCanarias.jsx:40-63): green #00833E, greenMid and greenLight #00A651, greenDark #005C2C, greenPale #E6F5EC, yellow and gold #FFD100, yellowPale #FFF6CC, coral #E1584A, coralPale #FDEEEC, slate (text) #1A1A1A, slateLight #5C5C5C, slatePale #8A8A8A, surface #FFFFFF, border #E5E5E5, bg #F8F8F8.
- Dark (src/FlyCanarias.jsx:65-80): overrides surface #1E1E1E, bg #121212, border #2C2C2C, slate #FFFFFF, slateLight #B3B3B3, and the pale tints as translucent colours.
- Dark mode is a setting that picks LIGHT or DARK for the whole app (src/FlyCanarias.jsx:2308, :2342).
- Shadows: shadowSm, shadowMd, shadowLg (src/FlyCanarias.jsx:60-62, :77-79).

## Typography
- Headings: Inter, weight 900 for page titles and prices (src/FlyCanarias.jsx:476, :194). Google Fonts loads 400-800 only (index.html:13), so 900 falls back to the nearest loaded weight.
- Body: Inter, then system fonts (src/index.css:15-17). Size and line height are set inline per component; no global value (src/index.css:15-22).
- Scale: demo, no aplica.

## Components
Reuse before creating. One line each: name, variants, where it lives.
- Shared style helpers: sectionTitle, priceStrong, badgeYellow (src/FlyCanarias.jsx:186-195).
- SubHeader: title with back button (src/FlyCanarias.jsx:278).
- Toggle: on/off switch with aria-pressed (src/FlyCanarias.jsx:295-300).
- SegmentedControl: option group (src/FlyCanarias.jsx:309).
- ExtraOption: selectable extra card (src/FlyCanarias.jsx:337).
- BottomNav: four tabs, Inicio, Buscar, Vuelos, Perfil (src/FlyCanarias.jsx:650-656).
- AirportPicker, TopHeader, FaqItem: src/FlyCanarias.jsx:717, :225, :2110.
- No shared Button: buttons are inline `<button>` elements, 46 in total (src/FlyCanarias.jsx, grep `<button`).
- lucide-react, 33 icon names imported (src/FlyCanarias.jsx:3-37).
- The Google logo is an inline SVG (src/FlyCanarias.jsx:618-622).

## Layout
- Mobile-first: the app is a centred container, max width 480px (src/FlyCanarias.jsx:2365).
- No responsive rules: no @media, no matchMedia, no window width checks in src/ (grep: 0 matches).
- Spacing unit: demo, no aplica. Inline pixel values are used throughout.
- Viewport with viewport-fit=cover (index.html:6).
- Scrollbars are hidden (src/index.css:37-45).
- Border radius: 13 distinct values; most used are 12px (37 uses), 18px (29) and 10px (13) (src/FlyCanarias.jsx, grep `borderRadius`).

## Motion
- Keyframe fcPopIn: scale 0 to 1 with fade, 0.4s, used on the confirmation check icon (src/index.css:47-53; src/FlyCanarias.jsx:1107).
- Transitions, six values: background .2s (src/FlyCanarias.jsx:301), background .3s (:1160), left .2s (:292), color and transform .2s (:691), transform .2s (:2109), max-height .25s ease (:2111).
- Motion tokens: demo, no aplica.
- Reduced motion: not handled; no prefers-reduced-motion in src/ or index.css (grep: 0 matches).

## Accessibility
- Page language is Spanish (index.html:2).
- Headings: 2 h1, 1 h2, 2 h3 (src/FlyCanarias.jsx:476, :489, :730, :780, :1858).
- Alt text: the one `<img>` has alt text (src/FlyCanarias.jsx:1419-1421). Photos are CSS backgrounds (src/FlyCanarias.jsx:858).
- ARIA: 9 attributes, 7 aria-label, 1 aria-pressed, 1 aria-hidden (src/FlyCanarias.jsx:247, :254, :284, :300, :456, :618, :1835, :1957, :2175).
- Labels: 8 `<label>` and 9 `<input>` elements; none has an id or htmlFor, so labels are not tied to inputs (src/FlyCanarias.jsx:497, :512).
- Focus: no focus-visible style; 8 inputs remove the outline (src/FlyCanarias.jsx:517, :544).
- Contrast AA: not measured. {{unverified}}
- Keyboard reachable: not tested. {{unverified}}
