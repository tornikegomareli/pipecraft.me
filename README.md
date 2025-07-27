# Tornike Gomareli's Blog

A minimalist static blog generator built with TypeScript and Bun.

## Setup

1. Install Bun: https://bun.sh/
2. Install dependencies: `bun install`
3. Build the site: `bun run build`

The generated site will be in the `dist/` directory.

## Development

- `bun run dev` - Build with watch mode
- `bun run format` - Format code with Biome
- `bun run lint` - Lint code with Biome
- `bun run validate` - Run all checks

## Structure

- `posts/` - Markdown blog posts
- `src/` - TypeScript source code
- `dist/` - Generated static site