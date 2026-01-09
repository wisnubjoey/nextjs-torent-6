import type { User } from "better-auth/types";

declare module "better-auth/types" {
  interface User {
    role?: string;
    banned?: boolean;
    banReason?: string;
    banExpires?: Date;
  }
}

export interface ExtendedUser extends User {
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: Date;
}