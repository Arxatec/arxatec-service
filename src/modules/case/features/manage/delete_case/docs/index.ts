// src/modules/cases/features/manage/delete_case/docs/index.ts
/**
 * @openapi
 * /cases/manage/delete/{case_id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cases - Manage
 *     summary: Delete case (only if not taken by a lawyer)
 *     description: El cliente dueño puede eliminar su caso únicamente si está en estado `open` y no tiene abogado asignado. Se eliminan también los adjuntos del caso en S3.
 *     parameters:
 *       - in: path
 *         name: case_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Case deleted
 *       '403':
 *         description: Forbidden — case already taken or user is not the owner
 *       '404':
 *         description: Case not found
 */