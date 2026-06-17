import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    ssr: {
      external: (id: string) => id === "stripe" || id.startsWith("stripe/"),
    },
    build: {
      rollupOptions: {
        external: (id: string) => id === "stripe" || id.startsWith("stripe/"),
      },
    },
  },
});