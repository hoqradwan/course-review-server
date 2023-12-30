/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";
export type PasswordChangeHistory = {
    hashedPassword: string;
    timestamps: Date;
}
export type TUser = {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    passwordChangeHistory: PasswordChangeHistory[];
    createdAt?: string;
    updatedAt?: string;
}
export type TLoginUser = {
    username: string;
    password: string;
};


export interface UserModel extends Model<TUser> {
    // isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
    // isJWTIssuedBeforePasswordChanged(
    //     passwordChangedTimestamp: Date,
    //     jwtIssuedTimestamp: number
    // ): boolean;
    isUserExists(id: string): Promise<TUser | null>

}

export type TUserRole = keyof typeof USER_ROLE;