# 🚀 Upzy - Partner Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC.svg)](https://tailwindcss.com/)

A modern, full-stack platform for managing partner jobs and services. Built with React, TypeScript, and Node.js with a focus on performance, security, and user experience.

## ✨ Features

### 🤝 Partner Module (Complete)
- **Job Discovery**: Browse and filter available jobs by category, type, budget, and location
- **Job Management**: Accept, track, and complete jobs with real-time status updates
- **Earnings Dashboard**: Comprehensive earnings tracking with trends and analytics
- **Profile Management**: Editable profiles with skills, ratings, and availability
- **Settings & Preferences**: Notification, privacy, and payment settings

### 🏢 Backend API (Complete)
- **RESTful API**: 12+ endpoints for job and user management
- **JWT Authentication**: Secure token-based authentication with role-based access
- **Job System**: Complete job lifecycle management (POSTED → ASSIGNED → COMPLETED)
- **Data Filtering**: Advanced filtering, pagination, and search capabilities
- **Security**: Helmet security headers, CORS protection, and input validation

### 🎨 Technical Features
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit with RTK Query for API caching
- **Testing**: Comprehensive test suites with Vitest
- **Performance**: Code splitting and optimized builds

## 🏗️ Architecture

```
upzy/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page components
│   ├── services/                 # API services with RTK Query
│   ├── store/                    # Redux store and slices
│   └── types/                    # TypeScript type definitions
├── server/                       # Backend Express API
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Authentication & security
│   │   └── data/                 # Mock data (development)
│   └── package.json
└── package.json                  # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:3003
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev
# API runs at http://localhost:8000
```

## 📋 Available Scripts

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # ESLint checking
```

### Backend
```bash
npm run dev          # Development server with nodemon
npm start           # Production server
```

## 🛠️ API Endpoints

### Authentication
- `POST /v1/auth/login` - User login
- `GET /v1/auth/verify` - Token verification

### Jobs
- `GET /v1/jobs` - Browse jobs with filtering
- `POST /v1/jobs/:id/accept` - Accept job (partner only)
- `GET /v1/jobs/my-jobs` - Get partner's jobs
- `POST /v1/jobs/:id/complete` - Complete job

[View full API documentation](./server/README.md)

## 🎯 Demo

### Live Demo Routes
- **Partner Jobs**: `http://localhost:3003/partner/jobs`
- **My Jobs**: `http://localhost:3003/partner/my-jobs`
- **Earnings**: `http://localhost:3003/partner/earnings`
- **Profile**: `http://localhost:3003/partner/profile`
- **Settings**: `http://localhost:3003/partner/settings`

### Demo Accounts
- **Partner**: `partner@example.com` (any password)
- **Business**: `business@example.com` (any password)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:routes
npm run test:components
npm run test:auth
npm run test:integration
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **RTK Query** - API caching
- **React Router** - Routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JWT** - Authentication
- **Helmet** - Security
- **CORS** - Cross-origin requests
- **Morgan** - Request logging

### Development
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks (optional)

## 📊 Project Status

- ✅ **Core Infrastructure**: Complete
- ✅ **Authentication System**: Complete
- ✅ **Partner Module**: Complete (5 pages)
- ✅ **Backend API**: Complete (12+ endpoints)
- ✅ **Testing Suite**: Complete
- ⏳ **Business Module**: Planned
- ⏳ **Employee Module**: Planned

## 🚦 Development Workflow

1. **Feature Development**: Create feature branches
2. **Code Quality**: ESLint + Prettier enforcement
3. **Testing**: Write tests for new features
4. **Review**: Code review before merging
5. **Deployment**: Automated builds and deployment

## 📝 Environment Variables

### Backend (.env)
```env
PORT=8000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite team for the lightning-fast build tool
- Redux Toolkit team for simplified state management

---

**Built with ❤️ for the partner economy** 