import { drizzle } from "drizzle-orm/d1";
import {Hono} from "hono";
import {users} from "../../db/users";
import {eq} from "drizzle-orm";

const usersApi = new Hono<{ Bindings: CloudflareBindings }>();

usersApi.post('/', async ctx => {
    const {firstName, lastName, email, password, role} = await ctx.req.json();
    // TODO: add validation

    const db = drizzle(ctx.env.DB);
    const result = await db.insert(users).values({firstName, lastName, email, password, role}).returning();
    return ctx.json(result);
})

usersApi.put('/:userId', async ctx => {
    let {firstName, lastName, password} = await ctx.req.json();
    const userId= ctx.req.param('userId');

    const db = drizzle(ctx.env.DB);
    const existingUser = await db.select().from(users).where(eq(users.id, Number(userId))).get();
    if (!existingUser) {
        return ctx.notFound();
    }

    firstName = firstName || existingUser.firstName;
    lastName = lastName || existingUser.lastName;
    password = password || existingUser.password;
    const result = await db.update(users).set({firstName, lastName, password}).where(eq(users.id, Number(userId))).returning();

    return ctx.json(result);
})

usersApi.delete('/:userId', async ctx => {
    const userId= ctx.req.param('userId');
    const db = drizzle(ctx.env.DB);
    const result = await db.delete(users).where(eq(users.id, Number(userId)));

    if (result.success) {
        return ctx.status(204);
    }

    return ctx.notFound();
})

usersApi.get('/:userId', async ctx => {
    const userId= ctx.req.param('userId');
    const db = drizzle(ctx.env.DB);
    const result = await db.select().from(users).where(eq(users.id, Number(userId))).get();

    if (!result) {
        return ctx.notFound();
    }

    return ctx.json(result);
})

usersApi.get('/', async ctx => {
    const db = drizzle(ctx.env.DB);
    const userList = await db.select().from(users).all();

    return ctx.json(userList);
})

export { usersApi }