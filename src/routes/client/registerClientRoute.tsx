import { Hono } from "hono";
import { renderer } from "@server/middlewares/renderer";
import { RegisterForm } from "@client/components/registerForm";
import { InviteService } from "@services/invite-service";

const registerClientRoute = new Hono<{ Bindings: CloudflareBindings }>();

registerClientRoute.use("*", renderer);
registerClientRoute.get("/", async (ctx) => {
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

export { registerClientRoute };
