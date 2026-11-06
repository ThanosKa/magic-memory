# Coding Standards

The rules every diff in this repo is checked against, one per line. Writing code: every rule that touches the files you change holds before you finish. Reviewing: check the diff against every rule in turn.

## API routes

- Open every route with Clerk `auth()` and return 401 when `userId` is missing. Webhooks authenticate by signature instead; `/api/vitals` is the one anonymous route.
- Parse every input with a Zod schema (`safeParse`, or `parseRequestBody` from `lib/validations/utils.ts`) and return 400 on failure.
- Scope every query on user-owned rows by the `userId` from `auth()`, matched against `users.clerk_user_id`; the admin client bypasses row-level security, so this filter is the only protection.
- Return `{ success: true, data }` or `{ success: false, error }`. The one exception is `create-checkout`, which returns `{ success: true, url }` because `components/pricing/pricing-cards.tsx` reads `data.url`.
- Wrap the handler in try/catch and check `error` on every Supabase call.
- Log server-side through `logger` from `lib/logger.ts`, context first: `logger.error({ userId, error: message }, "Failed to deduct credit")`. Pass `error.message`, because a raw `Error` under the `error` key serialises to `{}`. Client components use `console.error`.
- Put writes that must land together in a SQL function called through `.rpc()`; the Supabase client has no transactions.

## TypeScript

- Type values of unknown shape as `unknown` and narrow them with a type guard, in place of `any`.
- Use `type` for object shapes in place of `interface`.
- Validate at runtime with Zod and derive the type: `type User = z.infer<typeof userSchema>`.
- Use `?.` and `??`; use `||` only where an empty string or 0 should also fall through.

## React

- Fetch client data with SWR (`useSWR("/api/credits", fetcher)`) and call `mutate("/api/credits")` after anything that changes the balance, since the header and the uploader share that key. Keep `useEffect` for browser side effects: timers, `localStorage`, toasts.
- Use named exports in `components/`; default exports are for Next route files (`page.tsx`, `layout.tsx`).
- Destructure props in the function signature.
- Build conditional classes with `cn()` from `lib/utils.ts`.

## UI

- Colour only through token classes from `app/globals.css` (`bg-ink`, `text-paper/60`, `border-border`, `ring-ember`). Light mode is a palette swap on `<html data-theme="light">`, so raw hex, `dark:` variants, `white`/`black` utilities and the retired purple accent all fail `__tests__/theme/theme-guard.test.ts`. A new palette token goes in both the dark and the light block.
- Style with Tailwind classes; keep `style` for values computed at runtime.
- Prefer CSS animations in `app/globals.css`, each switched to `animation: none` under `prefers-reduced-motion: reduce`. A component that imports Framer Motion calls `useReducedMotion()` or sets `<MotionConfig reducedMotion="user">`. `__tests__/theme/motion-guard.test.ts` enforces both.
- Match the home page (`app/page.tsx`, `components/home/`), the reference design: `font-serif` headlines, `font-mono` uppercase labels via `SectionLabel`, the pill `Button` for primary actions at its `default` or `lg` size (44px or taller).

## Naming and files

- Name files `kebab-case`, components and types `PascalCase`, functions `camelCase`, module-level constant values `SCREAMING_SNAKE_CASE`.
- Order imports: React/Next, third-party, `@/components`, `@/lib`, types.

## Comments

- Keep JSDoc for exported functions and inline comments for complex logic; let names carry the rest.
- Keep emojis out of code and comments.
