import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { updateUserSchema } from "../../../types/user";
import { UserService } from "../../services/user-service";
import { jwtMiddleware } from "../../middlewares/jwt";
import { InviteService } from "../../services/invite-service";
import { SiteService } from "../../services/site-service";

const usersRoute = new Hono<{ Bindings: CloudflareBindings }>();

usersRoute.use("/*", jwtMiddleware);
usersRoute.put(
  "/:userId",
  zValidator("json", updateUserSchema),
  async (ctx) => {
    const userRequest = ctx.req.valid("json");
    const userId = ctx.req.param("userId");

    const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
    const isSuccess = await userService.updateUser(userId, userRequest);
    if (!isSuccess) {
      return ctx.notFound();
    }

    return ctx.body(null, 204);
  },
);

usersRoute.delete("/:userId", async (ctx) => {
  const userId = ctx.req.param("userId");
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const isSuccess = await userService.deleteUser(userId);

  if (isSuccess) {
    return ctx.body(null, 204);
  }

  return ctx.notFound();
});

usersRoute.get("/:userId", async (ctx) => {
  const userId = ctx.req.param("userId");
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const user = await userService.getUserById(userId);

  if (!user) {
    return ctx.notFound();
  }

  return ctx.json(user);
});

usersRoute.get("/", async (ctx) => {
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const userList = await userService.getAllUser();
  return ctx.json(userList);
});

usersRoute.post("/handle-invite", async (ctx) => {
  const json = await ctx.req.json();

  const inviteService = InviteService(ctx.env.DB);
  const invite = await inviteService.getInviteById(json.inviteId);

  if (!invite) {
    return ctx.json(null, 400);
  }

  const email = invite.allowSetEmail ? json.email : invite.email;

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const [createdUser] = await userService.createUser({
    email,
    firstName: json.firstName,
    lastName: json.lastName,
    password: json.password,
    role: invite.role,
  });

  await inviteService.deleteInvite(invite.id);

  if (invite.siteId) {
    await userService.addUserSite(createdUser.id, invite.siteId);
    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
    const site = await siteService.getSiteById(invite.siteId);
    ctx.header("HX-Redirect", site!.sites.url);
  }

  return ctx.json({}, 204);
});

export { usersRoute };
