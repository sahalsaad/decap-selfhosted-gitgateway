import {drizzle} from "drizzle-orm/d1";
import {Hono} from "hono";
import {sites} from "../../db/sites";
import {eq} from "drizzle-orm";

const sitesApi = new Hono<{ Bindings: CloudflareBindings }>();

sitesApi.post('/', async ctx => {
    const {url, githubToken} = await ctx.req.json();
    const db = drizzle(ctx.env.DB);
    const [{id}] = await db.insert(sites).values({url, githubToken}).returning();
    return ctx.json({id, url}, 201);
})

sitesApi.put('/:siteId', async ctx => {
    let {githubToken} = await ctx.req.json();
    const siteId = ctx.req.param('siteId');

    const db = drizzle(ctx.env.DB);
    const existingSite = await db.select().from(sites).where(eq(sites.id, Number(siteId))).get();
    if (!existingSite) {
        return ctx.notFound();
    }

    githubToken = githubToken || existingSite.githubToken;
    const result = await db.update(sites).set({githubToken}).where(eq(sites.id, Number(siteId))).returning();

    return ctx.json(result);
})

sitesApi.delete('/:siteId', async ctx => {
    const siteId = ctx.req.param('siteId');
    const db = drizzle(ctx.env.DB);
    const result = await db.delete(sites).where(eq(sites.id, Number(siteId)));

    if (result.success) {
        return ctx.status(204);
    }

    return ctx.notFound();
})

sitesApi.get('/:siteId', async ctx => {
    const siteId = ctx.req.param('siteId');
    const db = drizzle(ctx.env.DB);
    const result = await db.select().from(sites).where(eq(sites.id, Number(siteId))).get();

    if (!result) {
        return ctx.notFound();
    }

    return ctx.json(result);
})

sitesApi.get('/', async ctx => {
    const db = drizzle(ctx.env.DB);
    const siteList = await db.select().from(sites).all();

    return ctx.json(siteList);
})

export {sitesApi}