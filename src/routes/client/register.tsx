import { Hono } from "hono";
import { renderer } from "../../middlewares/renderer";
import { RegisterForm } from "../../client/components/registerForm";
import { InviteService } from "../../services/invite-service";
import { UserService } from "../../services/user-service";
import { SiteService } from "../../services/site-service";

const register = new Hono<{ Bindings: CloudflareBindings }>();

register.post("/handle-invite", async (ctx) => {
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
    return ctx.body(null, 204);
  }

  return ctx.json({}, 204);
});

register.use("*", renderer);
register.get("/", async (ctx) => {
  const inviteId = ctx.req.query("invite");
  if (!inviteId) {
    return ctx.body("Invalid invite", 400);
  }

  const inviteService = InviteService(ctx.env.DB);
  const invite = await inviteService.getInviteById(inviteId);
  if (!invite) {
    return ctx.body("Invalid invite", 400);
  }

  const props = {
    email: invite.email,
    enableEmail: invite.allowSetEmail,
    inviteId,
    siteData: {
      title: "Register",
      description: "Register for a new account",
    },
  };
  return ctx.render(<RegisterForm {...props} />);
});

export { register };
