// user data model
import { Schema, model } from "mongoose";
import { type IUser } from "./userInterfaces";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
}, {
  timestamps: true
});


export const UserDataModel = model<IUser>("User", userSchema);