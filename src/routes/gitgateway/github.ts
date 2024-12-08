import { Hono } from "hono";
import { decrypt } from "../../services/encryption-service";
import { jwtMiddleware } from "../../middlewares/jwt";
import { Variables } from "../../../types/variables";

const github = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

github.use("/:path{.+}", jwtMiddleware);
github.all("/:path{.+}", async (ctx) => {
  const jwtPayload = ctx.get("jwtPayload");

  const gitToken = decrypt(jwtPayload.git.token, ctx.env.AUTH_SECRET_KEY);
  const req = new Request(ctx.req.raw);
  req.headers.set("authorization", `Bearer ${gitToken}`);
  ctx.req.raw = req;

  return await fetch(
    `https://api.${jwtPayload.git.host ?? "github.com"}/repos/${jwtPayload.git.repo}/${ctx.req.param("path")}`,
    {
      method: ctx.req.method,
      headers: ctx.req.raw.headers,
      body: ctx.req.raw.body,
    },
  );
});

export { github };
