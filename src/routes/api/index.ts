import { Hono } from "hono";
import { Variables } from "../../../types/variables";
import { sitesRoute } from "./admin/sites";
import { usersRoute } from "./admin/users";
import { adminAuthRoute } from "./admin/auth";

const apiRoute = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

const admin = apiRoute.basePath("/admin");
admin.route("/sites", sitesRoute);
admin.route("/users", usersRoute);
admin.route("/auth", adminAuthRoute);

export { apiRoute };
