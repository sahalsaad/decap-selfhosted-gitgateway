import { insertSitesSchema } from "../src/db/sites";
import { z } from "zod";

const createSiteSchema = insertSitesSchema.omit({ id: true });

type SiteCreateRequest = z.infer<typeof createSiteSchema>;

const updateSiteSchema = createSiteSchema.partial();

type SiteUpdateRequest = z.infer<typeof updateSiteSchema>;

export {
  SiteCreateRequest,
  createSiteSchema,
  SiteUpdateRequest,
  updateSiteSchema,
};
