interface UserRequest {
    firstName: string
    lastName: string
    email: string
    password: string
    role: "admin" | "contributor"
}