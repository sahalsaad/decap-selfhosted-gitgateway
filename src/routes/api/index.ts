import { Hono } from "hono";
import { Variables } from "../../../types/variables";
import { sitesRoute } from "./sites";
import { usersRoute } from "./users";
import { adminAuthRoute } from "./auth";

const apiRoute = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

apiRoute.route("/sites", sitesRoute);
apiRoute.route("/users", usersRoute);
apiRoute.route("/auth", adminAuthRoute);

export { apiRoute };
