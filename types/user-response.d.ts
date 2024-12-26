interface UserResponse {
  email: string
  first_name: string
  last_name: string | null
  provider: string
  user_metadata: {
    full_name: string
  }
}
