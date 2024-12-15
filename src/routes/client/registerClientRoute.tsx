import { Hono } from "hono";
import { renderer } from "@server/middlewares/renderer";
import { RegisterForm } from "@client/components/registerForm";
import { InviteService } from "@services/invite-service";
import { GeneralMessage } from "@client/components/GeneralMessage";

const registerClientRoute = new Hono<{ Bindings: CloudflareBindings }>();

registerClientRoute.use("*", renderer);
registerClientRoute.get("/", async (ctx) => {
  const siteData = {
    title: "Register",
    description: "Register for a new account",
  };
  const inviteId = ctx.req.query("invite");
  if (!inviteId) {
    return ctx.render(
      <GeneralMessage
        title="Invalid invite"
        message="Please contact the admin to get a new invite."
        siteData={siteData}
      />,
    );
  }

  const inviteService = InviteService(ctx.env.DB);
  const invite = await inviteService.getInviteById(inviteId);
  if (!invite) {
    return ctx.render(
      <GeneralMessage
        title="Invalid invite"
        message="Please contact the admin to get a new invite."
        siteData={siteData}
      />,
    );
  }

  const props = {
    email: invite.email,
    enableEmail: invite.allowSetEmail,
    inviteId,
    siteData,
  };
  return ctx.render(<RegisterForm {...props} />);
});

export { registerClientRoute };
