import { HttpStatusCodes } from "../../constants";

export function buildHttpResponse(
  status: number,
  description: string,
  path?: string,
  data?: any,
  meta?: any 
) {
  const response: any = {
    status,
    message:
      Object.values(HttpStatusCodes).find((s) => s.code === status)?.message ||
      "Unknown Error",
    description,
    timestamp: new Date().toISOString(),
    path: path || undefined,
    data: data || undefined,
  };

  if (meta !== undefined) {
    response.meta = meta; 
  }

  return response;
}
