interface SiteRequest {
  url: string;
  gitRepo: string;
  gitToken: string;
  gitProvider: "github" | "gitlab" | "bitbucket";
  gitHost: string | undefined;
}
