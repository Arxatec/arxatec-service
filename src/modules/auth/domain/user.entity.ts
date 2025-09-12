// src/modules/auth/domain/user.entity.ts
import { user_status, user_type } from "@prisma/client";

export class User {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly status: user_status,
    public readonly creation_timestamp?: Date,
    public readonly user_type?: user_type | null,
    public readonly profile_image?: string
  ) {}

  isActive(): boolean {
    return this.status === "active";
  }
}
