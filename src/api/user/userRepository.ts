import { UserDataModel } from "@/api/user/userDataModel";
import { IUserLogin, type IUser } from "@/api/user/userInterfaces";

export class UserRepository {
  async findAllAsync(): Promise<IUser[]> {
    return UserDataModel.find();
  }

  async findByIdAsync(id: string): Promise<IUser | null> {
    return UserDataModel.findById(id);
  }

  async create(user: IUser): Promise<IUser> {
    const newUser = new UserDataModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserDataModel.findOne({ email });
  }
}

export const userRepository = new UserRepository();
