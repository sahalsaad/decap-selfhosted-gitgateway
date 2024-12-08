import { Hono } from "hono";
import { auth } from "./routes/gitgateway/auth";
import { cors } from "hono/cors";
import { settings } from "./routes/gitgateway/settings";
import { github } from "./routes/gitgateway/github";
import { sitesApi } from "./routes/admin/sites";
import { usersApi } from "./routes/admin/users";
import { inviteApi } from "./routes/admin/invite";
import { authApi } from "./routes/admin/auth";
import { jwtMiddleware } from "./middlewares/jwt";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.text("Hello!");
});

app.use("*", cors());

// git gateway endpoints
app.route("/:siteId/auth", auth);
app.route("/:siteId/settings", settings);
app.route("/:siteId/github", github);

// admin endpoints
app.use("/api/admin/*", jwtMiddleware);
app.route("/api/admin/sites", sitesApi);
app.route("/api/admin/users", usersApi);
app.route("/api/admin/invite", inviteApi);
app.route("/api/admin/auth", authApi);

// public endpoints

export default app;
