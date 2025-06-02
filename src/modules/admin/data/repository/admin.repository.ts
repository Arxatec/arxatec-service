// src/modules/admin/data/repository/admin.repository.ts
import { PrismaClient } from "@prisma/client";

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

export class AdminRepository {
  private prisma = new PrismaClient();

  /* ---------- CREATE ---------- */
  registerArticleCategory(data: RegisterArticleCategoryDTO) {
    return this.prisma.articleCategories.create({
      data: { name: data.name, description: data.description ?? null },
    });
  }

  registerServiceCategory(data: RegisterServiceCategoryDTO) {
    return this.prisma.serviceCategories.create({
      data: { name: data.name, description: data.description ?? null },
    });
  }

  registerCommunityCategory(data: RegisterCommunityCategoryDTO) {
    return this.prisma.communityCategories.create({
      data: { name: data.name, description: data.description ?? null },
    });
  }

  registerCaseCategory(data: RegisterCaseCategoryDTO) {
    return this.prisma.caseCategories.create({
      data: { name: data.name, description: data.description ?? null },
    });
  }

  registerCaseStatus(data: RegisterCaseStatusDTO) {
    return this.prisma.caseStatuses.create({
      data: { name: data.name, description: data.description ?? null },
    });
  }

  registerAttachmentCategory(data: RegisterAttachmentCategoryDTO) {
    return this.prisma.attachmentCategories.create({
      data: { name: data.name },
    });
  }

  /* ---------- UPDATE ---------- */
  updateArticleCategory(id: number, data: UpdateArticleCategoryDTO) {
    return this.prisma.articleCategories.update({
      where: { id },
      data,
    });
  }

  updateServiceCategory(id: number, data: UpdateServiceCategoryDTO) {
    return this.prisma.serviceCategories.update({
      where: { id },
      data,
    });
  }

  updateCommunityCategory(id: number, data: UpdateCommunityCategoryDTO) {
    return this.prisma.communityCategories.update({
      where: { id },
      data,
    });
  }

  updateCaseCategory(id: number, data: UpdateCaseCategoryDTO) {
    return this.prisma.caseCategories.update({
      where: { id },
      data,
    });
  }

  updateCaseStatus(id: number, data: UpdateCaseStatusDTO) {
    return this.prisma.caseStatuses.update({
      where: { id },
      data,
    });
  }

  updateAttachmentCategory(id: number, data: UpdateAttachmentCategoryDTO) {
    return this.prisma.attachmentCategories.update({
      where: { id },
      data,
    });
  }

  /* ---------- DELETE ---------- */
  deleteArticleCategory(id: number) {
    return this.prisma.articleCategories.delete({
      where: { id },
    });
  }

  deleteServiceCategory(id: number) {
    return this.prisma.serviceCategories.delete({
      where: { id },
    });
  }

  deleteCommunityCategory(id: number) {
    return this.prisma.communityCategories.delete({
      where: { id },
    });
  }

  deleteCaseCategory(id: number) {
    return this.prisma.caseCategories.delete({
      where: { id },
    });
  }

  deleteCaseStatus(id: number) {
    return this.prisma.caseStatuses.delete({
      where: { id },
    });
  }

  deleteAttachmentCategory(id: number) {
    return this.prisma.attachmentCategories.delete({
      where: { id },
    });
  }

  /* ---------- READ (GET ALL) ---------- */
  async getArticleCategories(page: number, limit: number, skip: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.articleCategories.findMany({ skip, take: limit }),
      this.prisma.articleCategories.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  async getServiceCategories(page: number, limit: number, skip: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.serviceCategories.findMany({ skip, take: limit }),
      this.prisma.serviceCategories.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  async getCommunityCategories(page: number, limit: number, skip: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.communityCategories.findMany({ skip, take: limit }),
      this.prisma.communityCategories.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  async getCaseCategories(page: number, limit: number, skip: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.caseCategories.findMany({ skip, take: limit }),
      this.prisma.caseCategories.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  async getCaseStatuses(page: number, limit: number, skip: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.caseStatuses.findMany({ skip, take: limit }),
      this.prisma.caseStatuses.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  async getAttachmentCategories(page: number, limit: number, skip: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.attachmentCategories.findMany({ skip, take: limit }),
      this.prisma.attachmentCategories.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }
}
