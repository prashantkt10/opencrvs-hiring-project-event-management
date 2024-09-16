import { z } from "zod";
import { UserLoginSchema, UserSchema } from "./userRequestModel";

export type IUser = z.infer<typeof UserSchema>;
export type IUserLogin = z.infer<typeof UserLoginSchema>;
export type IUserLoginResponse = IUser & { token: string };