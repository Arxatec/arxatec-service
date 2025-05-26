import { PrismaClient, user_status } from "@prisma/client";
import { Client } from "../../domain/entities/client.entity";
import { UpdateClientDTO } from "../../domain/dtos/update_client.dto";
import { MESSAGES } from "../../../../constants/messages";

export class ClientRepository {
  private prisma = new PrismaClient();

  async getById(id: number): Promise<Client | null> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Preference: true,
            Locations: true
          }
        }
      }
    });
    if (!user || user.user_type !== "client") return null;
    return {
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profileImage: user.profile_image || "",
      birthDate: user.birth_date ? user.birth_date.toISOString() : "",
      gender: user.userDetails?.gender || "",
      budgetRange: user.clientDetails?.budget_range || "",
      urgencyLevel: user.clientDetails?.urgency_level || "",
      requirementType: user.clientDetails?.requirement_type || "",
      communicationChannel: user.userDetails?.Preference?.communication_channel || "",
      receiveNotifications: user.userDetails?.Preference?.receive_notifications ?? false,
      notificationChannels: user.userDetails?.Preference?.notification_channels || "",
      location: {
        country: user.userDetails?.Locations?.country || "",
        state: user.userDetails?.Locations?.state || "",
        city: user.userDetails?.Locations?.city || "",
        latitude: user.userDetails?.Locations?.latitude ?? 0,
        longitude: user.userDetails?.Locations?.longitude ?? 0,
        fullAddress: user.userDetails?.Locations?.full_address || "",
        postalCode: user.userDetails?.Locations?.postal_code || ""
      }
    };
  }

  async getAllClients(): Promise<Client[]> {
    const users = await this.prisma.users.findMany({
      where: { user_type: "client" },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Preference: true,
            Locations: true
          }
        }
      }
    });
    return users.map(user => ({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profileImage: user.profile_image || "",
      birthDate: user.birth_date ? user.birth_date.toISOString() : "",
      gender: user.userDetails?.gender || "",
      budgetRange: user.clientDetails?.budget_range || "",
      urgencyLevel: user.clientDetails?.urgency_level || "",
      requirementType: user.clientDetails?.requirement_type || "",
      communicationChannel: user.userDetails?.Preference?.communication_channel || "",
      receiveNotifications: user.userDetails?.Preference?.receive_notifications ?? false,
      notificationChannels: user.userDetails?.Preference?.notification_channels || "",
      location: {
        country: user.userDetails?.Locations?.country || "",
        state: user.userDetails?.Locations?.state || "",
        city: user.userDetails?.Locations?.city || "",
        latitude: user.userDetails?.Locations?.latitude ?? 0,
        longitude: user.userDetails?.Locations?.longitude ?? 0,
        fullAddress: user.userDetails?.Locations?.full_address || "",
        postalCode: user.userDetails?.Locations?.postal_code || ""
      }
    }));
  }

  async updateClientProfile(userId: number, data: UpdateClientDTO): Promise<Client> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Preference: true,
            Locations: true
          }
        }
      }
    });
    if (!user || user.user_type !== "client" || user.status !== user_status.active) {
      throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_ACCESS_DENIED);
    }
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        first_name: data.first_name ?? user.first_name,
        last_name: data.last_name ?? user.last_name,
        profile_image: data.profile_image ?? user.profile_image,
        birth_date: data.birth_date ? new Date(data.birth_date) : user.birth_date
      }
    });
    if (user.clientDetails) {
      await this.prisma.clientDetails.update({
        where: { client_id: userId },
        data: {
          budget_range: data.budget_range ?? user.clientDetails.budget_range,
          urgency_level: data.urgency_level ?? user.clientDetails.urgency_level,
          requirement_type: data.requirement_type ?? user.clientDetails.requirement_type
        }
      });
    }
    if (user.userDetails) {
      await this.prisma.userDetails.update({
        where: { user_id: userId },
        data: {
          gender: data.gender ?? user.userDetails.gender
        }
      });
      if (user.userDetails.Preference) {
        await this.prisma.preference.update({
          where: { user_id: userId },
          data: {
            communication_channel: data.communication_channel ?? user.userDetails.Preference.communication_channel,
            receive_notifications: data.receive_notifications ?? user.userDetails.Preference.receive_notifications,
            notification_channels: data.notification_channels ?? user.userDetails.Preference.notification_channels
          }
        });
      }
      if (user.userDetails.Locations) {
        await this.prisma.locations.update({
          where: { user_id: userId },
          data: {
            country: data.country ?? user.userDetails.Locations.country,
            state: data.state ?? user.userDetails.Locations.state,
            city: data.city ?? user.userDetails.Locations.city,
            latitude: data.latitude ?? user.userDetails.Locations.latitude,
            longitude: data.longitude ?? user.userDetails.Locations.longitude,
            full_address: data.full_address ?? user.userDetails.Locations.full_address,
            postal_code: data.postal_code ?? user.userDetails.Locations.postal_code
          }
        });
      } else {
        await this.prisma.locations.create({
          data: {
            user_id: user.userDetails.user_id,
            country: data.country ?? "",
            state: data.state ?? "",
            city: data.city ?? "",
            latitude: data.latitude ?? 0,
            longitude: data.longitude ?? 0,
            full_address: data.full_address ?? "",
            postal_code: data.postal_code ?? ""
          }
        });
      }
    }
    const finalUser = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        clientDetails: true,
        userDetails: { include: { Preference: true, Locations: true } }
      }
    });
    if (!finalUser) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
    return {
      userId: finalUser.id,
      firstName: finalUser.first_name,
      lastName: finalUser.last_name,
      email: finalUser.email,
      profileImage: finalUser.profile_image || "",
      birthDate: finalUser.birth_date ? finalUser.birth_date.toISOString() : "",
      gender: finalUser.userDetails?.gender || "",
      budgetRange: finalUser.clientDetails?.budget_range || "",
      urgencyLevel: finalUser.clientDetails?.urgency_level || "",
      requirementType: finalUser.clientDetails?.requirement_type || "",
      communicationChannel: finalUser.userDetails?.Preference?.communication_channel || "",
      receiveNotifications: finalUser.userDetails?.Preference?.receive_notifications ?? false,
      notificationChannels: finalUser.userDetails?.Preference?.notification_channels || "",
      location: {
        country: finalUser.userDetails?.Locations?.country || "",
        state: finalUser.userDetails?.Locations?.state || "",
        city: finalUser.userDetails?.Locations?.city || "",
        latitude: finalUser.userDetails?.Locations?.latitude ?? 0,
        longitude: finalUser.userDetails?.Locations?.longitude ?? 0,
        fullAddress: finalUser.userDetails?.Locations?.full_address || "",
        postalCode: finalUser.userDetails?.Locations?.postal_code || ""
      }
    };
  }

  async registerClient(
    userId: number,
    budget_range?: string,
    urgency_level?: string,
    requirement_type?: string,
    profile_image?: string,
    birth_date?: string,
    gender?: string,
    communication_channel?: string,
    receive_notifications?: boolean,
    notification_channels?: string,
    country?: string,
    state?: string,
    city?: string,
    latitude?: number,
    longitude?: number,
    full_address?: string,
    postal_code?: string
  ): Promise<Client> {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
    if (user.user_type === "client") throw new Error("This user is already a client");
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        user_type: "client",
        profile_image: profile_image ?? user.profile_image,
        birth_date: birth_date ? new Date(birth_date) : user.birth_date
      }
    });
    await this.prisma.clientDetails.create({
      data: {
        client_id: userId,
        budget_range: budget_range ?? "",
        urgency_level: urgency_level ?? "",
        requirement_type: requirement_type ?? ""
      }
    });
    const existingUserDetails = await this.prisma.userDetails.findUnique({ where: { user_id: userId } });
    if (existingUserDetails) {
      await this.prisma.userDetails.update({
        where: { user_id: userId },
        data: {
          gender: gender ?? existingUserDetails.gender
        }
      });
      const existingPreference = await this.prisma.preference.findUnique({ where: { user_id: userId } });
      if (existingPreference) {
        await this.prisma.preference.update({
          where: { user_id: userId },
          data: {
            communication_channel: communication_channel ?? existingPreference.communication_channel,
            receive_notifications: receive_notifications ?? existingPreference.receive_notifications,
            notification_channels: notification_channels ?? existingPreference.notification_channels
          }
        });
      } else {
        await this.prisma.preference.create({
          data: {
            user_id: userId,
            communication_channel: communication_channel ?? "",
            receive_notifications: receive_notifications ?? false,
            notification_channels: notification_channels ?? ""
          }
        });
      }
      const existingLocation = await this.prisma.locations.findUnique({ where: { user_id: userId } });
      if (existingLocation) {
        await this.prisma.locations.update({
          where: { user_id: userId },
          data: {
            country: country ?? existingLocation.country,
            state: state ?? existingLocation.state,
            city: city ?? existingLocation.city,
            latitude: latitude ?? existingLocation.latitude,
            longitude: longitude ?? existingLocation.longitude,
            full_address: full_address ?? existingLocation.full_address,
            postal_code: postal_code ?? existingLocation.postal_code
          }
        });
      } else {
        await this.prisma.locations.create({
          data: {
            user_id: userId,
            country: country ?? "",
            state: state ?? "",
            city: city ?? "",
            latitude: latitude ?? 0,
            longitude: longitude ?? 0,
            full_address: full_address ?? "",
            postal_code: postal_code ?? ""
          }
        });
      }
    } else {
      await this.prisma.userDetails.create({
        data: {
          user_id: userId,
          gender: gender ?? ""
        }
      });
      await this.prisma.preference.create({
        data: {
          user_id: userId,
          communication_channel: communication_channel ?? "",
          receive_notifications: receive_notifications ?? false,
          notification_channels: notification_channels ?? ""
        }
      });
      await this.prisma.locations.create({
        data: {
          user_id: userId,
          country: country ?? "",
          state: state ?? "",
          city: city ?? "",
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
          full_address: full_address ?? "",
          postal_code: postal_code ?? ""
        }
      });
    }
    const finalUser = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Preference: true,
            Locations: true
          }
        }
      }
    });
    if (!finalUser) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
    return {
      userId: finalUser.id,
      firstName: finalUser.first_name,
      lastName: finalUser.last_name,
      email: finalUser.email,
      profileImage: finalUser.profile_image || "",
      birthDate: finalUser.birth_date ? finalUser.birth_date.toISOString() : "",
      gender: finalUser.userDetails?.gender || "",
      budgetRange: finalUser.clientDetails?.budget_range || "",
      urgencyLevel: finalUser.clientDetails?.urgency_level || "",
      requirementType: finalUser.clientDetails?.requirement_type || "",
      communicationChannel: finalUser.userDetails?.Preference?.communication_channel || "",
      receiveNotifications: finalUser.userDetails?.Preference?.receive_notifications ?? false,
      notificationChannels: finalUser.userDetails?.Preference?.notification_channels || "",
      location: {
        country: finalUser.userDetails?.Locations?.country || "",
        state: finalUser.userDetails?.Locations?.state || "",
        city: finalUser.userDetails?.Locations?.city || "",
        latitude: finalUser.userDetails?.Locations?.latitude ?? 0,
        longitude: finalUser.userDetails?.Locations?.longitude ?? 0,
        fullAddress: finalUser.userDetails?.Locations?.full_address || "",
        postalCode: finalUser.userDetails?.Locations?.postal_code || ""
      }
    };
  }
  async getClientsPaginated(skip: number, take: number): Promise<Client[]> {
    const users = await this.prisma.users.findMany({
      skip,
      take,
      where: { user_type: "client" },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Preference: true,
            Locations: true
          }
        }
      }
    });

    return users.map(user => ({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profileImage: user.profile_image || "",
      birthDate: user.birth_date ? user.birth_date.toISOString() : "",
      gender: user.userDetails?.gender || "",
      budgetRange: user.clientDetails?.budget_range || "",
      urgencyLevel: user.clientDetails?.urgency_level || "",
      requirementType: user.clientDetails?.requirement_type || "",
      communicationChannel: user.userDetails?.Preference?.communication_channel || "",
      receiveNotifications: user.userDetails?.Preference?.receive_notifications ?? false,
      notificationChannels: user.userDetails?.Preference?.notification_channels || "",
      location: {
        country: user.userDetails?.Locations?.country || "",
        state: user.userDetails?.Locations?.state || "",
        city: user.userDetails?.Locations?.city || "",
        latitude: user.userDetails?.Locations?.latitude ?? 0,
        longitude: user.userDetails?.Locations?.longitude ?? 0,
        fullAddress: user.userDetails?.Locations?.full_address || "",
        postalCode: user.userDetails?.Locations?.postal_code || ""
      }
    }));
  }

  async countClients(): Promise<number> {
    return this.prisma.users.count({
      where: { user_type: "client" }
    });
  }
}
