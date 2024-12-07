import { Hono } from "hono";
import { SiteService } from "../../services/site-service";

const sitesApi = new Hono<{ Bindings: CloudflareBindings }>();

sitesApi.post("/", async (ctx) => {
  const siteRequest: SiteRequest = await ctx.req.json();
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const [result] = await siteService.createSite(siteRequest);
  return ctx.json(result, 201);
});

sitesApi.put("/:siteId", async (ctx) => {
  let siteRequest: SiteRequest = await ctx.req.json();
  const siteId = ctx.req.param("siteId");

  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const isSuccess = await siteService.updateSite(siteId, siteRequest);

  if (!isSuccess) {
    return ctx.notFound();
  }

  return ctx.body(null, 204);
});

sitesApi.delete("/:siteId", async (ctx) => {
  const siteId = ctx.req.param("siteId");
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const isSuccess = await siteService.deleteSite(siteId);

  if (isSuccess) {
    return ctx.body(null, 204);
  }

  return ctx.notFound();
});

sitesApi.get("/:siteId", async (ctx) => {
  const siteId = ctx.req.param("siteId");
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const result = await siteService.getSiteById(siteId);

  if (!result) {
    return ctx.notFound();
  }

  return ctx.json(result);
});

sitesApi.get("/", async (ctx) => {
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const result = await siteService.getAllSite();
  return ctx.json(result);
});

export { sitesApi };
