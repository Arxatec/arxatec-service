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
            Locations: true,
            Preference: true,
          },
        },
      },
    });
    if (!user || user.user_type !== "client") return null;
    return {
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profilePicture: user.profile_image || "",
      location: {
        fullAddress: user.userDetails?.Locations?.full_address || "",
        latitude: user.userDetails?.Locations?.latitude ?? 0,
        longitude: user.userDetails?.Locations?.longitude ?? 0,
      },
      occupation: user.clientDetails?.occupation || "",
      ageRange: user.clientDetails?.age_range || "",
      gender: (user.userDetails?.gender as "male" | "female") || "male",
      birthDate: user.birth_date ? user.birth_date.toISOString() : "",
      budget: user.clientDetails?.budget ?? 0,
      urgencyLevel: user.clientDetails?.urgency_level || "",
      communicationPreference:
        user.userDetails?.Preference?.communication_channel || "",
    };
  }

  async getAllClients(): Promise<Client[]> {
    const users = await this.prisma.users.findMany({
      where: { user_type: "client" },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Locations: true,
            Preference: true,
          },
        },
      },
    });
    return users.map((user) => ({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profilePicture: user.profile_image || "",
      location: {
        fullAddress: user.userDetails?.Locations?.full_address || "",
        latitude: user.userDetails?.Locations?.latitude ?? 0,
        longitude: user.userDetails?.Locations?.longitude ?? 0,
      },
      occupation: user.clientDetails?.occupation || "",
      ageRange: user.clientDetails?.age_range || "",
      gender: (user.userDetails?.gender as "male" | "female") || "male",
      birthDate: user.birth_date ? user.birth_date.toISOString() : "",
      budget: user.clientDetails?.budget ?? 0,
      urgencyLevel: user.clientDetails?.urgency_level || "",
      communicationPreference:
        user.userDetails?.Preference?.communication_channel || "",
    }));
  }

  async updateClientProfile(
    userId: number,
    data: UpdateClientDTO
  ): Promise<Client> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Locations: true,
            Preference: true,
          },
        },
      },
    });
    if (
      !user ||
      user.user_type !== "client" ||
      user.status !== user_status.active
    ) {
      throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_ACCESS_DENIED);
    }
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        profile_image: data.profile_picture ?? user.profile_image,
        birth_date: data.birth_date
          ? new Date(data.birth_date)
          : user.birth_date,
      },
    });
    if (user.clientDetails) {
      await this.prisma.clientDetails.update({
        where: { client_id: userId },
        data: {
          occupation: data.occupation ?? user.clientDetails.occupation,
          age_range: data.age_range ?? user.clientDetails.age_range,
          budget: data.budget ?? user.clientDetails.budget,
          urgency_level: data.urgency_level ?? user.clientDetails.urgency_level,
        },
      });
    }
    if (user.userDetails) {
      await this.prisma.userDetails.update({
        where: { user_id: userId },
        data: {
          gender: data.gender ?? user.userDetails.gender,
        },
      });

      // Actualizar o crear preferencias
      if (user.userDetails.Preference) {
        await this.prisma.preference.update({
          where: { user_id: userId },
          data: {
            communication_channel:
              data.communication_preference ??
              user.userDetails.Preference.communication_channel,
          },
        });
      } else {
        await this.prisma.preference.create({
          data: {
            user_id: userId,
            communication_channel: data.communication_preference ?? "",
            receive_notifications: true,
          },
        });
      }

      // Actualizar o crear ubicación
      if (user.userDetails.Locations) {
        await this.prisma.locations.update({
          where: { user_id: userId },
          data: {
            full_address:
              data.location ?? user.userDetails.Locations.full_address,
            latitude:
              data.coordinates?.latitude ?? user.userDetails.Locations.latitude,
            longitude:
              data.coordinates?.longitude ??
              user.userDetails.Locations.longitude,
          },
        });
      } else {
        await this.prisma.locations.create({
          data: {
            user_id: userId,
            full_address: data.location ?? "",
            latitude: data.coordinates?.latitude ?? 0,
            longitude: data.coordinates?.longitude ?? 0,
          },
        });
      }
    }
    const finalUser = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        clientDetails: true,
        userDetails: {
          include: {
            Locations: true,
            Preference: true,
          },
        },
      },
    });
    if (!finalUser) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
    return {
      userId: finalUser.id,
      firstName: finalUser.first_name,
      lastName: finalUser.last_name,
      email: finalUser.email,
      profilePicture: finalUser.profile_image || "",
      location: {
        fullAddress: finalUser.userDetails?.Locations?.full_address || "",
        latitude: finalUser.userDetails?.Locations?.latitude ?? 0,
        longitude: finalUser.userDetails?.Locations?.longitude ?? 0,
      },
      occupation: finalUser.clientDetails?.occupation || "",
      ageRange: finalUser.clientDetails?.age_range || "",
      gender: (finalUser.userDetails?.gender as "male" | "female") || "male",
      birthDate: finalUser.birth_date ? finalUser.birth_date.toISOString() : "",
      budget: finalUser.clientDetails?.budget ?? 0,
      urgencyLevel: finalUser.clientDetails?.urgency_level || "",
      communicationPreference:
        finalUser.userDetails?.Preference?.communication_channel || "",
    };
  }

  async registerClient(
    userId: number,
    profile_picture?: string,
    location?: string,
    occupation?: string,
    age_range?: string,
    gender?: "male" | "female",
    birth_date?: string,
    budget?: number,
    urgency_level?: string,
    communication_preference?: string,
    coordinates?: { latitude: number; longitude: number }
  ): Promise<Client> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
      if (user.user_type === "client")
        throw new Error("This user is already a client");

      await this.prisma.users.update({
        where: { id: userId },
        data: {
          user_type: "client",
          profile_image: profile_picture ?? user.profile_image,
          birth_date: birth_date ? new Date(birth_date) : user.birth_date,
        },
      });

      await this.prisma.clientDetails.create({
        data: {
          client_id: userId,
          occupation: occupation ?? "",
          age_range: age_range ?? "",
          budget: budget ?? 0,
          urgency_level: urgency_level ?? "",
        },
      });

      const existingUserDetails = await this.prisma.userDetails.findUnique({
        where: { user_id: userId },
      });

      if (existingUserDetails) {
        await this.prisma.userDetails.update({
          where: { user_id: userId },
          data: {
            gender: gender ?? existingUserDetails.gender,
          },
        });

        // Crear o actualizar preferencias
        const existingPreference = await this.prisma.preference.findUnique({
          where: { user_id: userId },
        });

        if (existingPreference) {
          await this.prisma.preference.update({
            where: { user_id: userId },
            data: {
              communication_channel:
                communication_preference ??
                existingPreference.communication_channel,
            },
          });
        } else {
          await this.prisma.preference.create({
            data: {
              user_id: userId,
              communication_channel: communication_preference ?? "",
              receive_notifications: true,
            },
          });
        }

        // Crear o actualizar ubicación
        const existingLocation = await this.prisma.locations.findUnique({
          where: { user_id: userId },
        });

        if (existingLocation) {
          await this.prisma.locations.update({
            where: { user_id: userId },
            data: {
              full_address: location ?? existingLocation.full_address,
              latitude: coordinates?.latitude ?? existingLocation.latitude,
              longitude: coordinates?.longitude ?? existingLocation.longitude,
            },
          });
        } else {
          await this.prisma.locations.create({
            data: {
              user_id: userId,
              full_address: location ?? "",
              latitude: coordinates?.latitude ?? 0,
              longitude: coordinates?.longitude ?? 0,
            },
          });
        }
      } else {
        await this.prisma.userDetails.create({
          data: {
            user_id: userId,
            gender: gender ?? "male",
            Preference: {
              create: {
                communication_channel: communication_preference ?? "",
                receive_notifications: true,
              },
            },
            Locations: {
              create: {
                full_address: location ?? "",
                latitude: coordinates?.latitude ?? 0,
                longitude: coordinates?.longitude ?? 0,
              },
            },
          },
        });
      }

      const finalUser = await this.prisma.users.findUnique({
        where: { id: userId },
        include: {
          clientDetails: true,
          userDetails: {
            include: {
              Locations: true,
              Preference: true,
            },
          },
        },
      });
      if (!finalUser) throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_NOT_FOUND);
      return {
        userId: finalUser.id,
        firstName: finalUser.first_name,
        lastName: finalUser.last_name,
        email: finalUser.email,
        profilePicture: finalUser.profile_image || "",
        location: {
          fullAddress: finalUser.userDetails?.Locations?.full_address || "",
          latitude: finalUser.userDetails?.Locations?.latitude ?? 0,
          longitude: finalUser.userDetails?.Locations?.longitude ?? 0,
        },
        occupation: finalUser.clientDetails?.occupation || "",
        ageRange: finalUser.clientDetails?.age_range || "",
        gender: (finalUser.userDetails?.gender as "male" | "female") || "male",
        birthDate: finalUser.birth_date
          ? finalUser.birth_date.toISOString()
          : "",
        budget: finalUser.clientDetails?.budget ?? 0,
        urgencyLevel: finalUser.clientDetails?.urgency_level || "",
        communicationPreference:
          finalUser.userDetails?.Preference?.communication_channel || "",
      };
    } catch (error) {
      console.log(error);
      throw new Error(MESSAGES.CLIENT.CLIENT_ERROR_REGISTERING);
    }
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
            Locations: true,
            Preference: true,
          },
        },
      },
    });

    return users.map((user) => ({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      profilePicture: user.profile_image || "",
      location: {
        fullAddress: user.userDetails?.Locations?.full_address || "",
        latitude: user.userDetails?.Locations?.latitude ?? 0,
        longitude: user.userDetails?.Locations?.longitude ?? 0,
      },
      occupation: user.clientDetails?.occupation || "",
      ageRange: user.clientDetails?.age_range || "",
      gender: (user.userDetails?.gender as "male" | "female") || "male",
      birthDate: user.birth_date ? user.birth_date.toISOString() : "",
      budget: user.clientDetails?.budget ?? 0,
      urgencyLevel: user.clientDetails?.urgency_level || "",
      communicationPreference:
        user.userDetails?.Preference?.communication_channel || "",
    }));
  }

  async countClients(): Promise<number> {
    return this.prisma.users.count({
      where: { user_type: "client" },
    });
  }
}
