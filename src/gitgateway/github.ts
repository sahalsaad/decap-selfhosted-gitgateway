import {Hono} from "hono";

const github = new Hono<{ Bindings: CloudflareBindings }>();

github.all('*', async ctx => {
    return ctx.json({});
})

export { github }