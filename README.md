# Curly404

A lightweight, animated developer 404 page featuring an interactive curly bracket face `{0} {0} ~ {`. Built with 100% native Vanilla JavaScript and CSS. Zero dependencies.

---

## 📦 Project Size

Extremely lightweight with zero external runtime dependencies:

| File | Size | Minified / Gzipped (approx) | Description |
| :--- | :--- | :--- | :--- |
| **`curly-404.js`** | ~14.8 KB | ~3.8 KB | Native ES Module |
| **`curly-404.umd.js`** | ~13.5 KB | ~3.5 KB | Plain `<script>` / UMD bundle |
| **`curly-404.css`** | ~13.1 KB | ~2.6 KB | Styles & animations |
| **Total** | **~28 KB** | **~6.4 KB** | Full standalone package |

---

## 🚀 How to Import and Use

### 1. Modern JavaScript (Vite, Webpack, Next.js, SPA Routers)

```html
<!-- 1. Include the stylesheet -->
<link rel="stylesheet" href="./curly-404.css" />

<!-- 2. Target container (optional) -->
<div id="app"></div>

<!-- 3. Import and initialize -->
<script type="module">
  import { Curly404 } from './curly-404.js';

  const page = new Curly404({
    target: '#app', // Leave empty to automatically mount full screen on body
    homeUrl: '/',
    homeText: 'Back to Dashboard',
    docsUrl: '/docs',
    docsText: 'Documentation'
  });

  // When unmounting in an SPA router:
  // page.destroy();
</script>
```

### 2. Plain HTML / Script Tag (No Build Tool)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="curly-404.css" />
  <script src="curly-404.umd.js"></script>
</head>
<body>
  <div id="app"></div>

  <script>
    const page = new Curly404({
      target: '#app'
    });
  </script>
</body>
</html>
```

### 3. React / Next.js

```jsx
import { useEffect, useRef } from 'react';
import { Curly404 } from './curly-404.js';
import './curly-404.css';

export default function NotFound() {
  const containerRef = useRef(null);

  useEffect(() => {
    const page = new Curly404({
      target: containerRef.current,
      homeUrl: '/'
    });

    return () => page.destroy(); // Cleans up listeners & timers
  }, []);

  return <div ref={containerRef} />;
}
```

---

## ⚙️ Customization & Modifications

Pass any of these options when initializing `new Curly404(options)`:

```javascript
const page = new Curly404({
  target: '#app',                     // Target element or selector (null for body)
  title: '404',                       // Status code heading text
  headline: 'Page not found',         // Main heading
  homeUrl: '/',                       // Primary button URL
  homeText: 'Back to Dashboard',      // Primary button label
  docsUrl: '#docs',                   // Secondary button URL
  docsText: 'Documentation',          // Secondary button label
  onAction: ({ type, angry }) => {    // Callback for interactions
    console.log(type, angry);         // 'face-click', 'angry-state'
  }
});
```

### Modifying Colors & Styling

All styles use CSS variables defined at the top of [`curly-404.css`](file:///p:/404_/curly-404.css):

```css
:root {
  --c404-bg-dark: #070b12;         /* Background color */
  --c404-accent-cyan: #38bdf8;     /* Bracket color */
  --c404-accent-emerald: #10b981;  /* Pupil eye color */
  --c404-ruby-red: #ff2a5f;        /* Angry state color */
}
```

---

## 🎮 Interactive Features

- **Cursor Tracking**: Pupils smoothly look towards the user's cursor across the screen.
- **Natural Blinking**: Automatic organic eye blinks at random intervals.
- **Mouth Morphing**: Subtle idle bracket animations and tilts.
- **Playful Poke**: Clicking the face triggers a jitter shake.
- **Angry State**: Rapidly clicking the face 5 times triggers an angry reaction with ruby red eyes, slanted eyelids, steam, and an inverted mouth scowl before calming down.
- **Clean Cleanup**: Calling `page.destroy()` removes all DOM event listeners, timeouts, and elements.
