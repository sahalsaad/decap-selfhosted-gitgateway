import { z } from "zod";
import { insertUsersSchema } from "../src/db/users";

const createUserSchema = insertUsersSchema.omit({ id: true });

type UserCreateRequest = z.infer<typeof createUserSchema>;

const updateUserSchema = createUserSchema.partial();

type UserUpdateRequest = z.infer<typeof updateUserSchema>;

export {
  UserCreateRequest,
  createUserSchema,
  UserUpdateRequest,
  updateUserSchema,
};
