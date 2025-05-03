import { Router } from "express";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";

import { CaseController } from "../controllers/case.controller";

const caseController = new CaseController();
const router = Router();

/* ---------- públicas / auxiliares ---------- */
router.get(
  "/categories",
  asyncHandler((req, res) => caseController.getCategories(req, res))
);
router.get(
  "/types",
  asyncHandler((req, res) => caseController.getTypes(req, res))
);

/* ---------- creación ---------- */
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

/* ---------- lectura ---------- */
router.get(
  "/explore",
  asyncHandler((req, res) => caseController.exploreCases(req, res))
); // público
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

/* ---------- actualización ---------- */
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

/* ---------- adjuntos ---------- */
router.post(
  "/:id/attachment",
  authenticateToken,
  asyncHandler((req, res) => caseController.addAttachment(req, res))
);
router.delete(
  "/:id/attachment/:attId",
  authenticateToken,
  asyncHandler((req, res) => caseController.archiveAttachment(req, res))
);
router.post(
  "/:id/attachment/external",
  authenticateToken,
  asyncHandler((req, res) => caseController.addAttachment(req, res))
);
router.delete(
  "/:id/attachment/external/:attId",
  authenticateToken,
  asyncHandler((req, res) => caseController.archiveAttachment(req, res))
);
/* ---------- mensajes ---------- */
router.post(
  "/:id/message",
  authenticateToken,
  asyncHandler((req, res) => caseController.sendMessage(req, res))
);

export default router;
