import {Hono} from "hono";
import {drizzle} from "drizzle-orm/d1";
import {users} from "../../db/users";
import {and, eq} from "drizzle-orm";
import {hashPassword} from "../../helpers/encryption";
import {usersToSites} from "../../db/users-sites";
import {sites} from "../../db/sites";
import {sign} from 'hono/jwt'
import {JWTPayload} from "hono/utils/jwt/types";
import {jwtMiddleware} from "../middlewares/jwt";

const auth = new Hono<{ Bindings: CloudflareBindings, Variables: JWTPayload}>();
const encoder = new TextEncoder();

auth.post('/:siteId/token', async (ctx) => {
    const data = await ctx.req.formData();
    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();
    const siteId = ctx.req.param('siteId');

    if (!username || !password) {
        return ctx.body(null, 401);
    }

    const db = drizzle(ctx.env.DB);
    const hashedPassword = hashPassword(password, ctx.env.ENCRYPTION_KEY);
    const user = await db.select()
        .from(users)
        .leftJoin(usersToSites, eq(usersToSites.userId, users.id))
        .leftJoin(sites, eq(sites.id, usersToSites.siteId))
        .where(and(eq(users.email, username), eq(users.password, hashedPassword), eq(usersToSites.siteId, siteId)))
        .get();

    if (!user) {
        return ctx.body(null, 401);
    }

    const tokenData: JWTPayload = {
        firstName: user.users.firstName,
        lastName: user.users.lastName,
        email: user.users.email,
        id: user.users.id,
        role: user.users.role,
        gitToken: user.sites!.gitToken,
        gitProvider: user.sites!.gitProvider,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
    }

    const accessToken = await sign(tokenData, ctx.env.ENCRYPTION_KEY!);
    const jwt = {
        "token_type": "bearer",
        "access_token": accessToken,
        "expires_in": 43200000
    }

    return ctx.json(jwt);
})

auth.use('/:siteId/user', jwtMiddleware)
auth.get('/:siteId/user', async (ctx) => {
    const payload = ctx.get('jwtPayload') as JWTPayload;
    const userdata = {
        "email": payload.email,
        "first_name": payload.firstName,
        "last_name": payload.lastName,
        "provider": payload.gitProvider,
        "user_metadata": {
            "full_name": `${payload.firstName} ${payload.lastName}`
        }
    }

    return ctx.json(userdata);
})

export { auth };