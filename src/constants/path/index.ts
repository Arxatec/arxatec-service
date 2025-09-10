import { ENVIRONMENT, PROJECT_ROOT } from "../../config/env";
import { getDirname } from "../../utils";

export const dirname =
  ENVIRONMENT === "production"
    ? PROJECT_ROOT || ""
    : getDirname(import.meta.url);
