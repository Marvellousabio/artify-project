# Artify Frontend

A production-ready, modern landing page for Artify - a revolutionary graphic design studio. Built with Next.js 16, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-4.x-38bdf8)

## Features

- **SEO Optimized**: Meta tags, structured data, sitemap, robots.txt
- **Dark Mode**: Automatic system preference detection with manual toggle
- **Responsive Design**: Mobile-first approach with breakpoints
- **Performance**: Image optimization, lazy loading, code splitting
- **Accessibility**: ARIA labels, keyboard navigation, proper contrast ratios
- **Analytics Ready**: Google Analytics integration (configurable)
- **Contact Form**: Working form with API route and validation
- **PWA Ready**: Web app manifest for installation
- **Security Headers**: Configured for production safety
- **TypeScript**: Fully typed for better development experience

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Marvellousabio/artify-project.git
cd artify-project/artifyfrontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |
| `npm run analyze` | Build with bundle analyzer |
| `npm run check` | Run lint and type-check |
| `npm run clean` | Clean build cache |
| `npm run postbuild` | Generate sitemap |

## Project Structure

```
app/                    # Next.js App Router
├── api/               # API routes
├── layout.tsx         # Root layout
├── page.tsx           # Homepage
├── error.tsx          # Error boundary
├── loading.tsx        # Loading state
├── not-found.tsx      # 404 page
├── sitemap.ts         # Sitemap
└── robots.ts          # Robots.txt

components/
├── layout/           # Header, Footer
├── sections/         # Hero, Services, FAQ, Contact
└── seo/             # Structured data

lib/                 # Utilities
public/              # Static assets
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Linting**: ESLint
- **Typography**: Inter
- **Deployment**: Vercel recommended

## Configuration

Edit `.env.local` for environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
CONTACT_EMAIL_RECEIVER=hello@artifydesign.com
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy!

### Other Platforms

```bash
npm run build
npm start
```

## SEO Features

- JSON-LD structured data
- Open Graph & Twitter Cards
- XML Sitemap
- Robots.txt
- Meta descriptions
- Semantic HTML
- Alt text on images

## Performance

- Next.js Image optimization
- Automatic code splitting
- Font optimization
- Lazy loading
- Minimal JavaScript

## Browser Support

- Chrome, Firefox, Safari, Edge (latest)
- Mobile Safari & Chrome Mobile

---

Built with ❤️ by Artify Team
