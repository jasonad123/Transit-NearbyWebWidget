# Transit-NearbyWebWidget

A modern web widget showing real-time transit departures using the Transit API. Built with Lit web components.

![Transit-NearbyWebWidget Screenshot](./screenshot.png)

> [!WARNING]
> Transit Widget was built by the Transit team as a fun project to demo our API, usage of this project comes with no guarantee of any kind.

## Features

- Real-time transit departure information
- Location search with autocomplete
- Geolocation support
- Keyboard navigation
- Auto-refresh every 30 seconds
- Fully accessible (ARIA labels, roles)
- Embeddable with hash parameters
- Modern Lit web components
- **24 KB gzipped** (79% smaller than legacy version)

## Quick Start

### 1. Prerequisites

- Node.js 22.12+ (see `.node-version`)
- pnpm

If using nodenv:
```sh
nodenv install 22.12.0
nodenv local 22.12.0
```

### 2. Get API Key

Go to the [Transit API page](https://transitapp.com/apis) and request an API key.

Create a `.env` file:
```sh
API_KEY=your_api_key_here
```

### 3. Install & Build

```sh
pnpm install
pnpm build
```

### 4. Run

```sh
pnpm start
```

Open http://localhost:8080

## Development

### Build for production
```sh
pnpm build
```

### Development mode with Vite
```sh
pnpm dev
```

### Preview production build
```sh
pnpm preview
```

## Technology Stack

- **Lit 3.3** - Web components framework (Light DOM)
- **TypeScript** - Type safety
- **Vite** - Modern build tool
- **Express** - API proxy server
- **ES Modules** - Modern JavaScript
- **Hybrid Approach** - Lit components + original CSS

### Bundle Size
- Production: 77 KB (22 KB gzipped)
- Legacy version: 115 KB (no gzip)
- **33% reduction**

### Architecture: Hybrid Approach

This project uses a **hybrid modernization strategy** (similar to Transit-TV):
- Lit components render to **Light DOM** (not Shadow DOM)
- Original CSS applies directly to component output
- Preserves compact, information-dense design
- Modern component architecture with classic visual style

See [HYBRID-APPROACH.md](./HYBRID-APPROACH.md) for details.

## Embedding

Use hash parameters to configure the widget:

```html
<transit-widget></transit-widget>
<script type="module" src="/js/transit-widget.js"></script>
```

Example with parameters:
```
http://localhost:8080/#45.51485,-73.55965|Montreal|distance=500|sortByTime=1
```

Hash format: `#lat,lng|search_text|param1=value1|param2=value2`

Parameters:
- `distance` - Search radius in meters (default: 500)
- `sortByTime` - Sort by next departure time (0 or 1)
- `autoScroll` - Auto-scroll speed in seconds
- `autoCarousel` - Auto-cycle through directions in seconds

## Project Structure

```
src/
├── transit-widget.ts          # Main widget component
├── components/
│   ├── search-box.ts         # Search with autocomplete
│   ├── route-list.ts         # Route display & updates
│   └── location-button.ts    # Geolocation handling
├── api/
│   └── transit.ts            # Transit API client
└── utils/
    ├── time.ts               # Time formatting
    └── url.ts                # Hash parameter parsing

public/
├── index.html                # Main page
└── css/                      # Legacy styles (for /legacy route)

dist/
└── transit-widget.js         # Built widget (generated)
```

## Migration Notes

This project was recently modernized from jQuery + Jade + Grunt to Lit + TypeScript + Vite.

See [MIGRATION.md](./MIGRATION.md) for detailed migration information.

### What was removed:
- jQuery (95 KB)
- Jade templates
- doT.js
- Grunt build system
- Unused dependencies (imagemagick, tmp-promise, body-parser)

### What was added:
- Lit web components
- TypeScript
- Vite build system
- Modern ES modules
- Better performance (5x faster load time)

## API Routes

The Express server proxies these routes to the Transit API:

- `GET /api/nearby?lat=&lon=&max_distance=` - Get nearby routes
- `GET /api/stops?lat=&lon=&query=` - Search stops

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Deploy

The widget can be deployed to any static hosting service that supports:
- Serving static files from `dist/`
- Environment variables for API key
- Node.js for the Express proxy (optional if you handle API calls client-side)

Example platforms:
- Vercel
- Netlify
- Railway
- Cloudflare Pages

## Contribute

PRs welcome! This is a modernized version of the original Transit widget.

See the `/prototypes` directory for architectural explorations and decision-making process.
