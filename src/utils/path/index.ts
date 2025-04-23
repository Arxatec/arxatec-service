import { dirname } from "path";
import { fileURLToPath } from "url";

export const getDirname = (importMetaUrl: string) => {
  const __filename = fileURLToPath(importMetaUrl);
  return dirname(__filename);
};
