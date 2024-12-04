import {drizzle} from "drizzle-orm/d1";
import {Hono} from "hono";
import {sites} from "../../db/sites";
import {eq} from "drizzle-orm";
import {encrypt} from "../../helpers/encryption";
import {randomUUID} from "node:crypto";

const sitesApi = new Hono<{ Bindings: CloudflareBindings }>();

sitesApi.post('/', async ctx => {
    const {url, gitToken, gitRepo} = await ctx.req.json();
    const db = drizzle(ctx.env.DB);
    const encryptedToken = encrypt(gitToken, ctx.env.ENCRYPTION_KEY!);
    const [{id}] = await db.insert(sites).values({
        id: randomUUID(),
        url,
        gitRepo,
        gitToken: encryptedToken.encryptedSecret,
        tokenNonce: encryptedToken.nonce
    }).returning();
    return ctx.json({id, url, gitRepo}, 201);
})

sitesApi.put('/:siteId', async ctx => {
    let {gitToken, gitRepo} = await ctx.req.json();
    const siteId = ctx.req.param('siteId');

    const db = drizzle(ctx.env.DB);
    const existingSite = await db.select().from(sites).where(eq(sites.id, siteId)).get();
    if (!existingSite) {
        return ctx.notFound();
    }

    let updateSite = {}
    if (gitToken) {
        const encryptedToken = encrypt(gitToken, ctx.env.ENCRYPTION_KEY!);
        updateSite = {gitToken: encryptedToken.encryptedSecret, tokenNonce: encryptedToken.nonce}
    }

    if (gitRepo) {
        updateSite = {...updateSite, gitRepo}
    }

    await db.update(sites).set(updateSite).where(eq(sites.id, siteId));

    return ctx.body(null, 204);
})

sitesApi.delete('/:siteId', async ctx => {
    const siteId = ctx.req.param('siteId');
    const db = drizzle(ctx.env.DB);
    const result = await db.delete(sites).where(eq(sites.id, siteId));

    if (result.success) {
        return ctx.body(null, 204);
    }

    return ctx.notFound();
})

sitesApi.get('/:siteId', async ctx => {
    const siteId = ctx.req.param('siteId');
    const db = drizzle(ctx.env.DB);
    const result = await db.select().from(sites).where(eq(sites.id, siteId)).get();

    if (!result) {
        return ctx.notFound();
    }

    return ctx.json({
        id: result.id,
        url: result.url,
        gitRepo: result.gitRepo
    });
})

sitesApi.get('/', async ctx => {
    const db = drizzle(ctx.env.DB);
    const siteList = await db.select().from(sites).all();

    return ctx.json(siteList.map(site => ({
        id: site.id,
        url: site.url
    })));
})

export {sitesApi}