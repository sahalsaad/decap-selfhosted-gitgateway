interface UserResponse {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: string;
  sites: SiteResponse[];
}
