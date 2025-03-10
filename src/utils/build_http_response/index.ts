import { HttpStatusCodes } from "../../constants";

export function buildHttpResponse(
  status: number,
  description: string,
  path?: string,
  data?: any
) {
  return {
    status,
    message:
      Object.values(HttpStatusCodes).find((s) => s.code === status)?.message ||
      "Unknown Error",
    description,
    timestamp: new Date().toISOString(),
    path: path || undefined,
    data: data || undefined,
  };
}
