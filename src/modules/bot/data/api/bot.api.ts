import axios from "axios";
import { botConfig } from "../config/bot.config";
import { externalServices } from "../../../../config";

export class BotApi {
  async sendMessage(message: string) {
    const GEMINI_URL = `${externalServices.GEMINI.BASE_URL}${externalServices.GEMINI.API_KEY}`;
    try {
      const response = await axios.post(GEMINI_URL, {
        contents: [{ parts: [{ text: botConfig.chatBotContext + "\n\n" + message }] }],
      });
  
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      return error;
    }
  }
}
