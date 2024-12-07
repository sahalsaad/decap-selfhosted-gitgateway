import {drizzle} from "drizzle-orm/d1";
import {sites} from "../db/sites";
import {eq} from "drizzle-orm";
import {randomUUID} from "node:crypto";
import {encrypt} from "./encryption-service";

export const SiteService = (d1Database: D1Database, authSecretKey: string) => {
    const db = drizzle(d1Database)

    return {
        getSiteById: (siteId: string) => {
            return db
                .select({
                    sites: {
                        id: sites.id,
                        url: sites.url,
                        gitRepo: sites.gitRepo,
                    }
                })
                .from(sites)
                .where(eq(sites.id, siteId)).get();
        },
        getAllSite: () => {
            return db.select({
                sites: {
                    id: sites.id,
                    url: sites.url,
                    gitRepo: sites.gitRepo,
                }
            }).from(sites).all();
        },
        createSite: (siteRequest: SiteRequest) => {
            const encryptedToken = encrypt(siteRequest.gitToken, authSecretKey);
            return db.insert(sites).values({
                id: randomUUID(),
                url: siteRequest.url,
                gitRepo: siteRequest.gitRepo,
                gitProvider: siteRequest.gitProvider,
                gitToken: encryptedToken,
            }).returning({
                id: sites.id,
            });
        },
        updateSite: async (siteId: string, siteRequest: SiteRequest) => {
            const existingSite = await db.select().from(sites).where(eq(sites.id, siteId)).get();
            if (!existingSite) {
                throw new Error("Site not found");
            }

            let updateSite = {}
            if (siteRequest.gitToken) {
                const encryptedToken = encrypt(siteRequest.gitToken, authSecretKey);
                updateSite = {gitToken: encryptedToken}
            }

            if (siteRequest.gitRepo) {
                updateSite = {...updateSite, gitRepo: siteRequest.gitRepo}
            }

            if (siteRequest.gitProvider) {
                updateSite = {...updateSite, gitProvider: siteRequest.gitProvider}
            }

            if (siteRequest.url) {
                updateSite = {...updateSite, url: siteRequest.url}
            }

            const result = await db.update(sites).set(updateSite).where(eq(sites.id, siteId));
            return result.success
        },
        deleteSite: async (siteId: string) => {
            const result = await db.delete(sites).where(eq(sites.id, siteId));
            return result.success
        },
    }
}