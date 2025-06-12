// src/modules/case/presentation/routes/case.routes.ts
import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { CaseController } from "../controllers/case.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const caseController = new CaseController();

// ───────────── PUBLIC CATALOGS ─────────────
router.get(
  "/categories",
  asyncHandler(caseController.getCategories.bind(caseController))
);
router.get(
  "/statuses",
  asyncHandler(caseController.getStatuses.bind(caseController))
);

// ───────────── CASE CREATION ─────────────
router.post(
  "/",
  authenticateToken,
  asyncHandler(caseController.createCase.bind(caseController))
);
// ───────────── CLOSED & ARCHIVED CASES ─────────────
router.get(
  "/closed",
  authenticateToken,
  asyncHandler((req, res) => caseController.getClosedCases(req, res))
);
router.get(
  "/archived",
  authenticateToken,
  asyncHandler((req, res) => caseController.getArchivedCases(req, res))
);

router.patch(
  "/:id/reopen",
  authenticateToken,
  asyncHandler((req, res) => caseController.reopenCase(req, res))
);
// ───────────── CLIENT EXTERNAL ─────────────
router.post(
  "/external_clients",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler(caseController.createExternalClient.bind(caseController))
);
router.get(
  "/external_clients",
  authenticateToken,
  asyncHandler(caseController.listExternalClients.bind(caseController))
);
router.put(
  "/external_clients/:id",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler(caseController.updateExternalClient.bind(caseController))
);
router.patch(
  "/external_clients/:id/archive",
  authenticateToken,
  asyncHandler(caseController.archiveExternalClient.bind(caseController))
);
router.get(
  "/external_clients/archived",
  authenticateToken,
  asyncHandler(caseController.listArchivedExternalClients.bind(caseController))
);

router.patch(
  "/external_clients/:id/restore",
  authenticateToken,
  asyncHandler(caseController.restoreExternalClient.bind(caseController))
);

// ───────────── CASE READ ─────────────
router.get(
  "/explore",
  asyncHandler(caseController.exploreCases.bind(caseController))
);
router.get(
  "/my",
  authenticateToken,
  asyncHandler(caseController.getMyCases.bind(caseController))
);
router.get(
  "/:id/history",
  authenticateToken,
  asyncHandler(caseController.getHistory.bind(caseController))
);
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(caseController.getCaseById.bind(caseController))
);

// ───────────── CASE UPDATE ─────────────
router.put(
  "/:id",
  authenticateToken,
  asyncHandler(caseController.updateCase.bind(caseController))
);
router.patch(
  "/:id/status",
  authenticateToken,
  asyncHandler(caseController.changeStatus.bind(caseController))
);
router.patch(
  "/:id/archive",
  authenticateToken,
  asyncHandler(caseController.archiveCase.bind(caseController))
);

// ───────────── ATTACHMENTS ─────────────
router.post(
  "/:id/attachment",
  authenticateToken,
  upload.fields([{ name: "file", maxCount: 1 }]),
  asyncHandler(caseController.addAttachment.bind(caseController))
);
router.get(
  "/:id/attachments",
  authenticateToken,
  asyncHandler(caseController.listAttachments.bind(caseController))
);
router.get(
  "/:id/attachment/:attId",
  authenticateToken,
  asyncHandler(caseController.getAttachmentUrl.bind(caseController))
);
router.patch(
  "/:id/attachment/:attId",
  authenticateToken,
  asyncHandler(caseController.archiveAttachment.bind(caseController))
);

// ───────────── INTERNAL MESSAGES ─────────────
router.post(
  "/:id/message",
  authenticateToken,
  asyncHandler(caseController.sendMessage.bind(caseController))
);

export default router;
