# Multi-Agent Content Generator Frontend

## Project Overview
Standalone Next.js frontend for AI-powered content generation with research, writing, and image creation capabilities. Features a modern glassmorphism design with smooth animations and real-time WebSocket updates.

## Core Framework
- **Next.js 15.3.4** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type safety

## Styling & UI Components
- **Tailwind CSS 4** - Utility-first CSS framework with inline theme configuration
- **Radix UI** - Headless UI components
  - Dialog, Label, Progress, Select, Slot, Tabs
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variants
- **clsx & tailwind-merge** - Conditional classes

## Animation & Motion
- **Framer Motion 12.19.1** - Animation library for micro-interactions
- **Custom Motion Components** - Reusable animation wrappers in `/src/components/ui/motion.tsx`

## State Management & Data Fetching
- **Zustand 5.0.5** - Lightweight state management for generation and history
- **TanStack React Query 5.81.2** - Server state management with caching
- **Axios 1.10.0** - HTTP client for API communication

## Forms & Validation
- **React Hook Form 7.58.1** - Form handling with performance optimization
- **Hookform/Resolvers 5.1.1** - Validation resolvers
- **Zod 3.25.67** - Schema validation for type safety

## Development Tools
- **ESLint 9** - Code linting with Next.js configuration
- **PostCSS** - CSS processing with Tailwind plugin
- **Enhanced .gitignore** - Comprehensive file exclusion patterns

## Design System

### Brand Colors
- **Primary**: `#3D365C` (oklch(0.35 0.05 265))
- **Secondary**: `#7C4585` (oklch(0.45 0.08 310))
- **Accent**: `#C95792` (oklch(0.62 0.15 335))
- **Highlight**: `#F8B55F` (oklch(0.78 0.12 65))

### Custom Utility Classes
- `.glass` - Glassmorphism effect with backdrop blur
- `.glass-strong` - Stronger glassmorphism effect
- `.gradient-primary` - Primary brand gradient
- `.gradient-accent` - Accent brand gradient
- `.animate-float` - Floating animation
- `.animate-glow` - Glowing animation

### Component Enhancements
- **Buttons**: Enhanced with gradients, hover effects, and scaling animations
- **Cards**: Glassmorphism effects with hover animations and rounded corners
- **Inputs**: Rounded design with focus states and glassmorphism backgrounds
- **Tabs**: Solid primary background for active state with white text for visibility
- **Forms**: Improved validation styling with brand colors and enhanced accessibility
- **Badges**: Glass effects with accent borders for better visual hierarchy

### Motion Components (`/src/components/ui/motion.tsx`)
- `Motion` - Basic animation wrapper with multiple variants
- `MotionCard` - Card-specific animations
- `MotionButton` - Button with hover/tap animations
- `Stagger` - Staggered children animations
- `AnimatePresence` - Re-exported from Framer Motion

### Animation Variants
- `fadeInUp` - Fade in with upward motion
- `fadeIn` - Simple fade in/out
- `scaleIn` - Scale and fade animation
- `slideInFromLeft` - Slide from left animation

## Architecture & Structure

### Key Components
- **GenerationForm** (`/src/components/generation-form.tsx`) - Main content generation interface
- **ProgressTracker** (`/src/components/progress-tracker.tsx`) - Real-time generation progress
- **ResultsDisplay** (`/src/components/results-display.tsx`) - Generated content display with LinkedIn integration
- **HistoryGallery** (`/src/components/history-gallery.tsx`) - Previous generations
- **LinkedInPostModal** (`/src/components/linkedin-post-modal.tsx`) - LinkedIn posting interface

### API Integration
- **REST API** - HTTP endpoints for platforms, tones, and generation requests
- **WebSocket** - Real-time progress updates during content generation
- **LinkedIn API** - Direct posting to LinkedIn with image support
- **Error Handling** - Comprehensive error states and user feedback

### State Management
- **Generation Store** (`/src/lib/stores/generation-store.ts`) - Current generation state
- **History Store** (`/src/lib/stores/history-store.ts`) - Local storage of past generations
- **LinkedIn Store** (`/src/lib/stores/linkedin-store.ts`) - LinkedIn integration state
- **React Query** - Server state caching and synchronization

## Commands
- `npm run dev` - Start development server (Turbopack disabled for stability)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)
- `NEXT_PUBLIC_WS_URL` - WebSocket URL (default: ws://localhost:8000)

## Design Philosophy
- **Ultra-modern UI** - Glassmorphism effects with subtle depth and energy
- **Brand-consistent** - Comprehensive color system using specified brand palette
- **Smooth interactions** - Framer Motion animations for micro-interactions
- **Accessibility-first** - Enhanced focus states and proper contrast ratios
- **Responsive design** - Mobile-first approach with fluid layouts

## Recent Improvements
- Fixed background gradient for professional appearance
- Enhanced header text readability with proper contrast
- Resolved selected tab visibility with solid primary background
- Implemented comprehensive glassmorphism design system
- Added smooth animations and hover effects throughout
- Disabled Turbopack for development stability
- **LinkedIn Integration** - Complete social media posting workflow
- **Ultra-Large Modals** - Dramatically increased modal sizes to eliminate content scrolling
- **Nuclear CSS Overrides** - Aggressive viewport-based sizing (98vw x 95vh) with !important declarations to bypass Radix UI constraints
- **Actual Image Display** - Fixed image preview to show actual generated images instead of placeholder icons

## LinkedIn Integration Features
- **Auto Status Check** - Checks LinkedIn configuration on app load
- **Smart Button Display** - Only shows "Post to LinkedIn" when configured and content available
- **Content Preview** - ULTRA-WIDE modal (98vw x 95vh) with nuclear CSS overrides to bypass Radix UI constraints
- **Image Support** - Full image preview with automatic inclusion of generated images (displays actual image, not placeholder)
- **Visibility Controls** - Public, Connections, or LinkedIn Members options
- **Error Handling** - Graceful handling of configuration and network issues
- **Success Feedback** - Direct link to posted content on LinkedIn
- **Content Validation** - Character limits and content validation
- **History Integration** - Post to LinkedIn from saved history items with larger view modal (max-w-6xl)

## Known Issues
- Image optimization warnings (using `<img>` instead of Next.js `<Image>`)
- CSS `@apply` warnings in development (cosmetic only)