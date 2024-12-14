import build from "@hono/vite-build/cloudflare-workers";
import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";
import * as path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      alias: {
        "@server": path.resolve(__dirname, "../src"),
        "@db": path.resolve(__dirname, "../src/db"),
        "@assets": path.resolve(__dirname, "../assets"),
        "@selfTypes": path.resolve(__dirname, "../types"),
        "@services": path.resolve(__dirname, "../src/services"),
        "@client": path.resolve(__dirname, "../src/client"),
      },
      build: {
        rollupOptions: {
          input: ["./src/client/bundle.ts", "./src/client/style.css"],
          output: {
            entryFileNames: "static/bundle.js",
            assetFileNames: "static/[name].[ext]",
          },
        },
        outDir: "./assets",
      },
    };
  }

  const entry = "./src/index.tsx";
  return {
    server: { port: 8787 },
    plugins: [
      tsconfigPaths(),
      devServer({ adapter: cloudflareAdapter, entry }),
      build({ entry }),
    ],
  };
});
