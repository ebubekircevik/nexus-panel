# Nexus Panel - Admin Dashboard

Modern admin panel built with React, TypeScript, Vite, Ant Design, and JSON Server for mock API.

## Features

- Product Management (CRUD operations)
- User Management (CRUD operations)
- Search and Filter functionality
- Favorite products with Redux state management
- Modern UI with Ant Design
- React Query for data fetching and caching

## Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Ant Design** - UI Component Library
- **React Router** - Routing
- **React Query (TanStack Query)** - Data fetching
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **JSON Server** - Mock REST API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Running the Application

Run both JSON Server and Vite together (recommended):

```bash
npm run dev:all
```

This will start:

- JSON Server on `http://localhost:3001`
- Vite dev server on `http://localhost:5173`

Or run separately:

```bash
# Terminal 1
npm run json-server

# Terminal 2
npm run dev
```

### Build

```bash
npm run build
npm run preview  # Preview production build
```

## API Endpoints

The JSON Server provides REST API endpoints for products and users:

**Products:** `GET`, `POST`, `PUT`, `DELETE /products`

**Users:** `GET`, `POST`, `PUT`, `DELETE /users`

Search filtering is performed client-side, category filtering and sorting by `createdAt` are handled automatically.

## Project Structure

```
src/
├── components/        # React components
│   ├── products/     # Product-related components
│   └── users/        # User-related components
├── services/         # API services and React Query config
├── store/            # Redux store and slices
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── routes.tsx        # Route definitions
└── theme.ts          # Ant Design theme configuration

db.json               # JSON Server database file
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run json-server` - Start JSON Server
- `npm run dev:all` - Start both servers concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
