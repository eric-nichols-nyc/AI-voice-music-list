# Neon Auth - Next.js Application with Neon Database

A Next.js 16 application demonstrating authentication with Neon database integration.

## Features

- **Neon Database Integration** - Serverless PostgreSQL via `@repo/prisma-neon`
- **Prisma ORM** - Type-safe database access via `@repo/database` package
- **Theme Support** - Light/dark mode with `@repo/design-system`
- **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## Project Structure

```
apps/neon-auth/
├── app/
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Home page
│   └── styles.css            # Global styles
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Neon database connection string

### Installation

1. Install dependencies from the monorepo root:
   ```bash
   pnpm install
   ```

2. Set up environment variables (if needed):
   ```bash
   # Configure in packages/prisma-neon or packages/database
   ```

3. Run the development server:
   ```bash
   cd apps/neon-auth
   pnpm dev
   ```

4. Open [http://localhost:3010](http://localhost:3010)

## Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## Related Packages

- `@repo/design-system` - Shared UI components
- `@repo/database` - Prisma database client
- `@repo/prisma-neon` - Neon database adapter
- `@repo/typescript-config` - TypeScript configuration

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

