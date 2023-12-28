export type UserType = "Employee" | "Admin";

export default interface User {
    _id: string,
    username: string,
    type: UserType
} 