import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}
export type TLoginUser = {
    id: string;
    password: string;
};
export interface UserModel extends Model<TUser> {
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number
    ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;