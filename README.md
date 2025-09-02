# Henry's Portfolio

A modern portfolio website built with Next.js, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible, and customizable components
- **Lucide React** - Beautiful & consistent icons

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
henry-portfolio/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout with SEO metadata
│   │   ├── page.tsx         # Homepage
│   │   └── the20hr-co/      # Experience page route
│   │       ├── layout.tsx   # SEO-optimized layout for experience page
│   │       └── page.tsx     # The20hr.co story page
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── BackNavigation.tsx # Reusable back navigation overlay
│   └── lib/                 # Utility functions
├── public/                  # Static assets
│   ├── halogo.svg          # Brand logo (used as favicon)
│   ├── site.webmanifest    # PWA configuration
│   └── images/             # Image assets
└── package.json
```

## Adding Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add navigation-menu
```

## Architecture & SEO

### Layout System

The project uses a layered layout approach for optimal SEO and functionality:

#### Root Layout (`src/app/layout.tsx`)
- **Purpose**: Defines global metadata, viewport settings, and PWA configuration
- **Exports**: `metadata` (SEO tags) and `viewport` (responsive settings)
- **Features**:
  - Open Graph and Twitter Card metadata
  - Custom favicon using brand logo (`halogo.svg`)
  - Web manifest reference for PWA support
  - Global theme and viewport configuration

#### Route-Specific Layouts (`src/app/the20hr-co/layout.tsx`)
- **Purpose**: Page-specific SEO optimization and structured data
- **Server Component**: Handles metadata export (required for SEO)
- **Features**:
  - Targeted meta descriptions and keywords
  - JSON-LD structured data for search engines
  - Social media optimization with custom images
  - Canonical URLs for SEO

#### Client Components (`page.tsx` files)
- **Purpose**: Interactive functionality and animations
- **Client-side**: Uses `"use client"` directive for interactivity
- **Features**:
  - Stagger animations and user interactions
  - Dynamic content and scroll behaviors
  - Clean separation from SEO concerns

### SEO Implementation

The portfolio implements comprehensive SEO best practices:

#### Metadata Strategy
- **Hierarchical**: Root layout provides global defaults, route layouts override specifics
- **Complete**: Title, description, keywords, authors, and social media tags
- **Dynamic**: Each page has tailored metadata for optimal search visibility

#### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The20hr.co - Europe's Fastest Startup Exit",
  "author": { "@type": "Person", "name": "Henry Allen" },
  "image": { "@type": "ImageObject", "url": "..." }
}
```

#### Image Optimization
- **Descriptive Alt Text**: SEO-friendly image descriptions with context
- **Lazy Loading**: Performance optimization for images and iframes
- **Social Sharing**: Optimized images for Open Graph and Twitter Cards

#### Semantic HTML
- **Article Structure**: Proper `<article>`, `<header>`, `<section>` tags
- **Microdata**: Schema.org markup for enhanced search results
- **Accessibility**: ARIA labels and semantic navigation

### Progressive Web App (PWA)

#### Web Manifest (`public/site.webmanifest`)
The `site.webmanifest` file configures your portfolio as a Progressive Web App:

```json
{
  "name": "Henry Allen - AI Engineer & Entrepreneur",
  "short_name": "Henry Allen",
  "description": "Portfolio of Henry Allen - Self-taught AI engineer...",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/halogo.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

#### PWA Features
- **Installable**: Users can install your portfolio as a native app
- **Offline Ready**: Cached resources for offline viewing
- **App-like Experience**: Standalone display mode removes browser chrome
- **Custom Branding**: Uses your logo for app icons and splash screens

#### Browser Benefits
- **Modern Favicon**: SVG favicon scales perfectly across all devices
- **Mobile Optimization**: Proper touch icons and theme colors
- **Search Engine Recognition**: Helps search engines understand your site structure

## Customization

- **Colors**: Modify CSS variables in `src/app/globals.css`
- **Components**: Customize shadcn/ui components in `src/components/ui/`
- **Fonts**: Configure in `src/app/layout.tsx`
- **SEO**: Update metadata in layout files for different pages
- **PWA**: Modify `site.webmanifest` for app configuration

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)