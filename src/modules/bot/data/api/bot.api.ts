import axios from "axios";
import { botConfig } from "../config/bot.config";
import { API_KEY_GEMINI } from "../../../../config/env";

export class BotApi {
  async sendMessage(message: string) {
    const BASE_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    const GEMINI_URL = `${BASE_URL}${API_KEY_GEMINI}`;
    try {
      const response = await axios.post(GEMINI_URL, {
        contents: [
          { parts: [{ text: botConfig.chatBotContext + "\n\n" + message }] },
        ],
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      return error;
    }
  }
}
