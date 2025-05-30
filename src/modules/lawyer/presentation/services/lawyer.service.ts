import { LawyerRepository } from "../../data/repository/lawyer.repository";
import { UpdateLawyerDTO } from "../../domain/dtos/update_lawyer.dto";
import { Lawyer } from "../../domain/entities/lawyer.entity";
import { MESSAGES } from "../../../../constants/messages";

export class LawyerService {
  constructor(private lawyerRepository: LawyerRepository) {}

  async getLawyerById(id: number): Promise<Lawyer> {
    const lawyer = await this.lawyerRepository.getById(id);
    if (!lawyer) throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND);
    return lawyer;
  }

  async getAllLawyers(): Promise<Lawyer[]> {
    return this.lawyerRepository.getAllLawyers();
  }

  async getLawyerProfile(userId: number): Promise<Lawyer> {
    const lawyer = await this.lawyerRepository.getById(userId);
    if (!lawyer) throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND);
    return lawyer;
  }

  async updateLawyerProfile(userId: number, data: UpdateLawyerDTO): Promise<Lawyer> {
    return this.lawyerRepository.updateLawyerProfile(userId, data);
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
    return this.lawyerRepository.registerLawyer(
      userId,
      licenseNumber,
      gender,
      birth_date,
      specialty,
      experience,
      biography,
      linkedin,
      preferred_client,
      payment_methods,
      currency,
      attorneyFees,
      workSchedules
    );
  }
}
