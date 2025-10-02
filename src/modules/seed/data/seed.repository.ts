import prisma from "../../../config/prisma_client";
import bcrypt from "bcrypt";
import {
  CATEGORIES,
  CLIENT_CASES_LIST,
  STATUSES,
  LAWYER_CASES_LIST,
  EXTERNAL_CLIENTS_LIST,
} from "../constants";

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

export async function createLawyerWithCasesAndClients() {
  // Create lawyer user
  const lawyer = await prisma.users.create({
    data: {
      first_name: "Dr. Carlos",
      last_name: "Rodríguez Mendoza",
      email: "carlos.rodriguez@abogado.com",
      password: await bcrypt.hash("lawyer123", 10),
      user_type: "lawyer",
      phone: "+51999888777",
      status: "active",
      lawyer_details: {
        create: {
          license_number: "CAL-2024-12345",
          specialty: "Derecho Civil, Penal y Laboral",
          experience: 15,
          biography:
            "Abogado especializado en derecho civil, penal y laboral con más de 15 años de experiencia. Graduado de la Universidad Nacional Mayor de San Marcos con maestría en Derecho Procesal.",
          linkedin: "https://linkedin.com/in/carlos-rodriguez-abogado",
        },
      },
      user_details: {
        create: {
          gender: "masculino",
          birth_date: new Date("1985-03-20"),
        },
      },
    },
    include: {
      lawyer_details: true,
      user_details: true,
    },
  });

  // Create external clients
  const externalClientsData = EXTERNAL_CLIENTS_LIST.map((client) => ({
    user_detail_id: lawyer.user_details!.user_id,
    full_name: client.full_name,
    email: client.email,
    phone: client.phone,
    dni: client.dni,
  }));

  await prisma.external_clients.createMany({
    data: externalClientsData,
  });

  const createdExternalClients = await prisma.external_clients.findMany({
    where: { user_detail_id: lawyer.user_details!.user_id },
  });

  // Create services and cases for each external client
  const casesCreated: any[] = [];
  for (let i = 0; i < LAWYER_CASES_LIST.length; i++) {
    const caseData = LAWYER_CASES_LIST[i];
    const externalClient = createdExternalClients[i % createdExternalClients.length];

    // Create service for this case
    const service = await prisma.services.create({
      data: {
        type: "case",
        lawyer_id: lawyer.user_details!.user_id,
        external_client_id: externalClient.id,
      },
    });

    // Create case
    const caseRecord = await prisma.cases.create({
      data: {
        service_id: service.id,
        title: caseData.title,
        description: caseData.description,
        urgency: caseData.urgency as "alta" | "media" | "baja",
        category: caseData.category as "civil" | "laboral" | "familiar" | "penal",
        status: caseData.status as
          | "abierto"
          | "en_progreso"
          | "cerrado"
          | "archivado",
        is_public: i % 3 === 0, // Some cases are public
      },
    });

    // Create case history
    await prisma.case_histories.create({
      data: {
        case_id: caseRecord.id,
        changed_by: lawyer.user_details!.user_id,
        field: "status",
        old_value: "",
        new_value: caseRecord.status,
        note: `Caso creado por el abogado con estado inicial: ${caseRecord.status}`,
      },
    });

    casesCreated.push(caseRecord);
  }

  return {
    lawyer,
    externalClients: createdExternalClients.length,
    cases: casesCreated.length,
    services: casesCreated.length,
  };
}

export async function clearData() {
  await prisma.case_histories.deleteMany();
  await prisma.cases.deleteMany();
  await prisma.services.deleteMany();
  await prisma.external_clients.deleteMany();

  await prisma.client_details.deleteMany();
  await prisma.lawyer_details.deleteMany();
  await prisma.user_details.deleteMany();
  await prisma.users.deleteMany({
    where: {
      OR: [
        { email: "juan.perez@example.com" },
        { email: "carlos.rodriguez@abogado.com" },
      ],
    },
  });
}
