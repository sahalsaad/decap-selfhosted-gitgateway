import { Hono } from "hono";
import { hashPassword } from "../../services/encryption-service";
import { sign } from "hono/jwt";
import { jwtMiddleware } from "../../middlewares/jwt";
import { UserService } from "../../services/user-service";
import { timingSafeEqual } from "hono/utils/buffer";
import { JwtPayload } from "../../types/jwt-payload";
import { Variables } from "../../types/variables";

const auth = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

auth.post("/token", async (ctx) => {
  const data = await ctx.req.formData();
  const username = data.get("username")?.toString();
  const password = data.get("password")?.toString();
  const siteId = ctx.req.param("siteId");

  if (!username || !password) {
    return ctx.body(null, 401);
  }

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const result = await userService.getUserByEmailAndSite(username, siteId!);

  const hashedPassword = hashPassword(password, ctx.env.AUTH_SECRET_KEY);

  if (
    !result ||
    !(await timingSafeEqual(result.user.password, hashedPassword))
  ) {
    return ctx.body(null, 401);
  }

  const tokenData: JwtPayload = {
    user: {
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      id: result.user.id,
    },
    git: {
      token: result.site.gitToken,
      provider: result.site.gitProvider,
      host: result.site.gitHost,
      repo: result.site.gitRepo,
    },
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  };

  const accessToken = await sign(tokenData, ctx.env.AUTH_SECRET_KEY!);
  const jwt = {
    token_type: "bearer",
    access_token: accessToken,
    expires_in: 43200000,
  };

  return ctx.json(jwt);
});

auth.use("/user", jwtMiddleware);
auth.get("/user", async (ctx) => {
  const payload = ctx.get("jwtPayload");
  const userdata = {
    email: payload.user.email,
    first_name: payload.user.firstName,
    last_name: payload.user.lastName,
    provider: payload.git.provider,
    user_metadata: {
      full_name: `${payload.user.firstName} ${payload.user.lastName}`,
    },
  };

  return ctx.json(userdata);
});

export { auth };
