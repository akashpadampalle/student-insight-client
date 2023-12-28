import User from "./User";

export interface RefreshResponse {
    accessToken: string,
    user: User
}