import { LawyerRepository } from "../../data/repository/lawyer.repository";
import { UpdateLawyerDTO } from "../../domain/dtos/update_lawyer.dto";
import { RegisterLawyerDTO } from "../../domain/dtos/register_lawyer.dto";
import { Lawyer } from "../../domain/entities/lawyer.entity";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";
import { uploadFile, deleteFile } from "../../../../infrastructure/aws";
import { AppError } from "../../../../utils";

export class LawyerService {
  constructor(private lawyerRepository: LawyerRepository) {}

  async getLawyerById(id: number): Promise<Lawyer> {
    try {
      const lawyer = await this.lawyerRepository.getById(id);
      if (!lawyer) throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND);
      return lawyer;
    } catch (error) {
      console.error("Error in getLawyerById:", error);
      throw error;
    }
  }

  async getAllLawyersPaginated(page: number, limit: number, skip: number) {
    try {
      const [data, total] = await Promise.all([
        this.lawyerRepository.getLawyersPaginated(skip, limit),
        this.lawyerRepository.countLawyers(),
      ]);
      return {
        data,
        meta: Pagination.buildPaginationMeta(total, page, limit),
      };
    } catch (error) {
      console.error("Error in getAllLawyersPaginated:", error);
      throw error;
    }
  }

  async getLawyerProfile(userId: number): Promise<Lawyer> {
    try {
      const lawyer = await this.lawyerRepository.getById(userId);
      if (!lawyer) throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND);
      return lawyer;
    } catch (error) {
      console.error("Error in getLawyerProfile:", error);
      throw error;
    }
  }

  async updateLawyerProfile(
    userId: number,
    data: UpdateLawyerDTO,
    photoFile?: Express.Multer.File
  ): Promise<Lawyer> {
    try {
      const lawyer = await this.lawyerRepository.getById(userId);
      if (!lawyer) throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_NOT_FOUND);

      let photoUrl = data.profile_picture;

      if (photoFile) {
        try {
          const photoResponse = await uploadFile(
            photoFile,
            "public/users/avatar"
          );
          photoUrl = photoResponse.url;

          // Delete previous photo if exists
          if (lawyer.profilePicture) {
            const oldPhotoKey =
              lawyer.profilePicture.split(".amazonaws.com/")[1];
            if (oldPhotoKey) {
              await deleteFile(oldPhotoKey);
            }
          }

          data.profile_picture = photoUrl;
        } catch (uploadError) {
          console.error("Error uploading/deleting photo:", uploadError);
          throw new Error("Error processing photo upload");
        }
      }

      return this.lawyerRepository.updateLawyerProfile(userId, data);
    } catch (error) {
      console.error("Error in updateLawyerProfile:", error);
      throw error;
    }
  }

  async registerLawyer(
    data: RegisterLawyerDTO,
    photoFile: Express.Multer.File
  ): Promise<Lawyer> {
    try {
      let photoUrl: string;
      try {
        const photoResponse = await uploadFile(
          photoFile,
          "public/users/avatar"
        );
        photoUrl = photoResponse.url;
      } catch (uploadError) {
        console.error("Error uploading photo:", uploadError);
        throw new Error("Error uploading profile photo");
      }

      return this.lawyerRepository.registerLawyer(
        data.id,
        photoUrl,
        data.license_number,
        data.gender,
        data.birth_date,
        data.specialty,
        data.experience,
        data.biography,
        data.linkedin,
        data.preferred_client,
        data.payment_methods,
        data.currency,
        data.coordinates,
        data.communication_preference,
        data.location,
        data.attorneyFees,
        data.workSchedules
      );
    } catch (error) {
      console.error("Error in registerLawyer:", error);
      throw new Error(MESSAGES.LAWYER.LAWYER_ERROR_REGISTERING);
    }
  }
}
