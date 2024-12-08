import { Hono } from "hono";
import { jwtMiddleware } from "../../middlewares/jwt";
import { Variables } from "../../../types/variables";

const settingsRoute = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

settingsRoute.use("/", jwtMiddleware);
settingsRoute.get("/", async (ctx) => {
  const jwtPayload = ctx.get("jwtPayload");
  const settings = {
    github_enabled: jwtPayload.git.provider === "github",
    gitlab_enabled: jwtPayload.git.provider === "gitlab",
    bitbucket_enabled: jwtPayload.git.provider === "bitbucket",
    roles: null,
  };

  return ctx.json(settings);
});

export { settingsRoute };
