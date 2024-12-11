import { Hono } from "hono";
import { Variables } from "../../../types/variables";
import { UserService } from "../../services/user-service";
import { InviteService } from "../../services/invite-service";
import { SiteService } from "../../services/site-service";
import { sitesRoute } from "../admin/sites";
import { usersRoute } from "../admin/users";
import { adminAuthRoute } from "../admin/auth";

const apiRoute = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

const admin = apiRoute.basePath("/admin");
admin.route("/sites", sitesRoute);
admin.route("/users", usersRoute);
admin.route("/auth", adminAuthRoute);

apiRoute.post("/register", async (ctx) => {
  const json = await ctx.req.json();

  const inviteService = InviteService(ctx.env.DB);
  const invite = await inviteService.getInviteById(json.invite);

  if (!invite) {
    return ctx.json(null, 400);
  }

  const email = invite.allowSetEmail ? json.email : invite.email;

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const [createdUser] = await userService.create({
    email,
    firstName: json.firstName,
    lastName: json.lastName,
    password: json.password,
    role: invite.role,
  });

  if (invite.siteId) {
    await userService.addUserSite(createdUser.id, invite.siteId);
    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
    const site = await siteService.getSiteById(invite.siteId);
    return ctx.redirect(site!.sites.url);
  }

  return ctx.body("User created!", 204);
});

export { apiRoute };
