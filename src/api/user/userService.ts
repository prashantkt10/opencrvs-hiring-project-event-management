import { StatusCodes } from "http-status-codes";

import { IUserLogin, IUserLoginResponse, type IUser } from "@/api/user/userInterfaces";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import argon2 from 'argon2';
import { env } from "@/common/utils/envConfig";
import jwt from 'jsonwebtoken';

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }
  async findAll(): Promise<ServiceResponse<IUser[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IUser[]>("Users found", users);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ServiceResponse<IUser | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<IUser>("User found", user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(user: IUser): Promise<ServiceResponse<IUser | null>> {
    try {
      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        return ServiceResponse.failure("User already exists", null, StatusCodes.CONFLICT);
      }
      const hashedPassword = await argon2.hash(user.password, {
        salt: Buffer.from(env.PASSWORD_SALT)
      });
      const newUserRecord = {
        email: user.email,
        name: user.name,
        age: user.age,
        password: hashedPassword
      };
      logger.info(user)
      const newUser = await this.userRepository.create(newUserRecord);
      return ServiceResponse.success<IUser>("User created", newUser);
    } catch (ex) {
      console.log(ex);
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while creating user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async login(userLoginInfo: IUserLogin): Promise<ServiceResponse<IUser | null>> {
    try {
      const { email, password } = userLoginInfo.body;
      const userDetails = await this.userRepository.findByEmail(email);
      if(!userDetails?.email) return ServiceResponse.failure("No user found.", null, StatusCodes.NOT_FOUND);
      const isPasswordValid = await argon2.verify(userDetails.password, password);
      if(!isPasswordValid) return ServiceResponse.failure("Invalid password", null, StatusCodes.BAD_REQUEST);
       const token = jwt.sign(
        { _id: userDetails._id, email: userDetails.email },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return ServiceResponse.success("User logged in successfully", {
        name: userDetails.name,
        email: userDetails.email,
        age: userDetails.age,
        token 
      } as IUserLoginResponse, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
