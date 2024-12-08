import { Hono } from "hono";
import { UserService } from "../../services/user-service";

const usersRoute = new Hono<{ Bindings: CloudflareBindings }>();

usersRoute.post("/", async (ctx) => {
  const userRequest: UserRequest = await ctx.req.json();
  // TODO: add validation

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const [result] = await userService.create(userRequest);
  return ctx.json(result, 201);
});

usersRoute.put("/:userId", async (ctx) => {
  let userRequest: UserRequest = await ctx.req.json();
  // TODO: add validation

  const userId = ctx.req.param("userId");

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const isSuccess = await userService.updateUser(userId, userRequest);
  if (!isSuccess) {
    return ctx.notFound();
  }

  return ctx.body(null, 204);
});

usersRoute.delete("/:userId", async (ctx) => {
  const userId = ctx.req.param("userId");
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const isSuccess = await userService.deleteUser(userId);

  if (isSuccess) {
    return ctx.body(null, 204);
  }

  return ctx.notFound();
});

usersRoute.get("/:userId", async (ctx) => {
  const userId = ctx.req.param("userId");
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const user = await userService.getUserById(userId);

  if (!user) {
    return ctx.notFound();
  }

  return ctx.json(user);
});

usersRoute.get("/", async (ctx) => {
  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const userList = await userService.getAllUser();
  return ctx.json(userList);
});

usersRoute.put("/:userId/sites", async (ctx) => {
  const { siteId } = await ctx.req.json();
  const userId = ctx.req.param("userId");

  const userService = UserService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  await userService.addUserSite(userId, siteId);
  return ctx.body(null, 204);
});

export { usersRoute };
