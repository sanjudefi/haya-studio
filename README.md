# Haya Studio – Demo

A Next.js 14 demo application showcasing studio scheduling capabilities with instructor availability management and PNG snapshot generation.

> **🚀 Deploying to Vercel?** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment instructions and troubleshooting.

## Features

- **Manager Dashboard**: View all instructor availability for any date
- **Instructor Portal**: Manage weekly schedules, leaves, and availability
- **PNG Snapshots**: Generate and download beautiful daily schedule images
- **Demo Mode**: No database, auth, or external services required
- **Vercel-Ready**: Optimized for edge runtime deployment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: Browser localStorage
- **PNG Generation**: @vercel/og (Edge Runtime)

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Demo Credentials

### Manager Access
- **Role**: Manager
- **Password**: `demo123`

### Instructor Access
- **Role**: Instructor
- **Password**: `demo123`
- **Select**: Any of the 10 demo instructors

## Deployment

### Deploy to Vercel

**⚠️ IMPORTANT**: If you get a "No Output Directory" error, you need to configure the Framework Preset in Vercel. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete instructions.

**Quick Deploy**:

1. Push to GitHub
2. Import to Vercel
3. **Set Framework Preset to "Next.js"** in project settings
4. Deploy

**Via Vercel CLI**:
```bash
vercel --force
# Set Framework Preset to Next.js when prompted
```

### Environment Variables

**None required!** This demo works out of the box with no configuration.

## How It Works

### Data Model

All data is stored in browser localStorage under key `haya-demo-store`:

```typescript
{
  instructors: [...],
  weeklyRules: {
    instructorId: {
      dayOfWeek: [{ start: "09:00", end: "13:00" }]
    }
  },
  overrides: {
    instructorId: {
      "YYYY-MM-DD": {
        available: boolean,
        slots?: [{ start, end }]
      }
    }
  },
  leaves: {
    instructorId: [
      { startDate, endDate, reason }
    ]
  }
}
```

### Availability Logic

For any given date + instructor:

1. **Check Leave**: If on leave → "On Leave"
2. **Check Override**: If override exists → use override
3. **Check Weekly Rule**: Use recurring weekly schedule
4. **Default**: "Not Available"

### Demo Instructors

10 pre-configured instructors with varied specializations:
- Yoga, Strength, Gym, Meditation, Cardio
- Pilates, Zumba, Mobility, CrossFit, Breathwork

Each has realistic weekly schedules including:
- Mon-Fri morning/evening shifts
- Weekend-only schedules
- Split shifts
- Full week availability

### PNG Snapshot

The `/api/snapshot` endpoint uses `@vercel/og` to generate high-quality PNG images:
- **Size**: 1080 x 1350 (optimized for social media)
- **Runtime**: Edge (Vercel-compatible)
- **Format**: Clean table layout with studio branding

## Routes

- `/` - Redirects to login
- `/login` - Demo authentication
- `/manager` - Manager dashboard (view all availability)
- `/instructor` - Instructor portal (manage schedules)
- `/api/snapshot` - PNG generation endpoint

## File Structure

```
├── app/
│   ├── api/
│   │   └── snapshot/
│   │       └── route.ts          # PNG generation (edge runtime)
│   ├── instructor/
│   │   └── page.tsx              # Instructor portal
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── manager/
│   │   └── page.tsx              # Manager dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home (redirects)
├── lib/
│   ├── availability.ts           # Availability calculation logic
│   ├── demoData.ts               # Demo instructors & data structure
│   └── demoStore.ts              # localStorage management
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Usage Guide

### Manager Workflow

1. Login as Manager
2. Select a date
3. View all instructor availability
4. Click "Download PNG" to export snapshot
5. Share the PNG with staff or clients

### Instructor Workflow

1. Login as Instructor
2. Manage weekly availability:
   - Select day of week
   - Add time slots
   - Remove slots
3. Add leaves:
   - Set date range
   - Provide reason
4. Preview next 7 days

## Data Seed

On first load, the app auto-seeds with:
- 10 instructors with varied schedules
- 3 leave blocks
- 3 availability overrides

This ensures the demo looks realistic immediately.

## Reset Demo Data

Clear your browser's localStorage to reset all data:
```javascript
localStorage.clear()
```

## Notes

- **Demo Only**: Not for production use
- **No Persistence**: Data is lost on localStorage clear
- **No Authentication**: Demo login for UI flow only
- **No Server**: 100% client-side except PNG generation
- **Edge Compatible**: PNG route works on Vercel Edge Runtime

## Showcase

This demo highlights:
- Clean, professional UI
- Complex business logic (availability rules)
- Edge-compatible image generation
- Modern Next.js 14 patterns
- Zero external dependencies for core features

Perfect for demonstrating scheduling system capabilities to clients in under 2 minutes.

## License

Demo application - Free to use and modify.
