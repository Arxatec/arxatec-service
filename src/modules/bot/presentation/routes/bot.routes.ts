import { Router } from "express";
import { BotController } from "../controllers/bot.controllers";
import { asyncHandler } from "../../../../middlewares/async_handler";

const router = Router();
const botController = new BotController();

/**
 * Enviar mensaje al bot
 * @openapi
 * /api/v1/chatbot/send-message:
 *    post:
 *      tags:
 *        - Bot
 *      summary: "Send message to the bot"
 *      description: "Send a message to the bot"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - message
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Hola, ¿cómo estás?"
 *      responses:
 *        '200':
 *          description: "Message sent to the bot correctly."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: "OK"
 *                  description:
 *                    type: string
 *                    example: "Message sent to the bot correctly."
 *                  data:
 *                    type: string
 *                    example: "Hola, ¿cómo estás?"
 *                  timestamp:
 *                    type: string
 *                    example: "2021-01-01T00:00:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/chatbot/send-message"
 *        '400':
 *          description: "Bad Request"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 400
 *                  message:
 *                    type: string
 *                    enum:
 *                      - "Bad Request"
 *                      - "Bad request"
 *                      - "Bad request"
 *                  description:
 *                    type: string
 *                    oneOf:
 *                      - type: string
 *                        example: "The message is required."
 *                      - type: string
 *                        example: "The message value must be greater than one character."
 *                      - type: string
 *                        example: "Unrecognized key(s) in object: 'key'."
 *                  timestamp:
 *                    type: string
 *                    example: "2021-01-01T00:00:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/chatbot/send-message"
 *        '500':
 *          description: "Internal Server Error"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: number
 *                    example: 500
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 *                  description:
 *                    type: string
 *                    example: "Internal Server Error"
 *                  timestamp:
 *                    type: string
 *                    example: "2021-01-01T00:00:00.000Z"
 *                  path:
 *                    type: string
 *                    example: "/api/v1/chatbot/send-message"
 */
router.post(
  "/send-message",
  asyncHandler((req, res) => botController.sendMessage(req, res))
);

export default router;
