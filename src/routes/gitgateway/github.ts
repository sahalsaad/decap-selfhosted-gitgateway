import {Hono} from "hono";

const github = new Hono<{ Bindings: CloudflareBindings }>();

github.all('/:path{.+}', async ctx => {
    const req = new Request(ctx.req.raw)
    // TODO: Set the pat token. Retrieve the token from jwt
    req.headers.set('authorization', `Bearer`);
    ctx.req.raw = req;

    return await fetch('https://api.github.com/repos/sahalsaad/08photo/' + ctx.req.param('path'), {
        method: ctx.req.method,
        headers: ctx.req.raw.headers,
        body: ctx.req.raw.body,
    });
})

export { github }