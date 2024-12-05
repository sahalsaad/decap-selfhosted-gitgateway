import {Hono} from "hono";
import {drizzle} from "drizzle-orm/d1";
import {sites} from "../../db/sites";
import {eq} from "drizzle-orm";
import {decrypt} from "../../helpers/encryption";
import {jwtMiddleware} from "../middlewares/jwt";

const github = new Hono<{ Bindings: CloudflareBindings }>();

github.use('/:path{.+}', jwtMiddleware)
github.all('/:path{.+}', async ctx => {
    const siteId = ctx.req.param('siteId')!;

    const cache = caches.default;
    const url = new URL(ctx.req.url);
    const cacheKey = `${url.origin}/:${siteId}`

    let site: {gitToken: string, tokenNonce: string};
    const cachedSite = await cache.match(cacheKey);
    if (!cachedSite) {
        const db = drizzle(ctx.env.DB)
        const dbSite = await db.select().from(sites).where(eq(sites.id, siteId)).get()
        if (!dbSite) {
            return ctx.body("Cannot find site", 400)
        }
        const {gitToken, tokenNonce} = dbSite;
        site = {gitToken, tokenNonce};
        const cacheResponse = new Response(JSON.stringify(site));
        cacheResponse.headers.set('Cache-Control', 'max-age=600');
        await cache.put(cacheKey, cacheResponse);
    } else {
        site = await cachedSite.json()
    }

    const gitToken = decrypt(site.gitToken, site.tokenNonce, ctx.env.ENCRYPTION_KEY)
    const req = new Request(ctx.req.raw)
    req.headers.set('authorization', `Bearer ${gitToken}`);
    ctx.req.raw = req;

    return await fetch('https://api.github.com/repos/sahalsaad/08photo/' + ctx.req.param('path'), {
        method: ctx.req.method,
        headers: ctx.req.raw.headers,
        body: ctx.req.raw.body,
    });
})

export { github }