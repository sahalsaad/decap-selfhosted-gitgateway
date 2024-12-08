import { Hono } from "hono";
import { gitGatewayAuthRoute } from "./routes/gitgateway/auth";
import { cors } from "hono/cors";
import { settingsRoute } from "./routes/gitgateway/settings";
import { githubRoute } from "./routes/gitgateway/github";
import { sitesRoute } from "./routes/admin/sites";
import { usersRoute } from "./routes/admin/users";
import { inviteRoute } from "./routes/admin/invite";
import { adminAuthRoute } from "./routes/admin/auth";
import { jwtMiddleware } from "./middlewares/jwt";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";

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

// admin endpoints
const adminApi = app.basePath("/api/admin");
adminApi.use("/*", jwtMiddleware);
adminApi.route("/sites", sitesRoute);
adminApi.route("/users", usersRoute);
adminApi.route("/invite", inviteRoute);
adminApi.route("/auth", adminAuthRoute);

// public endpoints

export default app;

showRoutes(app, {
  verbose: true,
});
