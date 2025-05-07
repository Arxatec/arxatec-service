import axios from "axios";
import { externalServices } from "../../../../config";
import { articleConfig } from "../config/article.config";

export class ArticleApi {
  async generateResume(content: string) {
    const GEMINI_URL = `${externalServices.GEMINI.BASE_URL}${externalServices.GEMINI.API_KEY}`;
    try {
      const response = await axios.post(GEMINI_URL, {
        contents: [
          { parts: [{ text: articleConfig.context + "\n\n" + content }] },
        ],
      });

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      return error;
    }
  }
}
