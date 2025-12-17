# Zestfully

**Start here, every day** - Your daily life hub for building better habits and staying organized.

## Overview

Zestfully is a modern web application designed to be your central place for managing daily habits and routines. Currently focused on habit tracking, with meal planning and recipe management features coming soon.

## Features

### Current
- **Habit Tracking** - Visual year-long calendar grid to track daily habits
- **Progress Visualization** - See your streaks and completion patterns at a glance
- **Quick Actions** - Easy "Today" and "Yesterday" tracking buttons
- **Optimistic Updates** - Instant UI feedback for a smooth user experience

### Coming Soon
- Recipe Collection
- Meal Planner
- Shopping List Generation

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase
- **Styling**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **Linting & Formatting**: Biome

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (for authentication)

### Installation

1. Clone the repository
```bash
git clone https://github.com/ahofmeister/zestfully.git
cd zestfully
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations
```bash
npx drizzle-kit migrate
```

5. Start the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure
```
zestfully/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── habit/            # Habit tracking components
│   └── ui/               # shadcn/ui components
├── drizzle/              # Database schema and migrations
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database management with [Drizzle ORM](https://orm.drizzle.team/)