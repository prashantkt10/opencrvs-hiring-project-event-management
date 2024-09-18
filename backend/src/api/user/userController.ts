import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { IUserLogin, type IUser } from "@/api/user/userInterfaces";
import { env } from "@/common/utils/envConfig";

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id.toString());
    return handleServiceResponse(serviceResponse, res);
  };

  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const user = req.body as IUser;
    const serviceResponse = await userService.create(user);
    return handleServiceResponse(serviceResponse, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const user = req as IUserLogin;
    const serviceResponse = await userService.login(user);
    const options = {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS in production
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
        sameSite: 'strict' as const, // Helps mitigate CSRF attacks
    };
    res.cookie('token', serviceResponse?.responseObject?.token, options);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
