import { Hono } from "hono";
import { InviteService } from "../../services/invite-service";
import { UserService } from "../../services/user-service";

const inviteApi = new Hono<{ Bindings: CloudflareBindings }>();

inviteApi.post("/", async (ctx) => {
  const { email, siteId, role } = await ctx.req.json();

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const user = await userService.getUserByEmail(email);
  if (user) {
    await userService.addUserSite(user.id, siteId);
    return ctx.json(null, 204);
  }

  const inviteService = InviteService(ctx.env.DB);
  const [result] = await inviteService.createInvite(email, siteId, role);

  return ctx.json(result, 201);
});

export { inviteApi };
