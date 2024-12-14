import { Hono } from "hono";
import { InviteService } from "@services/invite-service";
import { UserService } from "@services/user-service";
import { SiteService } from "@services/site-service";

const registerRoute = new Hono<{ Bindings: CloudflareBindings }>();

registerRoute.post("/", async (ctx) => {
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

export { registerRoute };
