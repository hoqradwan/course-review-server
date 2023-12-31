/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    updatePasswordAt?: Date;
    passwordHistory?: Array<{ password: string; updatePasswordAt: Date }>;
    createdAt?: string;
    updatedAt?: string;
}
export type TLoginUser = {
    username: string;
    password: string;
};


export interface UserModel extends Model<TUser> {
    isUserExists(id: string): Promise<TUser | null>

}

export type TUserRole = keyof typeof USER_ROLE;