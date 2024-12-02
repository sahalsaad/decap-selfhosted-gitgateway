import {Hono} from "hono";

const auth = new Hono<{ Bindings: CloudflareBindings }>();
const encoder = new TextEncoder();

function timingSafeEqual(a: string, b: string) {
    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    if (aBytes.byteLength !== bBytes.byteLength) {
        // Strings must be the same length in order to compare
        // with crypto.subtle.timingSafeEqual
        return false;
    }

    return crypto.subtle.timingSafeEqual(aBytes, bBytes);
}

function isAuthorized(credentials: string, username: string, password: string) {
    // The username and password are split by the first colon.
    //=> example: "username:password"
    const index = credentials.indexOf(":");
    const user = credentials.substring(0, index);
    const pass = credentials.substring(index + 1);

    return timingSafeEqual(username, user) && timingSafeEqual(password, pass);
}

auth.post('/token', async (ctx) => {
    const BASIC_USER = "admin";
    const BASIC_PASS = "password";

    const data = await ctx.req.formData();
    const username = data.get("username");
    const password = data.get("password");

    if (isAuthorized(`${username}:${password}`, BASIC_USER, BASIC_PASS)) {
        const jwt = {
            "token_type": "bearer",
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfbWV0YWRhdGEiOnsicmVwbyI6InNhaGFsc2FhZC8wOHB",
            "expires_in": 86400000,
            "refresh_token": "KwxIOji4EAPR7F-v3V9ZTzDcOtCAZjuvjvkBS6hJHd5Whtme26Vsx5UdHYevrSAG"
        }

        return ctx.json(jwt);
    }

    return ctx.body('Unauthorized!', {status: 401});
})

auth.get('/user' as const, async (ctx) => {
    const userdata = {
        "user_metadata": {
            "full_name": "Sahal Saad"
        }
    }

    return ctx.json(userdata);
})

export { auth };