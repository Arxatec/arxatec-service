import path, { dirname } from "path";
import { dirname as dirnameConstants } from "../../constants";
import { fileURLToPath } from "url";
import { ENVIRONMENT } from "../../config";

export const getDirname = (importMetaUrl: string) => {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
};

export const resolveImagePath = (file: string) =>
  ENVIRONMENT === "production"
    ? path.join(dirnameConstants, "public/images", file)
    : path.join(dirnameConstants, "../../../public/images", file);
