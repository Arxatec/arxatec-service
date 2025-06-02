// src/modules/admin/presentation/routes/admin.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { AdminController } from "../controllers/admin.controller";

const router = Router();
const ctrl = new AdminController();

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Endpoints for managing system categories (only for admins)

 * /api/v1/admin/article_categories:
 *   post:
 *     tags: [Admin]
 *     summary: Register Article
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Article created
 *   get:
 *     tags: [Admin]
 *     summary: Get all Article
 *     responses:
 *       200:
 *         description: List of Article
 *
 * /api/v1/admin/article_categories/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update Article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Article updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete Article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Article deleted

 * /api/v1/admin/service_categories:
 *   post:
 *     tags: [Admin]
 *     summary: Register Service
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Service created
 *   get:
 *     tags: [Admin]
 *     summary: Get all Service
 *     responses:
 *       200:
 *         description: List of Service
 *
 * /api/v1/admin/service_categories/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update Service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete Service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service deleted

 * /api/v1/admin/community_categories:
 *   post:
 *     tags: [Admin]
 *     summary: Register Community
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Community created
 *   get:
 *     tags: [Admin]
 *     summary: Get all Community
 *     responses:
 *       200:
 *         description: List of Community
 *
 * /api/v1/admin/community_categories/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update Community
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Community updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete Community
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Community deleted

 * /api/v1/admin/case_categories:
 *   post:
 *     tags: [Admin]
 *     summary: Register Case
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Case created
 *   get:
 *     tags: [Admin]
 *     summary: Get all Case
 *     responses:
 *       200:
 *         description: List of Case
 *
 * /api/v1/admin/case_categories/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update Case
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete Case
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case deleted

 * /api/v1/admin/case_statuses:
 *   post:
 *     tags: [Admin]
 *     summary: Register Case status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Case status created
 *   get:
 *     tags: [Admin]
 *     summary: Get all Case status
 *     responses:
 *       200:
 *         description: List of Case status
 *
 * /api/v1/admin/case_statuses/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update Case status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case status updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete Case status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case status deleted

 * /api/v1/admin/attachment_categories:
 *   post:
 *     tags: [Admin]
 *     summary: Register Attachment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Attachment created
 *   get:
 *     tags: [Admin]
 *     summary: Get all Attachment
 *     responses:
 *       200:
 *         description: List of Attachment
 *
 * /api/v1/admin/attachment_categories/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update Attachment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attachment updated
 *   delete:
 *     tags: [Admin]
 *     summary: Delete Attachment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attachment deleted

 */


/* ---------- CREATE ---------- */
router.post("/article_categories", authenticateToken, asyncHandler((req, res) => ctrl.registerArticleCategory(req, res)));
router.post("/service_categories", authenticateToken, asyncHandler((req, res) => ctrl.registerServiceCategory(req, res)));
router.post("/community_categories", authenticateToken, asyncHandler((req, res) => ctrl.registerCommunityCategory(req, res)));
router.post("/case_categories", authenticateToken, asyncHandler((req, res) => ctrl.registerCaseCategory(req, res)));
router.post("/case_statuses", authenticateToken, asyncHandler((req, res) => ctrl.registerCaseStatus(req, res)));
router.post("/attachment_categories", authenticateToken, asyncHandler((req, res) => ctrl.registerAttachmentCategory(req, res)));

/* ---------- UPDATE ---------- */
router.put("/article_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.updateArticleCategory(req, res)));
router.put("/service_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.updateServiceCategory(req, res)));
router.put("/community_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.updateCommunityCategory(req, res)));
router.put("/case_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.updateCaseCategory(req, res)));
router.put("/case_statuses/:id", authenticateToken, asyncHandler((req, res) => ctrl.updateCaseStatus(req, res)));
router.put("/attachment_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.updateAttachmentCategory(req, res)));

/* ---------- DELETE ---------- */
router.delete("/article_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.deleteArticleCategory(req, res)));
router.delete("/service_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.deleteServiceCategory(req, res)));
router.delete("/community_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.deleteCommunityCategory(req, res)));
router.delete("/case_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.deleteCaseCategory(req, res)));
router.delete("/case_statuses/:id", authenticateToken, asyncHandler((req, res) => ctrl.deleteCaseStatus(req, res)));
router.delete("/attachment_categories/:id", authenticateToken, asyncHandler((req, res) => ctrl.deleteAttachmentCategory(req, res)));

/* ---------- GET ---------- */
router.get("/article_categories", asyncHandler((req, res) => ctrl.getArticleCategories(req, res)));
router.get("/service_categories", asyncHandler((req, res) => ctrl.getServiceCategories(req, res)));
router.get("/community_categories", asyncHandler((req, res) => ctrl.getCommunityCategories(req, res)));
router.get("/case_categories", asyncHandler((req, res) => ctrl.getCaseCategories(req, res)));
router.get("/case_statuses", asyncHandler((req, res) => ctrl.getCaseStatuses(req, res)));
router.get("/attachment_categories", asyncHandler((req, res) => ctrl.getAttachmentCategories(req, res)));

export default router;
