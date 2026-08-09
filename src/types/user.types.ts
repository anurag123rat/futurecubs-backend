import { Role } from "../constants/role";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  status: boolean;
  avatar?: string;
  lastLogin?: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;

}