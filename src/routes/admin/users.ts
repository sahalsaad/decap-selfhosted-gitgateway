import {drizzle} from "drizzle-orm/d1";
import {Hono} from "hono";
import {users} from "../../db/users";
import {eq} from "drizzle-orm";
import {usersToSites} from "../../db/users-sites";
import {sites} from "../../db/sites";
import {randomUUID} from "node:crypto";
import {hashPassword} from "../../helpers/encryption";

const usersApi = new Hono<{ Bindings: CloudflareBindings }>();

usersApi.post('/', async ctx => {
    const {firstName, lastName, email, password, role} = await ctx.req.json();
    // TODO: add validation

    const db = drizzle(ctx.env.DB);
    const hashedPassword = hashPassword(password, ctx.env.ENCRYPTION_KEY);
    const result = await db.insert(users).values({
        id: randomUUID(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
    }).returning();
    return ctx.json(result);
})

usersApi.put('/:userId', async ctx => {
    let {firstName, lastName, password} = await ctx.req.json();
    const userId = ctx.req.param('userId');

    const db = drizzle(ctx.env.DB);
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).get();
    if (!existingUser) {
        return ctx.notFound();
    }

    firstName = firstName || existingUser.firstName;
    lastName = lastName || existingUser.lastName;
    password = password || existingUser.password;
    const result = await db.update(users).set({
        firstName, lastName, password
    }).where(eq(users.id, userId)).returning();

    return ctx.json(result);
})

usersApi.delete('/:userId', async ctx => {
    const userId = ctx.req.param('userId');
    const db = drizzle(ctx.env.DB);
    const result = await db.delete(users).where(eq(users.id, userId));

    if (result.success) {
        return ctx.body(null, 204);
    }

    return ctx.notFound();
})

usersApi.get('/:userId', async ctx => {
    const userId = ctx.req.param('userId');
    const db = drizzle(ctx.env.DB);
    const rows = await db
        .select({
            users: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                role: users.role,
            },
            sites: {
                id: sites.id,
                url: sites.url,
                gitRepo: sites.gitRepo,
            }
        })
        .from(users)
        .leftJoin(usersToSites, eq(usersToSites.userId, users.id))
        .leftJoin(sites, eq(usersToSites.siteId, sites.id))
        .where(eq(users.id, userId)).all();

    const result = rows.reduce<Record<string, UserResponse>>(
        (acc, row) => {
            const user = row.users!;
            const site = row.sites;
            if (!acc[user.id]) {
                acc[user.id] = {...user, sites: []};
            }
            if (site) {
                acc[user.id].sites.push(site);
            }
            return acc;
        },
        {}
    );

    const firstResult = result[userId];

    if (!firstResult) {
        return ctx.notFound();
    }

    return ctx.json(firstResult);
})

usersApi.get('/', async ctx => {
    const db = drizzle(ctx.env.DB);
    const userList = await db.select().from(users).all();

    return ctx.json(userList);
})

usersApi.put('/:userId/sites', async ctx => {
    const {siteId} = await ctx.req.json();
    const userId = ctx.req.param('userId');

    const db = drizzle(ctx.env.DB);
    await db.insert(usersToSites).values({siteId: siteId, userId: userId}).returning();

    return ctx.body(null, 204);
})

export {usersApi}