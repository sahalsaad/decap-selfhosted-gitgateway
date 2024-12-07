import { Hono } from "hono";
import { auth } from "./routes/auth/auth";
import { cors } from "hono/cors";
import { settings } from "./routes/settings/settings";
import { github } from "./routes/gitgateway/github";
import { sitesApi } from "./routes/admin/sites";
import { usersApi } from "./routes/admin/users";
import { inviteApi } from "./routes/admin/invite";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.text("Hello!");
});

app.use("*", cors());

app.route("/:siteId/auth", auth);
app.route("/:siteId/settings", settings);
app.route("/:siteId/github", github);
app.route("/api/admin/sites", sitesApi);
app.route("/api/admin/users", usersApi);
app.route("/api/admin/invite", inviteApi);

export default app;
