import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, GetUserSchema, UserLoginSchema, UserSchema } from "@/api/user/userRequestModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);


userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});
userRouter.get("/", userController.getUsers);


userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});
userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);


userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  request: { 
    body: {
      description: 'Register user body',
      required: true,
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
});
userRouter.post("/", validateRequest(CreateUserSchema), userController.createUser);


userRegistry.registerPath({
  method: "post",
  path: "/login",
  tags: ["User"],
  request: { 
    body: {
      description: 'Register user body',
      required: true,
      content: {
        'application/json': {
          schema: UserLoginSchema
        }
      }
    }
  },
  responses: createApiResponse(UserLoginSchema, "Success"),
});
userRouter.post("/login", validateRequest(UserLoginSchema), userController.login);