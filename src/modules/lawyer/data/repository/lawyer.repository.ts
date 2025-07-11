import { PrismaClient, user_status, work_day } from "@prisma/client";
import { Lawyer } from "../../domain/entities/lawyer.entity";
import { UpdateLawyerDTO } from "../../domain/dtos/update_lawyer.dto";
import { MESSAGES } from "../../../../constants/messages";
import { AppError } from "../../../../utils";
import { HttpStatusCodes } from "../../../../constants";

function formatTimeOnly(dateValue: Date): string {
  const hours = String(dateValue.getHours()).padStart(2, "0");
  const minutes = String(dateValue.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function mapWorkSchedulesToEntity(
  workSchedules?: {
    id: number;
    lawyer_id: number;
    day: string;
    open_time: Date;
    close_time: Date;
  }[]
) {
  if (!workSchedules) return [];
  return workSchedules.map((ws) => ({
    id: ws.id,
    lawyer_id: ws.lawyer_id,
    day: ws.day,
    open_time: formatTimeOnly(ws.open_time),
    close_time: formatTimeOnly(ws.close_time),
  }));
}

function mapAttorneyFeesToEntity(
  attorneyFees?: {
    id: number;
    lawyer_id: number;
    service_category_id: number;
    fee: number;
    serviceCategory?: { id: number; name: string };
  }[]
) {
  if (!attorneyFees) return [];
  return attorneyFees.map((af) => ({
    id: af.id,
    lawyer_id: af.lawyer_id,
    service_category: af.serviceCategory ? af.serviceCategory.name : "",
    fee: af.fee,
  }));
}

export class LawyerRepository {
  private prisma = new PrismaClient();

  async getById(id: number): Promise<Lawyer | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        include: {
          lawyerDetails: {
            include: {
              lawyerService: {
                include: {
                  attorneyFees: { include: { serviceCategory: true } },
                  workSchedules: true,
                },
              },
            },
          },
          userDetails: {
            include: {
              Locations: true,
              Preference: true,
            },
          },
        },
      });
      if (!user || user.user_type !== "lawyer") return null;
      return {
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        profilePicture: user.profile_image || "",
        licenseNumber: user.lawyerDetails?.license_number || "",
        gender: user.userDetails?.gender || "",
        birthDate: user.userDetails?.birth_date
          ? user.userDetails.birth_date.toISOString()
          : "",
        specialty: user.lawyerDetails?.specialty || "",
        experience: user.lawyerDetails?.experience ?? 0,
        biography: user.lawyerDetails?.biography || "",
        linkedin: user.lawyerDetails?.linkedin || "",
        preferredClient:
          user.lawyerDetails?.lawyerService?.preferred_client || "",
        location: {
          fullAddress: user.userDetails?.Locations?.full_address || "",
          latitude: user.userDetails?.Locations?.latitude ?? 0,
          longitude: user.userDetails?.Locations?.longitude ?? 0,
        },
        communicationPreference:
          user.userDetails?.Preference?.communication_channel || "",
        attorneyFees: mapAttorneyFeesToEntity(
          user.lawyerDetails?.lawyerService?.attorneyFees
        ),
        workSchedules: mapWorkSchedulesToEntity(
          user.lawyerDetails?.lawyerService?.workSchedules
        ),
      };
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  }

  async getAllLawyers(): Promise<Lawyer[]> {
    try {
      const users = await this.prisma.users.findMany({
        where: { user_type: "lawyer" },
        include: {
          lawyerDetails: {
            include: {
              lawyerService: {
                include: {
                  attorneyFees: { include: { serviceCategory: true } },
                  workSchedules: true,
                },
              },
            },
          },
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
        licenseNumber: user.lawyerDetails?.license_number || "",
        gender: user.userDetails?.gender || "",
        birthDate: user.userDetails?.birth_date
          ? user.userDetails.birth_date.toISOString()
          : "",
        specialty: user.lawyerDetails?.specialty || "",
        experience: user.lawyerDetails?.experience ?? 0,
        biography: user.lawyerDetails?.biography || "",
        linkedin: user.lawyerDetails?.linkedin || "",
        preferredClient:
          user.lawyerDetails?.lawyerService?.preferred_client || "",
        location: {
          fullAddress: user.userDetails?.Locations?.full_address || "",
          latitude: user.userDetails?.Locations?.latitude ?? 0,
          longitude: user.userDetails?.Locations?.longitude ?? 0,
        },
        communicationPreference:
          user.userDetails?.Preference?.communication_channel || "",
        attorneyFees: mapAttorneyFeesToEntity(
          user.lawyerDetails?.lawyerService?.attorneyFees
        ),
        workSchedules: mapWorkSchedulesToEntity(
          user.lawyerDetails?.lawyerService?.workSchedules
        ),
      }));
    } catch (error) {
      console.error("Error in getAllLawyers:", error);
      throw error;
    }
  }

  async updateLawyerProfile(
    userId: number,
    data: UpdateLawyerDTO
  ): Promise<Lawyer> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: {
          lawyerDetails: {
            include: {
              lawyerService: {
                include: {
                  attorneyFees: { include: { serviceCategory: true } },
                  workSchedules: true,
                },
              },
            },
          },
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
        user.user_type !== "lawyer" ||
        user.status !== user_status.active
      ) {
        throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_ACCESS_DENIED);
      }

      try {
        await this.prisma.users.update({
          where: { id: userId },
          data: {
            first_name: data.first_name ?? user.first_name,
            last_name: data.last_name ?? user.last_name,
            profile_image: data.profile_picture ?? user.profile_image,
          },
        });

        if (user.lawyerDetails) {
          await this.prisma.lawyerDetails.update({
            where: { lawyer_id: userId },
            data: {
              license_number:
                data.license_number ?? user.lawyerDetails.license_number,
              specialty: data.specialty ?? user.lawyerDetails.specialty,
              experience: data.experience ?? user.lawyerDetails.experience,
              biography: data.biography ?? user.lawyerDetails.biography,
              linkedin: data.linkedin ?? user.lawyerDetails.linkedin,
            },
          });

          if (user.lawyerDetails.lawyerService) {
            await this.prisma.lawyerService.update({
              where: { lawyer_id: userId },
              data: {
                preferred_client:
                  data.preferred_client ??
                  user.lawyerDetails.lawyerService.preferred_client,
                payment_methods:
                  data.payment_methods ??
                  user.lawyerDetails.lawyerService.payment_methods,
                currency:
                  data.currency ?? user.lawyerDetails.lawyerService.currency,
              },
            });
          }
        }

        if (user.userDetails) {
          if (data.coordinates || data.location) {
            if (user.userDetails.Locations) {
              await this.prisma.locations.update({
                where: { user_id: userId },
                data: {
                  full_address:
                    data.location ?? user.userDetails.Locations.full_address,
                  latitude:
                    data.coordinates?.latitude ??
                    user.userDetails.Locations.latitude,
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
                  country: "Mexico",
                  state: "Jalisco",
                  city: "Guadalajara",
                },
              });
            }
          }
        }
      } catch (updateError) {
        console.error("Error updating lawyer profile data:", updateError);
        throw new Error("Error updating lawyer profile");
      }
      const finalUser = await this.prisma.users.findUnique({
        where: { id: userId },
        include: {
          lawyerDetails: {
            include: {
              lawyerService: {
                include: {
                  attorneyFees: { include: { serviceCategory: true } },
                  workSchedules: true,
                },
              },
            },
          },
          userDetails: {
            include: {
              Locations: true,
              Preference: true,
            },
          },
        },
      });
      if (!finalUser) throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND);
      return {
        userId: finalUser.id,
        firstName: finalUser.first_name,
        lastName: finalUser.last_name,
        email: finalUser.email,
        profilePicture: finalUser.profile_image || "",
        licenseNumber: finalUser.lawyerDetails?.license_number || "",
        gender: finalUser.userDetails?.gender || "",
        birthDate: finalUser.userDetails?.birth_date
          ? finalUser.userDetails.birth_date.toISOString()
          : "",
        specialty: finalUser.lawyerDetails?.specialty || "",
        experience: finalUser.lawyerDetails?.experience ?? 0,
        biography: finalUser.lawyerDetails?.biography || "",
        linkedin: finalUser.lawyerDetails?.linkedin || "",
        preferredClient:
          finalUser.lawyerDetails?.lawyerService?.preferred_client || "",
        location: {
          fullAddress: finalUser.userDetails?.Locations?.full_address || "",
          latitude: finalUser.userDetails?.Locations?.latitude ?? 0,
          longitude: finalUser.userDetails?.Locations?.longitude ?? 0,
        },
        communicationPreference:
          finalUser.userDetails?.Preference?.communication_channel || "",
        attorneyFees: mapAttorneyFeesToEntity(
          finalUser.lawyerDetails?.lawyerService?.attorneyFees
        ),
        workSchedules: mapWorkSchedulesToEntity(
          finalUser.lawyerDetails?.lawyerService?.workSchedules
        ),
      };
    } catch (error) {
      console.error("Error in updateLawyerProfile:", error);
      throw error;
    }
  }

  async registerLawyer(
    userId: number,
    profilePicture: string,
    licenseNumber: string,
    gender: string,
    birth_date: string,
    specialty?: string,
    experience?: number,
    biography?: string,
    linkedin?: string,
    preferred_client?: string,
    payment_methods?: string,
    currency?: string,
    coordinates?: { latitude: number; longitude: number },
    communication_preference?: string,
    location?: string,
    attorneyFees?: { service_category_id: number; fee: number }[],
    workSchedules?: { day: string; open_time: string; close_time: string }[]
  ): Promise<Lawyer> {
    try {
      let user;
      try {
        user = await this.prisma.users.findUnique({
          where: { id: userId },
        });
      } catch (error) {
        console.error("Error finding user:", error);
        throw error;
      }

      if (!user) {
        throw new AppError("User not found", HttpStatusCodes.NOT_FOUND.code);
      }

      if (user.user_type === "lawyer") {
        throw new AppError(
          "This user is already a lawyer",
          HttpStatusCodes.CONFLICT.code
        );
      }

      try {
        await this.prisma.users.update({
          where: { id: userId },
          data: {
            user_type: "lawyer",
            profile_image: profilePicture,
          },
        });
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      let existingUserDetails;
      try {
        existingUserDetails = await this.prisma.userDetails.findUnique({
          where: { user_id: userId },
          include: { Preference: true },
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
      }

      if (existingUserDetails) {
        try {
          await this.prisma.userDetails.update({
            where: { user_id: userId },
            data: {
              gender,
              birth_date: new Date(birth_date),
            },
          });
        } catch (error) {
          console.error("Error updating user details:", error);
          throw error;
        }

        if (coordinates || location) {
          let existingLocation;
          try {
            existingLocation = await this.prisma.locations.findUnique({
              where: { user_id: userId },
            });
          } catch (error) {
            console.error("Error finding existing location:", error);
            throw error;
          }

          if (existingLocation) {
            try {
              await this.prisma.locations.update({
                where: { user_id: userId },
                data: {
                  full_address: location ?? existingLocation.full_address,
                  latitude: coordinates?.latitude ?? existingLocation.latitude,
                  longitude:
                    coordinates?.longitude ?? existingLocation.longitude,
                },
              });
            } catch (error) {
              console.error("Error updating location:", error);
              throw error;
            }
          } else {
            try {
              await this.prisma.locations.create({
                data: {
                  user_id: userId,
                  full_address: location ?? "",
                  latitude: coordinates?.latitude ?? 0,
                  longitude: coordinates?.longitude ?? 0,
                  country: "Mexico",
                  state: "Jalisco",
                  city: "Guadalajara",
                },
              });
            } catch (error) {
              console.error("Error creating location:", error);
              throw error;
            }
          }
        }

        if (existingUserDetails.Preference) {
          try {
            await this.prisma.preference.update({
              where: { user_id: userId },
              data: {
                communication_channel:
                  communication_preference ??
                  existingUserDetails.Preference.communication_channel,
              },
            });
          } catch (error) {
            console.error("Error updating preference:", error);
            throw error;
          }
        } else {
          try {
            await this.prisma.preference.create({
              data: {
                user_id: userId,
                communication_channel: communication_preference ?? "",
                receive_notifications: true,
              },
            });
          } catch (error) {
            console.error("Error creating preference:", error);
            throw error;
          }
        }
      } else {
        try {
          await this.prisma.userDetails.create({
            data: {
              user_id: userId,
              gender,
              birth_date: new Date(birth_date),
              Locations: {
                create: {
                  full_address: location ?? "",
                  latitude: coordinates?.latitude ?? 0,
                  longitude: coordinates?.longitude ?? 0,
                  country: "Mexico",
                  state: "Jalisco",
                  city: "Guadalajara",
                },
              },
              Preference: {
                create: {
                  communication_channel: communication_preference ?? "",
                  receive_notifications: true,
                },
              },
            },
          });
        } catch (error) {
          console.error(
            "Error creating userDetails, location, or preference:",
            error
          );
          throw error;
        }
      }

      try {
        await this.prisma.lawyerDetails.create({
          data: {
            lawyer_id: userId,
            license_number: licenseNumber,
            specialty: specialty ?? "",
            experience: experience ?? 0,
            biography: biography ?? "",
            linkedin: linkedin ?? "",
          },
        });
      } catch (error) {
        console.error("Error creating lawyerDetails:", error);
        throw error;
      }

      try {
        await this.prisma.lawyerService.create({
          data: {
            lawyer_id: userId,
            preferred_client: preferred_client ?? "",
            payment_methods: payment_methods ?? "",
            currency: currency ?? "",
          },
        });
      } catch (error) {
        console.error("Error creating lawyerService:", error);
        throw error;
      }

      if (attorneyFees && attorneyFees.length > 0) {
        try {
          await this.prisma.attorneyFees.createMany({
            data: attorneyFees.map((fee) => ({
              lawyer_id: userId,
              service_category_id: fee.service_category_id,
              fee: fee.fee,
            })),
          });
        } catch (error) {
          console.error("Error creating attorneyFees:", error);
          throw error;
        }
      }

      function parseHourToDate(hour: string): Date {
        const [h, m] = hour.split(":");
        const paddedHour = h.padStart(2, "0");
        const paddedMinute = m.padStart(2, "0");

        const iso = `1970-01-01T${paddedHour}:${paddedMinute}:00Z`;
        const date = new Date(iso);

        if (isNaN(date.getTime())) {
          throw new Error(`Invalid hour format received: "${hour}"`);
        }

        return date;
      }

      if (workSchedules && workSchedules.length > 0) {
        try {
          await this.prisma.workSchedules.createMany({
            data: workSchedules.map((ws) => ({
              lawyer_id: userId,
              day: ws.day.toLowerCase() as work_day,
              open_time: parseHourToDate(ws.open_time),
              close_time: parseHourToDate(ws.close_time),
            })),
          });
        } catch (error) {
          console.error("Error creating workSchedules:", error);
          throw error;
        }
      }

      let finalUser;
      try {
        finalUser = await this.prisma.users.findUnique({
          where: { id: userId },
          include: {
            lawyerDetails: {
              include: {
                lawyerService: {
                  include: {
                    attorneyFees: { include: { serviceCategory: true } },
                    workSchedules: true,
                  },
                },
              },
            },
            userDetails: {
              include: {
                Locations: true,
                Preference: true,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error retrieving final user:", error);
        throw error;
      }

      if (!finalUser) {
        throw new Error("Error retrieving user after update");
      }

      return {
        userId: finalUser.id,
        firstName: finalUser.first_name,
        lastName: finalUser.last_name,
        email: finalUser.email,
        profilePicture: finalUser.profile_image || "",
        licenseNumber: finalUser.lawyerDetails?.license_number || "",
        gender: finalUser.userDetails?.gender || "",
        birthDate: finalUser.userDetails?.birth_date?.toISOString() || "",
        specialty: finalUser.lawyerDetails?.specialty || "",
        experience: finalUser.lawyerDetails?.experience ?? 0,
        biography: finalUser.lawyerDetails?.biography || "",
        linkedin: finalUser.lawyerDetails?.linkedin || "",
        preferredClient:
          finalUser.lawyerDetails?.lawyerService?.preferred_client || "",
        location: {
          fullAddress: finalUser.userDetails?.Locations?.full_address || "",
          latitude: finalUser.userDetails?.Locations?.latitude ?? 0,
          longitude: finalUser.userDetails?.Locations?.longitude ?? 0,
        },
        communicationPreference:
          finalUser.userDetails?.Preference?.communication_channel || "",
        attorneyFees: mapAttorneyFeesToEntity(
          finalUser.lawyerDetails?.lawyerService?.attorneyFees
        ),
        workSchedules: mapWorkSchedulesToEntity(
          finalUser.lawyerDetails?.lawyerService?.workSchedules
        ),
      };
    } catch (error) {
      console.error("Error in registerLawyer:", error);
      throw error;
    }
  }

  async getLawyersPaginated(skip: number, take: number): Promise<Lawyer[]> {
    try {
      const users = await this.prisma.users.findMany({
        skip,
        take,
        where: { user_type: "lawyer" },
        include: {
          lawyerDetails: {
            include: {
              lawyerService: {
                include: {
                  attorneyFees: { include: { serviceCategory: true } },
                  workSchedules: true,
                },
              },
            },
          },
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
        licenseNumber: user.lawyerDetails?.license_number || "",
        gender: user.userDetails?.gender || "",
        birthDate: user.userDetails?.birth_date
          ? user.userDetails.birth_date.toISOString()
          : "",
        specialty: user.lawyerDetails?.specialty || "",
        experience: user.lawyerDetails?.experience ?? 0,
        biography: user.lawyerDetails?.biography || "",
        linkedin: user.lawyerDetails?.linkedin || "",
        preferredClient:
          user.lawyerDetails?.lawyerService?.preferred_client || "",
        location: {
          fullAddress: user.userDetails?.Locations?.full_address || "",
          latitude: user.userDetails?.Locations?.latitude ?? 0,
          longitude: user.userDetails?.Locations?.longitude ?? 0,
        },
        communicationPreference:
          user.userDetails?.Preference?.communication_channel || "",
        attorneyFees: mapAttorneyFeesToEntity(
          user.lawyerDetails?.lawyerService?.attorneyFees
        ),
        workSchedules: mapWorkSchedulesToEntity(
          user.lawyerDetails?.lawyerService?.workSchedules
        ),
      }));
    } catch (error) {
      console.error("Error in getLawyersPaginated:", error);
      throw error;
    }
  }

  async countLawyers(): Promise<number> {
    try {
      return this.prisma.users.count({
        where: { user_type: "lawyer" },
      });
    } catch (error) {
      console.error("Error in countLawyers:", error);
      throw error;
    }
  }
}
