// src/utils/authenticated_user/index.ts
import type { Request } from "express";
import prisma from "../../config/prisma_client";
import { AppError } from "../../utils/errors";
import { HttpStatusCodes } from "../../constants/http_status_codes";

type Role = "admin" | "client" | "lawyer";

export interface CurrentUser {
  id: string;
  role: Role;
}

export type ClientOrLawyer = {
  id: string;
  role: Exclude<Role, "admin">;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getUser(req: Request): CurrentUser {
  const u = (req as any)?.user as
    | { id?: string; user_type?: Role; email?: string }
    | undefined;

  if (!u?.id) {
    throw new AppError(
      "Token de autenticación no válido o no proporcionado",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  if (!UUID_RE.test(u.id)) {
    throw new AppError(
      "Identificador de usuario inválido",
      HttpStatusCodes.UNAUTHORIZED.code
    );
  }

  if (!u.user_type) {
    throw new AppError(
      "Tipo de usuario no permitido",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  return { id: u.id, role: u.user_type };
}

export async function getAuthenticatedUser(req: Request): Promise<CurrentUser> {
  const { id } = getUser(req);

  const user = await prisma.users.findUniqueOrThrow({
    where: { id },
    select: { id: true, user_type: true },
  });

  const role = user.user_type as Role | null;
  if (!role || !["admin", "client", "lawyer"].includes(role)) {
    throw new AppError(
      "Tipo de usuario no permitido",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  return { id: user.id, role };
}

function isClientOrLawyer(u: CurrentUser): u is ClientOrLawyer {
  return u.role !== "admin";
}

function isLawyer(u: CurrentUser): u is CurrentUser & { role: "lawyer" } {
  return u.role === "lawyer";
}

function isClient(u: CurrentUser): u is CurrentUser & { role: "client" } {
  return u.role === "client";
}

export async function requireClientOrLawyer(
  req: Request
): Promise<ClientOrLawyer> {
  const u = await getAuthenticatedUser(req);
  if (!isClientOrLawyer(u)) {
    throw new AppError(
      "Solo clientes o abogados pueden realizar esta operación",
      HttpStatusCodes.FORBIDDEN.code
    );
  }
  return u;
}

export async function requireLawyer(
  req: Request
): Promise<{ id: string; role: "lawyer" }> {
  const u = await getAuthenticatedUser(req);
  if (!isLawyer(u)) {
    throw new AppError(
      "Solo abogados pueden realizar esta operación",
      HttpStatusCodes.FORBIDDEN.code
    );
  }
  return u;
}

export async function requireClient(
  req: Request
): Promise<{ id: string; role: "client" }> {
  const u = await getAuthenticatedUser(req);
  if (!isClient(u)) {
    throw new AppError(
      "Solo clientes pueden realizar esta operación",
      HttpStatusCodes.FORBIDDEN.code
    );
  }
  return u;
}
