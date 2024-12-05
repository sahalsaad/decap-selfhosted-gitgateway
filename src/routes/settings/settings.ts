import {Hono} from "hono";
import {JWTPayload} from "hono/utils/jwt/types";
import {jwtMiddleware} from "../middlewares/jwt";

const settings = new Hono<{ Bindings: CloudflareBindings }>();

settings.use('/', jwtMiddleware)
settings.get('/', async (ctx) => {
    const jwtPayload = ctx.get('jwtPayload') as JWTPayload;
    const settings = {
        "github_enabled": jwtPayload.gitProvider === 'github',
        "gitlab_enabled": jwtPayload.gitProvider === 'gitlab',
        "bitbucket_enabled": jwtPayload.gitProvider === 'bitbucket',
        "roles": null
    };

    return ctx.json(settings)
})

export { settings }