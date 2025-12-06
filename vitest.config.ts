import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "happy-dom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
        exclude: ["node_modules", ".next"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["lib/**/*.ts", "app/api/**/*.ts"],
            exclude: ["**/*.test.ts", "**/*.d.ts"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
})
