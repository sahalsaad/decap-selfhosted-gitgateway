import {jwt} from "hono/jwt";
import {Context, Next} from "hono";

const jwtMiddleware = (ctx:Context<{Bindings: CloudflareBindings}>, next: Next) => {
    const jwtMiddleware = jwt({
        secret: ctx.env.AUTH_SECRET_KEY,
    })
    return jwtMiddleware(ctx, next)
}

export { jwtMiddleware }