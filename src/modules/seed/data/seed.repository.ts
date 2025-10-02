import prisma from "../../../config/prisma_client";
import bcrypt from "bcrypt";
import { CATEGORIES, CLIENT_CASES_LIST, STATUSES } from "../constants";

export async function createClientWithCases() {
  const client = await prisma.users.create({
    data: {
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan.perez@example.com",
      password: await bcrypt.hash("password123", 10),
      user_type: "client",
      status: "active",
      client_details: {
        create: {
          budget_range: "$500 - $1000",
          urgency_level: "media",
          requirement_type: "consulta legal",
          occupation: "Ingeniero",
        },
      },
      user_details: {
        create: {
          gender: "masculino",
          birth_date: new Date("1990-01-15"),
        },
      },
    },
    include: {
      client_details: true,
      user_details: true,
    },
  });

  const service = await prisma.services.create({
    data: {
      type: "case",
      client_id: client.user_details?.user_id,
    },
  });

  const casesData = CLIENT_CASES_LIST.map((caseItem, index) => {
    return {
      service_id: service.id,
      title: caseItem.title,
      description: caseItem.description,
      urgency: caseItem.urgency as "alta" | "media" | "baja",
      category: caseItem.category as "civil" | "laboral" | "familiar" | "penal",
      status: caseItem.status as
        | "abierto"
        | "en_progreso"
        | "cerrado"
        | "archivado",
      is_public: index % 2 === 0,
    };
  });

  const cases = await prisma.cases.createMany({
    data: casesData,
  });

  const createdCases = await prisma.cases.findMany({
    where: { service_id: service.id },
  });

  const histories = await prisma.case_histories.createMany({
    data: createdCases.map((caseItem, index) => ({
      case_id: caseItem.id,
      changed_by: client.user_details?.user_id!,
      field: "status",
      old_value: "",
      new_value: caseItem.status,
      note: `Caso creado con estado inicial: ${caseItem.status}`,
    })),
  });

  return {
    client,
    categories: CATEGORIES.length,
    statuses: STATUSES.length,
    cases: cases.count,
    histories: histories.count,
  };
}

export async function clearData() {
  await prisma.case_histories.deleteMany();
  await prisma.cases.deleteMany();
  await prisma.services.deleteMany();

  await prisma.client_details.deleteMany();
  await prisma.user_details.deleteMany();
  await prisma.users.deleteMany({
    where: { email: "juan.perez@example.com" },
  });
}
