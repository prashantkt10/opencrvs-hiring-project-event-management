import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(16),
  age: z.number().optional(),
  token: z.string().optional()
});

export const CreateUserSchema = z.object({
  body: UserSchema
});

export const UserLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(16),
  })
});

export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
