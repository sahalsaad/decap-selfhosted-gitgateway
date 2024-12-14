import { Context, Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import { sign } from "hono/jwt";
import { UserService } from "../../services/user-service";
import { hashPassword } from "../../services/encryption-service";

const adminAuthRoute = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { user: { id: string; email: string; role: string } };
}>();

adminAuthRoute.use(
  "/",
  basicAuth({
    verifyUser: async (email: string, password: string, ctx: Context) => {
      console.log("here");
      const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return false;
      }

      const hashedPassword = hashPassword(password, ctx.env.AUTH_SECRET_KEY);
      if (
        (await timingSafeEqual(user.password, hashedPassword)) &&
        user.role === "admin"
      ) {
        ctx.set("user", {
          id: user.id,
          email: user.email,
          role: user.role,
        });
        return true;
      }

      return false;
    },
    invalidUserMessage: "Invalid username or password or not admin",
  }),
);
adminAuthRoute.get("/", async (ctx) => {
  const duration = 60 * 60 * 12;
  const user = ctx.get("user");
  const jwtPayload = {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    exp: Math.floor(Date.now() / 1000) + duration,
  };
  const accessToken = await sign(jwtPayload, ctx.env.AUTH_SECRET_KEY!);
  const jwt = {
    token_type: "bearer",
    access_token: accessToken,
    expires_in: duration * 1000,
  };

  return ctx.json(jwt);
});

export { adminAuthRoute };
