import { API_KEY_GEMINI } from "../env";

export const externalServices = {
  GEMINI: {
    BASE_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=", 
    API_KEY: API_KEY_GEMINI,
  },
};