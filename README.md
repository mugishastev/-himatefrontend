# Himate Frontend

React + TypeScript + Vite frontend for the Himate chat application.

## Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router
- Axios
- Socket.IO client
- Zustand

## Requirements

- Node.js 24+ (recommended to match backend environment)
- Running Himate backend (`http://localhost:5000` by default)

## Environment Setup

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Himate
VITE_APP_ENV=development
```

Notes:
- `VITE_API_URL` is used for HTTP API requests.
- `VITE_SOCKET_URL` is used for Socket.IO connection.

## Local Development

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:5173`

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build production bundle
- `npm run preview` - preview production build locally
- `npm run lint` - run eslint

## Build Output

Production build artifacts are generated in `dist/`.
