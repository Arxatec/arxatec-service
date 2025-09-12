// src/utils/path/index.ts
import path from "path";
import { fileURLToPath } from "url";
import { IMAGES_DIR } from "../../constants/path";

export const getDirname = (importMetaUrl: string) => {
  const __filename = fileURLToPath(importMetaUrl);
  return path.dirname(__filename);
};

// Siempre resuelve desde la carpeta pública de imágenes del proyecto
export const resolveImagePath = (file: string) => path.join(IMAGES_DIR, file);
