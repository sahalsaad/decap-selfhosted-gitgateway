interface InviteRequest {
  email: string;
  siteId: string;
  role: "admin" | "contributor";
}
