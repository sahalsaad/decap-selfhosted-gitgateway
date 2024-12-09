import { z } from "zod";
import { insertInviteSchema } from "../src/db/invite";

const createInviteSchema = insertInviteSchema.omit({ id: true, siteId: true });

type InviteCreateRequest = z.infer<typeof createInviteSchema>;

export { InviteCreateRequest, createInviteSchema };
