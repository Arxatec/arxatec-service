// src/.../data/update_profile.repository.ts
import prisma from "../../../../../config/prisma_client";
import type { Prisma } from "@prisma/client";

export async function findLawyerById(userId: string) {
  return prisma.users.findFirst({
    where: { id: userId, user_type: "lawyer" },
    select: { id: true },
  });
}

function pruneUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

type UpdateSelect = Prisma.usersGetPayload<{
  select: {
    id: true;
    phone: true;
    profile_image: true;
    lawyer_details: {
      select: {
        linkedin: true;
        license_number: true;
        address: true;
        location_lat: true;
        location_lng: true;
        biography: true;
        experience: true;
      };
    };
  };
}>;

export async function updateLawyerProfile(
  userId: string,
  data: {
    phone?: string | null;
    profile_image?: string | null;

    linkedin?: string;
    license_number?: string;
    biography?: string;
    experience?: number;

    address?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
  }
): Promise<UpdateSelect> {
  const nonNullableLD = pruneUndefined({
    linkedin: data.linkedin,
    license_number: data.license_number,
    biography: data.biography,
    experience: data.experience,
  });

  const nullableLD = pruneUndefined({
    address: data.address,
    location_lat: data.location_lat, 
    location_lng: data.location_lng, 
  });

  return prisma.users.update({
    where: { id: userId },
    data: {
      phone: data.phone, 
      profile_image: data.profile_image, 
      lawyer_details: {
        update: {
          ...nonNullableLD, 
          ...nullableLD, 
        },
      },
    },
    select: {
      id: true,
      phone: true,
      profile_image: true,
      lawyer_details: {
        select: {
          linkedin: true,
          license_number: true,
          address: true,
          location_lat: true,
          location_lng: true,
          biography: true,
          experience: true,
        },
      },
    },
  });
}
