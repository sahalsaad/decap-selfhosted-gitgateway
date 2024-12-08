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

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.text("Hello!");
});

app.use("*", cors());

// git gateway endpoints
app.route("/:siteId/auth", gitGatewayAuthRoute);
app.route("/:siteId/settings", settingsRoute);
app.route("/:siteId/github", githubRoute);

// admin endpoints
app.use("/api/admin/*", jwtMiddleware);
app.route("/api/admin/sites", sitesRoute);
app.route("/api/admin/users", usersRoute);
app.route("/api/admin/invite", inviteRoute);
app.route("/api/admin/auth", adminAuthRoute);

// public endpoints

export default app;
