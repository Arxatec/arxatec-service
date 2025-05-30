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

function mapWorkSchedulesToEntity(workSchedules?: { id: number; lawyer_id: number; day: string; open_time: Date; close_time: Date }[]) {
  if (!workSchedules) return [];
  return workSchedules.map(ws => ({
    id: ws.id,
    lawyer_id: ws.lawyer_id,
    day: ws.day,
    open_time: formatTimeOnly(ws.open_time),
    close_time: formatTimeOnly(ws.close_time)
  }));
}

function mapAttorneyFeesToEntity(attorneyFees?: { id: number; lawyer_id: number; service_category_id: number; fee: number; serviceCategory?: { id: number; name: string } }[]) {
  if (!attorneyFees) return [];
  return attorneyFees.map(af => ({
    id: af.id,
    lawyer_id: af.lawyer_id,
    service_category: af.serviceCategory ? af.serviceCategory.name : "",
    fee: af.fee
  }));
}

export class LawyerRepository {
  private prisma = new PrismaClient();

  async getById(id: number): Promise<Lawyer | null> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        lawyerDetails: {
          include: {
            lawyerService: {
              include: {
                attorneyFees: { include: { serviceCategory: true } },
                workSchedules: true
              }
            }
          }
        },
        userDetails: true
      }
    });
    if (!user || user.user_type !== "lawyer") return null;
    return {
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      licenseNumber: user.lawyerDetails?.license_number || "",
      gender: user.userDetails?.gender || "",
      birthDate: user.userDetails?.birth_date ? user.userDetails.birth_date.toISOString() : "",
      specialty: user.lawyerDetails?.specialty || "",
      experience: user.lawyerDetails?.experience ?? 0,
      biography: user.lawyerDetails?.biography || "",
      linkedin: user.lawyerDetails?.linkedin || "",
      preferredClient: user.lawyerDetails?.lawyerService?.preferred_client || "",
      attorneyFees: mapAttorneyFeesToEntity(user.lawyerDetails?.lawyerService?.attorneyFees),
      workSchedules: mapWorkSchedulesToEntity(user.lawyerDetails?.lawyerService?.workSchedules)
    };
  }

  async getAllLawyers(): Promise<Lawyer[]> {
    const users = await this.prisma.users.findMany({
      where: { user_type: "lawyer" },
      include: {
        lawyerDetails: {
          include: {
            lawyerService: {
              include: {
                attorneyFees: { include: { serviceCategory: true } },
                workSchedules: true
              }
            }
          }
        },
        userDetails: true
      }
    });
    return users.map(user => ({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      licenseNumber: user.lawyerDetails?.license_number || "",
      gender: user.userDetails?.gender || "",
      birthDate: user.userDetails?.birth_date ? user.userDetails.birth_date.toISOString() : "",
      specialty: user.lawyerDetails?.specialty || "",
      experience: user.lawyerDetails?.experience ?? 0,
      biography: user.lawyerDetails?.biography || "",
      linkedin: user.lawyerDetails?.linkedin || "",
      preferredClient: user.lawyerDetails?.lawyerService?.preferred_client || "",
      attorneyFees: mapAttorneyFeesToEntity(user.lawyerDetails?.lawyerService?.attorneyFees),
      workSchedules: mapWorkSchedulesToEntity(user.lawyerDetails?.lawyerService?.workSchedules)
    }));
  }

  async updateLawyerProfile(userId: number, data: UpdateLawyerDTO): Promise<Lawyer> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        lawyerDetails: {
          include: {
            lawyerService: {
              include: {
                attorneyFees: { include: { serviceCategory: true } },
                workSchedules: true
              }
            }
          }
        },
        userDetails: true
      }
    });
    if (!user || user.user_type !== "lawyer" || user.status !== user_status.active) {
      throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_ACCESS_DENIED);
    }
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        first_name: data.first_name ?? user.first_name,
        last_name: data.last_name ?? user.last_name
      }
    });
    if (user.lawyerDetails) {
      await this.prisma.lawyerDetails.update({
        where: { lawyer_id: userId },
        data: {
          license_number: data.license_number ?? user.lawyerDetails.license_number,
          specialty: data.specialty ?? user.lawyerDetails.specialty,
          experience: data.experience ?? user.lawyerDetails.experience,
          biography: data.biography ?? user.lawyerDetails.biography,
          linkedin: data.linkedin ?? user.lawyerDetails.linkedin
        }
      });
      if (user.lawyerDetails.lawyerService) {
        await this.prisma.lawyerService.update({
          where: { lawyer_id: userId },
          data: {
            preferred_client: data.preferred_client ?? user.lawyerDetails.lawyerService.preferred_client,
            payment_methods: data.payment_methods ?? user.lawyerDetails.lawyerService.payment_methods,
            currency: data.currency ?? user.lawyerDetails.lawyerService.currency
          }
        });
      }
    }
    const finalUser = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        lawyerDetails: {
          include: {
            lawyerService: {
              include: {
                attorneyFees: { include: { serviceCategory: true } },
                workSchedules: true
              }
            }
          }
        },
        userDetails: true
      }
    });
    if (!finalUser) throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND);
    return {
      userId: finalUser.id,
      firstName: finalUser.first_name,
      lastName: finalUser.last_name,
      email: finalUser.email,
      licenseNumber: finalUser.lawyerDetails?.license_number || "",
      gender: finalUser.userDetails?.gender || "",
      birthDate: finalUser.userDetails?.birth_date ? finalUser.userDetails.birth_date.toISOString() : "",
      specialty: finalUser.lawyerDetails?.specialty || "",
      experience: finalUser.lawyerDetails?.experience ?? 0,
      biography: finalUser.lawyerDetails?.biography || "",
      linkedin: finalUser.lawyerDetails?.linkedin || "",
      preferredClient: finalUser.lawyerDetails?.lawyerService?.preferred_client || "",
      attorneyFees: mapAttorneyFeesToEntity(finalUser.lawyerDetails?.lawyerService?.attorneyFees),
      workSchedules: mapWorkSchedulesToEntity(finalUser.lawyerDetails?.lawyerService?.workSchedules)
    };
  }

  async registerLawyer(
    userId: number,
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
    attorneyFees?: { service_category_id: number; fee: number }[],
    workSchedules?: { day: string; open_time: string; close_time: string }[]
  ): Promise<Lawyer> {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
    if (user.user_type === "lawyer") throw new AppError("This user is already a lawyer", HttpStatusCodes.CONFLICT.code);
    await this.prisma.users.update({
      where: { id: userId },
      data: { user_type: "lawyer" }
    });

    await this.prisma.userDetails.update({
      where: { user_id: userId },
      data: {
        gender,
        birth_date: new Date(birth_date)
      }
    });
    await this.prisma.lawyerDetails.create({
      data: {
        lawyer_id: userId,
        license_number: licenseNumber,
        specialty: specialty ?? "",
        experience: experience ?? 0,
        biography: biography ?? "",
        linkedin: linkedin ?? ""
      }
    });
    await this.prisma.lawyerService.create({
      data: {
        lawyer_id: userId,
        preferred_client: preferred_client ?? "",
        payment_methods: payment_methods ?? "",
        currency: currency ?? ""
      }
    });
    if (attorneyFees && attorneyFees.length > 0) {
      await this.prisma.attorneyFees.createMany({
        data: attorneyFees.map(fee => ({
          lawyer_id: userId,
          service_category_id: fee.service_category_id,
          fee: fee.fee
        }))
      });
    }
    if (workSchedules && workSchedules.length > 0) {
      await this.prisma.workSchedules.createMany({
        data: workSchedules.map(ws => ({
          lawyer_id: userId,
          day: ws.day as work_day,
          open_time: new Date(`1970-01-01T${ws.open_time}:00Z`),
          close_time: new Date(`1970-01-01T${ws.close_time}:00Z`)
        }))
      });
    }
    const finalUser = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        lawyerDetails: {
          include: {
            lawyerService: {
              include: {
                attorneyFees: { include: { serviceCategory: true } },
                workSchedules: true
              }
            }
          }
        },
        userDetails: true
      }
    });
    if (!finalUser) throw new Error("Error retrieving user after update");
    return {
      userId: finalUser.id,
      firstName: finalUser.first_name,
      lastName: finalUser.last_name,
      email: finalUser.email,
      licenseNumber: finalUser.lawyerDetails?.license_number || "",
      gender: finalUser.userDetails?.gender || "",
      birthDate: finalUser.userDetails?.birth_date ? finalUser.userDetails.birth_date.toISOString() : "",
      specialty: finalUser.lawyerDetails?.specialty || "",
      experience: finalUser.lawyerDetails?.experience ?? 0,
      biography: finalUser.lawyerDetails?.biography || "",
      linkedin: finalUser.lawyerDetails?.linkedin || "",
      preferredClient: finalUser.lawyerDetails?.lawyerService?.preferred_client || "",
      attorneyFees: mapAttorneyFeesToEntity(finalUser.lawyerDetails?.lawyerService?.attorneyFees),
      workSchedules: mapWorkSchedulesToEntity(finalUser.lawyerDetails?.lawyerService?.workSchedules)
    };
  }
  async getLawyersPaginated(skip: number, take: number): Promise<Lawyer[]> {
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
                workSchedules: true
              }
            }
          }
        },
        userDetails: true
      }
    });

    return users.map(user => ({
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      licenseNumber: user.lawyerDetails?.license_number || "",
      gender: user.userDetails?.gender || "",
      birthDate: user.userDetails?.birth_date?.toISOString() || "",
      specialty: user.lawyerDetails?.specialty || "",
      experience: user.lawyerDetails?.experience ?? 0,
      biography: user.lawyerDetails?.biography || "",
      linkedin: user.lawyerDetails?.linkedin || "",
      preferredClient: user.lawyerDetails?.lawyerService?.preferred_client || "",
      attorneyFees: mapAttorneyFeesToEntity(user.lawyerDetails?.lawyerService?.attorneyFees),
      workSchedules: mapWorkSchedulesToEntity(user.lawyerDetails?.lawyerService?.workSchedules)
    }));
  }

  async countLawyers(): Promise<number> {
    return this.prisma.users.count({
      where: { user_type: "lawyer" }
    });
  }
}
