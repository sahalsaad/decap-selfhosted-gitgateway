import { Hono } from "hono";
import { renderer } from "../../middlewares/renderer";
import { RegisterForm } from "../../client/components/registerForm";
import { InviteService } from "../../services/invite-service";
import { UserService } from "../../services/user-service";
import { SiteService } from "../../services/site-service";

const register = new Hono<{ Bindings: CloudflareBindings }>();

register;

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
