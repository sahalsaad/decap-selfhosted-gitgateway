import { Hono } from "hono";
import { Variables } from "../../../types/variables";
import { UserService } from "../../services/user-service";
import { InviteService } from "../../services/invite-service";
import { SiteService } from "../../services/site-service";
import { jwtMiddleware } from "../../middlewares/jwt";
import { sitesRoute } from "./admin/sites";
import { usersRoute } from "./admin/users";
import { adminAuthRoute } from "./admin/auth";
import { registerRoute } from "./register";

const apiRoute = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

const admin = apiRoute.basePath("/admin");
admin.use("/*", jwtMiddleware);
admin.route("/sites", sitesRoute);
admin.route("/users", usersRoute);
admin.route("/auth", adminAuthRoute);

apiRoute.route("/register", registerRoute);

export { apiRoute };
