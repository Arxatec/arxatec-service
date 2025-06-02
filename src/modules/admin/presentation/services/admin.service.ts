// src/modules/admin/presentation/services/admin.service.ts
import { AdminRepository } from "../../data/repository/admin.repository";

// DTOs de registro
import { RegisterArticleCategoryDTO } from "../../domain/dtos/register_article_category.dto";
import { RegisterServiceCategoryDTO } from "../../domain/dtos/register_service_category.dto";
import { RegisterCommunityCategoryDTO } from "../../domain/dtos/register_community_category.dto";
import { RegisterCaseCategoryDTO } from "../../domain/dtos/register_case_category.dto";
import { RegisterCaseStatusDTO } from "../../domain/dtos/register_case_status.dto";
import { RegisterAttachmentCategoryDTO } from "../../domain/dtos/register_attachment_category.dto";

// DTOs de actualización
import { UpdateArticleCategoryDTO } from "../../domain/dtos/update_article_category.dto";
import { UpdateServiceCategoryDTO } from "../../domain/dtos/update_service_category.dto";
import { UpdateCommunityCategoryDTO } from "../../domain/dtos/update_community_category.dto";
import { UpdateCaseCategoryDTO } from "../../domain/dtos/update_case_category.dto";
import { UpdateCaseStatusDTO } from "../../domain/dtos/update_case_status.dto";
import { UpdateAttachmentCategoryDTO } from "../../domain/dtos/update_attachment_category.dto";

export class AdminService {
  constructor(private readonly adminRepository = new AdminRepository()) {}

  /* ---------- REGISTROS ---------- */
  registerArticleCategory(dto: RegisterArticleCategoryDTO) {
    return this.adminRepository.registerArticleCategory(dto);
  }

  registerServiceCategory(dto: RegisterServiceCategoryDTO) {
    return this.adminRepository.registerServiceCategory(dto);
  }

  registerCommunityCategory(dto: RegisterCommunityCategoryDTO) {
    return this.adminRepository.registerCommunityCategory(dto);
  }

  registerCaseCategory(dto: RegisterCaseCategoryDTO) {
    return this.adminRepository.registerCaseCategory(dto);
  }

  registerCaseStatus(dto: RegisterCaseStatusDTO) {
    return this.adminRepository.registerCaseStatus(dto);
  }

  registerAttachmentCategory(dto: RegisterAttachmentCategoryDTO) {
    return this.adminRepository.registerAttachmentCategory(dto);
  }

  /* ---------- ACTUALIZACIONES ---------- */
  updateArticleCategory(id: number, dto: UpdateArticleCategoryDTO) {
    return this.adminRepository.updateArticleCategory(id, dto);
  }

  updateServiceCategory(id: number, dto: UpdateServiceCategoryDTO) {
    return this.adminRepository.updateServiceCategory(id, dto);
  }

  updateCommunityCategory(id: number, dto: UpdateCommunityCategoryDTO) {
    return this.adminRepository.updateCommunityCategory(id, dto);
  }

  updateCaseCategory(id: number, dto: UpdateCaseCategoryDTO) {
    return this.adminRepository.updateCaseCategory(id, dto);
  }

  updateCaseStatus(id: number, dto: UpdateCaseStatusDTO) {
    return this.adminRepository.updateCaseStatus(id, dto);
  }

  updateAttachmentCategory(id: number, dto: UpdateAttachmentCategoryDTO) {
    return this.adminRepository.updateAttachmentCategory(id, dto);
  }

  /* ---------- ELIMINACIONES ---------- */
  deleteArticleCategory(id: number) {
    return this.adminRepository.deleteArticleCategory(id);
  }

  deleteServiceCategory(id: number) {
    return this.adminRepository.deleteServiceCategory(id);
  }

  deleteCommunityCategory(id: number) {
    return this.adminRepository.deleteCommunityCategory(id);
  }

  deleteCaseCategory(id: number) {
    return this.adminRepository.deleteCaseCategory(id);
  }

  deleteCaseStatus(id: number) {
    return this.adminRepository.deleteCaseStatus(id);
  }

  deleteAttachmentCategory(id: number) {
    return this.adminRepository.deleteAttachmentCategory(id);
  }

  /* ---------- CONSULTAS (GET ALL) ---------- */
  getArticleCategories(page: number, limit: number, skip: number) {
    return this.adminRepository.getArticleCategories(page, limit, skip);
  }

  getServiceCategories(page: number, limit: number, skip: number) {
    return this.adminRepository.getServiceCategories(page, limit, skip);
  }

  getCommunityCategories(page: number, limit: number, skip: number) {
    return this.adminRepository.getCommunityCategories(page, limit, skip);
  }

  getCaseCategories(page: number, limit: number, skip: number) {
    return this.adminRepository.getCaseCategories(page, limit, skip);
  }

  getCaseStatuses(page: number, limit: number, skip: number) {
    return this.adminRepository.getCaseStatuses(page, limit, skip);
  }

  getAttachmentCategories(page: number, limit: number, skip: number) {
    return this.adminRepository.getAttachmentCategories(page, limit, skip);
  }
}
