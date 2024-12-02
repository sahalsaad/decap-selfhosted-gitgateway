import {Hono} from "hono";

const settings = new Hono<{ Bindings: CloudflareBindings }>();

settings.get('/', async (ctx) => {
    const settings = {
        "github_enabled": true,
        "gitlab_enabled": false,
        "bitbucket_enabled": false,
        "roles": null
    };

    return ctx.json(settings)
})

export { settings }