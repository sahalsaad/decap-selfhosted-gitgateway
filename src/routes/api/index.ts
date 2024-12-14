import { Hono } from "hono";
import { Variables } from "@selfTypes/variables";
import { sitesRoute } from "./sites";
import { usersRoute } from "./users";
import { adminAuthRoute } from "./auth";
import { registerRoute } from "@server/routes/api/register";

const apiRoute = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

apiRoute.route("/sites", sitesRoute);
apiRoute.route("/users", usersRoute);
apiRoute.route("/auth", adminAuthRoute);
apiRoute.route("/register", registerRoute);

export { apiRoute };
