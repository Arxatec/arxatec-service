import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { CaseController } from "../controllers/case.controller";

const caseController = new CaseController();
const router = Router();

// Configure multer (private uploads, use tempFilePath + memory as needed)
const upload = multer({ storage: multer.memoryStorage() });

/* -------- PUBLIC CATALOGS -------- */
router.get(
  "/categories",
  asyncHandler((req, res) => caseController.getCategories(req, res))
);
router.get(
  "/statuses",
  asyncHandler((req, res) => caseController.getStatuses(req, res))
);

/* -------- CASE CREATION -------- */
router.post(
  "/",
  authenticateToken,
  asyncHandler((req, res) => caseController.createCase(req, res))
);
router.post(
  "/external_client",
  authenticateToken,
  asyncHandler((req, res) => caseController.createExternalClient(req, res))
);

/* -------- CASE READ -------- */
router.get(
  "/explore",
  asyncHandler((req, res) => caseController.exploreCases(req, res))
);
router.get(
  "/my",
  authenticateToken,
  asyncHandler((req, res) => caseController.getMyCases(req, res))
);
router.get(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => caseController.getCaseById(req, res))
);
router.get(
  "/:id/history",
  authenticateToken,
  asyncHandler((req, res) => caseController.getHistory(req, res))
);

/* -------- CASE UPDATE -------- */
router.put(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => caseController.updateCase(req, res))
);
router.patch(
  "/:id/status",
  authenticateToken,
  asyncHandler((req, res) => caseController.changeStatus(req, res))
);
router.patch(
  "/:id/archive",
  authenticateToken,
  asyncHandler((req, res) => caseController.archiveCase(req, res))
);

/* -------- ATTACHMENTS -------- */
router.post(
  "/:id/attachment",
  authenticateToken,
  upload.fields([{ name: "file", maxCount: 1 }]),
  asyncHandler((req, res) => caseController.addAttachment(req, res))
);
router.get(
  "/:id/attachments",
  authenticateToken,
  asyncHandler((req, res) => caseController.listAttachments(req, res))
);
// GET TEMPORARY SIGNED URL FOR PRIVATE FILE
router.get(
  "/:id/attachment/:attId",
  authenticateToken,
  asyncHandler((req, res) => caseController.getAttachmentUrl(req, res))
);

// ARCHIVE ATTACHMENT (SOFT DELETE)
router.patch(
  "/:id/attachment/:attId",
  authenticateToken,
  asyncHandler((req, res) => caseController.archiveAttachment(req, res))
);

/* -------- INTERNAL MESSAGES -------- */
router.post(
  "/:id/message",
  authenticateToken,
  asyncHandler((req, res) => caseController.sendMessage(req, res))
);

export default router;
