import { Hono } from "hono";
import { gitGatewayAuthRoute } from "./routes/gitgateway/auth";
import { cors } from "hono/cors";
import { settingsRoute } from "./routes/gitgateway/settings";
import { githubRoute } from "./routes/gitgateway/github";
import { logger } from "hono/logger";
import { register } from "./routes/client/register";
import { apiRoute } from "./routes/api";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.text("Hello!");
});

app.use("*", cors());
app.use("*", logger());

// git gateway endpoints
app.route("/:siteId/auth", gitGatewayAuthRoute);
app.route("/:siteId/settings", settingsRoute);
app.route("/:siteId/github", githubRoute);

app.route("/register", register);

// admin endpoints
const api = app.basePath("/api");
api.route("/api", apiRoute);

// public endpoints

export default app;
