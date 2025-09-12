// src/constants/path/index.ts
import path from "path";

export const PROJECT_ROOT = process.cwd();

export const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
export const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

export { getDirname } from "../../utils/path";
