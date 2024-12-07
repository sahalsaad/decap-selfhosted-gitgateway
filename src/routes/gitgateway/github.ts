import {Hono} from "hono";
import {decrypt} from "../../services/encryption-service";
import {jwtMiddleware} from "../middlewares/jwt";
import {JWTPayload} from "hono/utils/jwt/types";

const github = new Hono<{ Bindings: CloudflareBindings, Variables: JWTPayload }>();

github.use('/:path{.+}', jwtMiddleware)
github.all('/:path{.+}', async ctx => {
    const referer = ctx.req.raw.headers.get('referer');
    const jwtPayload = ctx.get('jwtPayload') as JWTPayload;

    const gitToken = decrypt(jwtPayload.gitToken as string, ctx.env.AUTH_SECRET_KEY)
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