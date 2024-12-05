import {jwt} from "hono/jwt";
import {Context, Next} from "hono";

const jwtMiddleware = (ctx:Context<{Bindings: CloudflareBindings}>, next: Next) => {
    const jwtMiddleware = jwt({
        secret: ctx.env.ENCRYPTION_KEY,
    })
    return jwtMiddleware(ctx, next)
}

export { jwtMiddleware }