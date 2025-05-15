import axios from "axios";
import { API_KEY_GEMINI } from "../../../../config/env";
import { articleConfig } from "../config/article.config";

export class ArticleApi {
  async generateResume(content: string) {
    const BASE_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    const GEMINI_URL = `${BASE_URL}${API_KEY_GEMINI}`;
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
