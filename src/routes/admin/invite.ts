import { Hono } from "hono";
import { InviteService } from "../../services/invite-service";
import { UserService } from "../../services/user-service";
import { zValidator } from "@hono/zod-validator";
import { createInviteSchema } from "../../../types/invite";

const inviteRoute = new Hono<{ Bindings: CloudflareBindings }>();

inviteRoute.post("/", zValidator("json", createInviteSchema), async (ctx) => {
  const inviteRequest = ctx.req.valid("json");

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const user = await userService.getUserByEmail(inviteRequest.email);
  if (user) {
    await userService.addUserSite(user.id, inviteRequest.siteId);
    return ctx.json(null, 204);
  }

  const inviteService = InviteService(ctx.env.DB);
  const [result] = await inviteService.createInvite(inviteRequest);

  return ctx.json(result, 201);
});

export { inviteRoute };
