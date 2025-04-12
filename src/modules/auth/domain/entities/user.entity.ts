// src/modules/auth/domain/entities/user.entity.ts
export class User {
  constructor(
    public id: number,
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public status: string,
    public creationTimestamp?: Date | null,
    public user_type?: string | null,
    public profile_image?: string | null,
    public phone?: string | null,
    public birth_date?: Date | null,
  ) {}

  isVerified(): boolean {
    return this.status === "active";
  }

  activate(): void {
    this.status = "active";
  }
}
