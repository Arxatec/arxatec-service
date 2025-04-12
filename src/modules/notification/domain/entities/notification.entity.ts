// src/mocules/notification/entities/notification.entity.ts

export class NotificationEntity {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly type: "info" | "success" | "error" | "alert",
    public readonly createdAt: Date,
    public readonly receiverId: number,
    public readonly senderId?: number,
    public readonly url?: string
  ) {}

  static fromPrisma(raw: any): NotificationEntity {
    return new NotificationEntity(
      raw.id,
      raw.title,
      raw.description,
      raw.type,
      raw.createdAt,
      raw.receiverId,
      raw.senderId,
      raw.url 
    );
  }
}
