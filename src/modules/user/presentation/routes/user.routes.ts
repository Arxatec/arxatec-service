import { Router } from 'express';
import { registerController, loginController } from '../controllers/user.controller';

const router = Router();
/**
 * @openapi
 * /login:
 *  post:
 *    tags:
 *      - Users
 *    summary: User login
 *    description: Authenticate a user and return a token if credentials are valid.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: "user@example.com"
 *              password:
 *                type: string
 *                format: password
 *                example: "password123"
 *    responses:
 *      200:
 *        description: Successful login
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *      400:
 *        description: Invalid request body (extra fields, missing fields, etc.)
 *      401:
 *        description: Unauthorized - Invalid email or password
 *      500:
 *        description: Internal server error
 */
router.post('/register', registerController);
router.post('/login', loginController);

export default router;
