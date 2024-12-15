import { Hono } from "hono";
import { InviteService } from "@services/invite-service";
import { UserService } from "@services/user-service";
import { SiteService } from "@services/site-service";
import { zValidator } from "@hono/zod-validator";
import { handleInviteSchema } from "@selfTypes/invite";

const registerRoute = new Hono<{ Bindings: CloudflareBindings }>();

registerRoute.post("/", zValidator("json", handleInviteSchema), async (ctx) => {
  const createUserRequest = ctx.req.valid("json");

  const inviteService = InviteService(ctx.env.DB);
  const invite = await inviteService.getInviteById(createUserRequest.inviteId);

  if (!invite) {
    return ctx.json(null, 400);
  }

  const email = invite.allowSetEmail ? createUserRequest.email : invite.email;

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const [createdUser] = await userService.createUser({
    email,
    firstName: createUserRequest.firstName,
    lastName: createUserRequest.lastName,
    password: createUserRequest.password,
    role: invite.role,
  });

  await inviteService.deleteInvite(invite.id);

  let successMessage = [<div>Register successful.</div>];

  if (invite.siteId) {
    await userService.addUserSite(createdUser.id, invite.siteId);
    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
    const site = await siteService.getSiteById(invite.siteId);
    successMessage.push(
      <a className="text-blue-500" href={site!.url}>
        Go to CMS
      </a>,
    );
  }

  return ctx.render(<div className="text-center">{successMessage}</div>);
});

export { registerRoute };
