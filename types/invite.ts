import { z } from "zod";
import { insertInviteSchema } from "@db/invite";
import { createUserSchema } from "@selfTypes/user";

const createInviteSchema = insertInviteSchema.omit({ id: true, siteId: true });

type InviteCreateRequest = z.infer<typeof createInviteSchema>;

const handleInviteSchema = createUserSchema
  .omit({ role: true })
  .extend({ inviteId: z.string() });

export { InviteCreateRequest, createInviteSchema, handleInviteSchema };
