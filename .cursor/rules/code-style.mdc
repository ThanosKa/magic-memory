# Code Style Rules for Cursor

## TypeScript

- Use strict TypeScript (`"strict": true` in tsconfig)
- Prefer `type` over `interface` for object types
- Use Zod schemas for runtime validation, then infer types: `type User = z.infer<typeof UserSchema>`
- Never use `any` - use `unknown` and type guards instead
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## React

- Server Components by default
- Add `"use client"` only when using hooks, browser APIs, or event handlers
- Prefer named exports: `export function Component()` not `export default`
- Use `cn()` from `lib/utils` for conditional class names
- Destructure props in function signature

## Imports

Order imports:
1. React/Next.js
2. Third-party libraries
3. Internal components (`@/components/`)
4. Internal utilities (`@/lib/`)
5. Types

Example:
\`\`\`typescript
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"
import type { User } from "@/lib/validations"
\`\`\`

## File Structure

\`\`\`
component-name/
├── index.ts          # Re-exports
├── component.tsx     # Main component
├── component.test.ts # Tests
└── types.ts          # Types (if complex)
\`\`\`

For simple components, single file is fine:
\`\`\`
components/ui/button.tsx
\`\`\`

## Naming

- Components: `PascalCase` (e.g., `RestoreUploader`)
- Files: `kebab-case` (e.g., `restore-uploader.tsx`)
- Functions: `camelCase` (e.g., `handleSubmit`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`)
- Types: `PascalCase` (e.g., `UserProfile`)

## Comments

- Use JSDoc for exported functions
- Inline comments for complex logic only
- TODO format: `// TODO(username): description`
