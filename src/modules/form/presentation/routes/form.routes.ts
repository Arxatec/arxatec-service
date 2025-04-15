import { Router } from "express";
import { asyncHandler } from "../../../../middlewares";
import { FormController } from "../controllers/form.controller";

const router = Router();
const formController = new FormController();

/**
 * Support Form
 * @openapi
 * /api/v1/form/support:
 *    post:
 *      tags:
 *        - Support
 *      summary: "Contact and support form submission"
 *      description: "Allows users to submit a contact and support form to request help or report issues."
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - first_name
 *                - last_name
 *                - email
 *                - phone
 *                - country
 *                - subject
 *                - message
 *              properties:
 *                first_name:
 *                  type: string
 *                  example: "Carlos"
 *                  description: "First name of the user submitting the form."
 *                last_name:
 *                  type: string
 *                  example: "Ramírez"
 *                  description: "Last name of the user submitting the form."
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "carlos.ramirez@example.com"
 *                  description: "User's email address to respond to their request."
 *                phone:
 *                  type: string
 *                  example: "+5491122334455"
 *                  description: "User's phone number, must be at least 7 characters and have a valid format."
 *                country:
 *                  type: string
 *                  example: "Argentina"
 *                  description: "Country of the user submitting the form."
 *                subject:
 *                  type: string
 *                  example: "Inquiry about services"
 *                  description: "Main subject or topic of the support request."
 *                message:
 *                  type: string
 *                  example: "I would like to get more information about the services you offer for my company."
 *                  description: "Detailed description of the user's issue or inquiry."
 *      responses:
 *        '200':
 *          description: "Form submitted successfully."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status_code:
 *                    type: integer
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "The form was submitted successfully."
 *                  path:
 *                    type: string
 *                    example: "/support"
 *                  data:
 *                    type: string
 *                    example: "The form was submitted successfully."
 *        '400':
 *          description: "Bad request or incomplete data."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "The key first_name is required."
 *        '422':
 *          description: "Invalid input data, such as a malformed email."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "The key email must be a valid email address."
 *        '500':
 *          description: "Internal error while processing the form."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "An error occurred while processing the request."
 *      security:
 *        - apiKey: []
 */
router.post(
  "/support",
  asyncHandler((req, res) => formController.submitForm(req, res))
);

export default router;
