import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SiteService } from "../../services/site-service";
import { createSiteSchema, updateSiteSchema } from "../../../types/sites";

const sitesRoute = new Hono<{ Bindings: CloudflareBindings }>();

sitesRoute.post("/", zValidator("json", createSiteSchema), async (ctx) => {
  const siteCreateRequest = ctx.req.valid("json");
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const [result] = await siteService.createSite(siteCreateRequest);
  return ctx.json(result, 201);
});

sitesRoute.put(
  "/:siteId",
  zValidator("json", updateSiteSchema),
  async (ctx) => {
    const siteUpdateRequest = ctx.req.valid("json");
    const siteId = ctx.req.param("siteId");

    const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
    const isSuccess = await siteService.updateSite(siteId, siteUpdateRequest);

    if (!isSuccess) {
      return ctx.notFound();
    }

    return ctx.body(null, 204);
  },
);

sitesRoute.delete("/:siteId", async (ctx) => {
  const siteId = ctx.req.param("siteId");
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const isSuccess = await siteService.deleteSite(siteId);

  if (isSuccess) {
    return ctx.body(null, 204);
  }

  return ctx.notFound();
});

sitesRoute.get("/:siteId", async (ctx) => {
  const siteId = ctx.req.param("siteId");
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const result = await siteService.getSiteById(siteId);

  if (!result) {
    return ctx.notFound();
  }

  return ctx.json(result);
});

sitesRoute.get("/", async (ctx) => {
  const siteService = SiteService(ctx.env.DB, ctx.env.AUTH_SECRET_KEY!);
  const result = await siteService.getAllSite();
  return ctx.json(result);
});

export { sitesRoute };
