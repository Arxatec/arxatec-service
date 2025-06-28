import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- DATOS DE PRUEBA ---

const clientsData = [
  {
    id: 1,
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@example.com",
    phone: "+51900001001",
    birthDate: "1994-03-21",
    gender: "Femenino",
    budget: "500-1500 USD",
    urgency: "alta",
    requirement: "asistencia laboral",
  },
  {
    id: 2,
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@example.com",
    phone: "+51900001002",
    birthDate: "1989-07-14",
    gender: "Masculino",
    budget: "1000-2500 USD",
    urgency: "media",
    requirement: "contrato civil",
  },
  {
    id: 3,
    firstName: "Lucía",
    lastName: "Ramírez",
    email: "lucia.ramirez@example.com",
    phone: "+51900001003",
    birthDate: "1992-11-09",
    gender: "Femenino",
    budget: "800-2000 USD",
    urgency: "baja",
    requirement: "asesoría tributaria",
  },
  {
    id: 4,
    firstName: "Carlos",
    lastName: "Díaz",
    email: "carlos.diaz@example.com",
    phone: "+51900001004",
    birthDate: "1985-01-30",
    gender: "Masculino",
    budget: "1500-3500 USD",
    urgency: "alta",
    requirement: "defensa penal",
  },
  {
    id: 5,
    firstName: "Ana",
    lastName: "Fernández",
    email: "ana.fernandez@example.com",
    phone: "+51900001005",
    birthDate: "1998-04-18",
    gender: "Femenino",
    budget: "300-900 USD",
    urgency: "media",
    requirement: "registro de marca",
  },
  {
    id: 6,
    firstName: "Pedro",
    lastName: "Morales",
    email: "pedro.morales@example.com",
    phone: "+51900001006",
    birthDate: "1990-12-22",
    gender: "Masculino",
    budget: "2000-4000 USD",
    urgency: "baja",
    requirement: "contrato de alquiler",
  },
  {
    id: 7,
    firstName: "Daniela",
    lastName: "Castro",
    email: "daniela.castro@example.com",
    phone: "+51900001007",
    birthDate: "1993-08-12",
    gender: "Femenino",
    budget: "700-1200 USD",
    urgency: "media",
    requirement: "sucesión intestada",
  },
  {
    id: 8,
    firstName: "José",
    lastName: "Rojas",
    email: "jose.rojas@example.com",
    phone: "+51900001008",
    birthDate: "1979-06-03",
    gender: "Masculino",
    budget: "1800-5000 USD",
    urgency: "alta",
    requirement: "litigio civil",
  },
  {
    id: 9,
    firstName: "Fernanda",
    lastName: "Vega",
    email: "fernanda.vega@example.com",
    phone: "+51900001009",
    birthDate: "1991-09-25",
    gender: "Femenino",
    budget: "600-1600 USD",
    urgency: "baja",
    requirement: "divorcio mutuo",
  },
  {
    id: 10,
    firstName: "Miguel",
    lastName: "Herrera",
    email: "miguel.herrera@example.com",
    phone: "+51900001010",
    birthDate: "1988-10-14",
    gender: "Masculino",
    budget: "1200-2800 USD",
    urgency: "alta",
    requirement: "indemnización laboral",
  },
  {
    id: 11,
    firstName: "Paola",
    lastName: "Ortiz",
    email: "paola.ortiz@example.com",
    phone: "+51900001011",
    birthDate: "1995-02-07",
    gender: "Femenino",
    budget: "400-1100 USD",
    urgency: "media",
    requirement: "carta notarial",
  },
  {
    id: 12,
    firstName: "Ricardo",
    lastName: "Ruiz",
    email: "ricardo.ruiz@example.com",
    phone: "+51900001012",
    birthDate: "1987-05-29",
    gender: "Masculino",
    budget: "2500-4500 USD",
    urgency: "alta",
    requirement: "arbitraje comercial",
  },
  {
    id: 13,
    firstName: "Valeria",
    lastName: "Chávez",
    email: "valeria.chavez@example.com",
    phone: "+51900001013",
    birthDate: "1999-03-11",
    gender: "Femenino",
    budget: "350-950 USD",
    urgency: "baja",
    requirement: "consulta societaria",
  },
  {
    id: 14,
    firstName: "Diego",
    lastName: "Salazar",
    email: "diego.salazar@example.com",
    phone: "+51900001014",
    birthDate: "1983-01-22",
    gender: "Masculino",
    budget: "1000-2200 USD",
    urgency: "media",
    requirement: "rectificación de partida",
  },
  {
    id: 15,
    firstName: "Camila",
    lastName: "Flores",
    email: "camila.flores@example.com",
    phone: "+51900001015",
    birthDate: "1996-07-08",
    gender: "Femenino",
    budget: "1300-3000 USD",
    urgency: "alta",
    requirement: "allanamiento penal",
  },
  {
    id: 16,
    firstName: "Alberto",
    lastName: "Navarro",
    email: "alberto.navarro@example.com",
    phone: "+51900001016",
    birthDate: "1986-08-16",
    gender: "Masculino",
    budget: "500-1800 USD",
    urgency: "baja",
    requirement: "oposición de marca",
  },
  {
    id: 17,
    firstName: "Gabriela",
    lastName: "Paredes",
    email: "gabriela.paredes@example.com",
    phone: "+51900001017",
    birthDate: "1993-12-02",
    gender: "Femenino",
    budget: "750-1900 USD",
    urgency: "media",
    requirement: "adopción",
  },
  {
    id: 18,
    firstName: "Jorge",
    lastName: "Medina",
    email: "jorge.medina@example.com",
    phone: "+51900001018",
    birthDate: "1981-11-17",
    gender: "Masculino",
    budget: "900-2400 USD",
    urgency: "alta",
    requirement: "cobro de deuda",
  },
  {
    id: 19,
    firstName: "Natalia",
    lastName: "Quispe",
    email: "natalia.quispe@example.com",
    phone: "+51900001019",
    birthDate: "1997-05-05",
    gender: "Femenino",
    budget: "400-1200 USD",
    urgency: "baja",
    requirement: "afiliación SIS",
  },
  {
    id: 20,
    firstName: "Sebastián",
    lastName: "Torres",
    email: "sebastian.torres@example.com",
    phone: "+51900001020",
    birthDate: "1984-09-14",
    gender: "Masculino",
    budget: "1600-3800 USD",
    urgency: "media",
    requirement: "tutela penal",
  },
];

const lawyersData = [
  {
    id: 21,
    firstName: "Carlos",
    lastName: "Ramírez",
    email: "carlos.ramirez@lex.com",
    phone: "987654321",
    birthDate: "1982-03-15",
    gender: "Masculino",
    profileImage: "https://i.pravatar.cc/150?u=abogado_carlos",
    license: "COL1234567",
    specialty: "Derecho Penal",
    experience: 12,
    biography:
      "Abogado con más de una década de experiencia en litigios penales complejos.",
    linkedin: "https://www.linkedin.com/in/carlos-ramirez-abogado",
  },
  {
    id: 23,
    firstName: "Andrea",
    lastName: "Morales",
    email: "andrea.morales@lex.com",
    phone: "+51900002301",
    birthDate: "1987-02-19",
    gender: "Femenino",
    profileImage: "https://i.pravatar.cc/150?u=abogada_andrea",
    license: "COL1234580",
    specialty: "Derecho Civil",
    experience: 8,
    biography: "Especialista en procesos civiles y mediación patrimonial.",
    linkedin: "https://www.linkedin.com/in/andrea-morales",
  },
  {
    id: 24,
    firstName: "José",
    lastName: "Soto",
    email: "jose.soto@lex.com",
    phone: "+51900002302",
    birthDate: "1979-11-05",
    gender: "Masculino",
    profileImage: "https://i.pravatar.cc/150?u=abogado_jose",
    license: "COL1234581",
    specialty: "Derecho Laboral",
    experience: 15,
    biography: "Defensa de trabajadores y sindicatos en litigios complejos.",
    linkedin: "https://www.linkedin.com/in/jose-soto",
  },
  {
    id: 25,
    firstName: "Valentina",
    lastName: "Rivas",
    email: "valentina.rivas@lex.com",
    phone: "+51900002303",
    birthDate: "1985-06-12",
    gender: "Femenino",
    profileImage: "https://i.pravatar.cc/150?u=abogada_valentina",
    license: "COL1234582",
    specialty: "Derecho Corporativo",
    experience: 10,
    biography:
      "Asesora a empresas en fusiones y adquisiciones internacionales.",
    linkedin: "https://www.linkedin.com/in/valentina-rivas",
  },
  {
    id: 26,
    firstName: "Luis",
    lastName: "Méndez",
    email: "luis.mendez@lex.com",
    phone: "+51900002304",
    birthDate: "1982-09-30",
    gender: "Masculino",
    profileImage: "https://i.pravatar.cc/150?u=abogado_luis",
    license: "COL1234583",
    specialty: "Derecho Tributario",
    experience: 13,
    biography: "Consultor en planificación fiscal y litigios tributarios.",
    linkedin: "https://www.linkedin.com/in/luis-mendez",
  },
  {
    id: 27,
    firstName: "Paula",
    lastName: "Vargas",
    email: "paula.vargas@lex.com",
    phone: "+51900002305",
    birthDate: "1990-03-16",
    gender: "Femenino",
    profileImage: "https://i.pravatar.cc/150?u=abogada_paula",
    license: "COL1234584",
    specialty: "Derecho de Familia",
    experience: 7,
    biography: "Litigante en procesos de divorcio, adopción y tenencia.",
    linkedin: "https://www.linkedin.com/in/paula-vargas",
  },
  {
    id: 28,
    firstName: "Miguel",
    lastName: "Lozano",
    email: "miguel.lozano@lex.com",
    phone: "+51900002306",
    birthDate: "1986-12-01",
    gender: "Masculino",
    profileImage: "https://i.pravatar.cc/150?u=abogado_miguel",
    license: "COL1234585",
    specialty: "Derecho Ambiental",
    experience: 9,
    biography: "Especialista en cumplimiento normativo y litigios ambientales.",
    linkedin: "https://www.linkedin.com/in/miguel-lozano",
  },
  {
    id: 29,
    firstName: "Fernanda",
    lastName: "Salas",
    email: "fernanda.salas@lex.com",
    phone: "+51900002307",
    birthDate: "1984-05-21",
    gender: "Femenino",
    profileImage: "https://i.pravatar.cc/150?u=abogada_fernanda",
    license: "COL1234586",
    specialty: "Derecho Comercial",
    experience: 11,
    biography: "Representación en litigios comerciales y arbitraje.",
    linkedin: "https://www.linkedin.com/in/fernanda-salas",
  },
  {
    id: 30,
    firstName: "Diego",
    lastName: "Paredes",
    email: "diego.paredes@lex.com",
    phone: "+51900002308",
    birthDate: "1981-07-08",
    gender: "Masculino",
    profileImage: "https://i.pravatar.cc/150?u=abogado_diego",
    license: "COL1234587",
    specialty: "Derecho Administrativo",
    experience: 14,
    biography: "Experto en contratación pública y procesos contenciosos.",
    linkedin: "https://www.linkedin.com/in/diego-paredes",
  },
  {
    id: 31,
    firstName: "Camila",
    lastName: "Torres",
    email: "camila.torres@lex.com",
    phone: "+51900002309",
    birthDate: "1992-10-24",
    gender: "Femenino",
    profileImage: "https://i.pravatar.cc/150?u=abogada_camila",
    license: "COL1234588",
    specialty: "Derecho Constitucional",
    experience: 6,
    biography: "Defensora de derechos fundamentales y litigios de amparo.",
    linkedin: "https://www.linkedin.com/in/camila-torres",
  },
];

const HASHED_PASSWORD =
  "$2b$10$ES.Jf5GxlUZI5BWPVHi6s.9rElMHQVZsld2VxGluvUlgvc.Va5F8O";

// --- FUNCIÓN DEL SEED ---

async function main() {
  console.log(`Iniciando el proceso de seeding...`);

  // --- BORRADO DE DATOS (LIMPIEZA) ---
  await prisma.caseHistories.deleteMany({});
  await prisma.attachments.deleteMany({});
  await prisma.cases.deleteMany({});
  await prisma.services.deleteMany({});
  await prisma.preference.deleteMany({});
  await prisma.locations.deleteMany({});
  await prisma.lawyerDetails.deleteMany({});
  await prisma.clientDetails.deleteMany({});
  await prisma.userDetails.deleteMany({});
  await prisma.users.deleteMany();
  await prisma.articleCategories.deleteMany({});
  await prisma.caseCategories.deleteMany({});
  await prisma.attachmentCategories.deleteMany({});
  await prisma.serviceCategories.deleteMany({});
  await prisma.caseStatuses.deleteMany({});

  // --- CREACIÓN DE CATÁLOGOS ---
  await prisma.articleCategories.createMany({
    data: [
      {
        id: 1,
        name: "Penal",
        description: "Artículos sobre delitos, sanciones y procesos penales.",
      },
      {
        id: 2,
        name: "Civil",
        description: "Contratos, propiedad, herencias y obligaciones civiles.",
      },
      {
        id: 3,
        name: "Laboral",
        description: "Normas del trabajo, derechos de los trabajadores.",
      },
      {
        id: 4,
        name: "Familiar",
        description: "Divorcios, custodia, adopciones y herencias.",
      },
      {
        id: 5,
        name: "Tributario",
        description: "Impuestos, fiscalización y procedimientos tributarios.",
      },
      {
        id: 6,
        name: "Ambiental",
        description: "Protección del medio ambiente y legislación ecológica.",
      },
    ],
    skipDuplicates: true,
  });
  await prisma.caseCategories.createMany({
    data: [
      {
        name: "Derecho penal",
        description: "Defensa o acusación en materias penales.",
      },
      {
        name: "Derecho civil",
        description: "Conflictos sobre obligaciones, contratos o daños.",
      },
      {
        name: "Derecho laboral",
        description:
          "Demandas por despido, beneficios y condiciones de trabajo.",
      },
      {
        name: "Derecho comercial",
        description: "Asuntos societarios, contratos mercantiles y quiebras.",
      },
      {
        name: "Derecho de familia",
        description: "Divorcios, custodias, pensiones y adopciones.",
      },
    ],
  });
  await prisma.attachmentCategories.createMany({
    data: [
      { name: "Evidencia" },
      { name: "Documento legal" },
      { name: "Contrato" },
      { name: "Identificación" },
      { name: "Correspondencia" },
    ],
  });
  await prisma.serviceCategories.createMany({
    data: [
      {
        name: "Caso",
        description:
          "Servicios relacionados con la gestión de casos judiciales",
      },
      { name: "Consulta", description: "Servicios de asesoría legal puntual." },
    ],
  });
  await prisma.caseStatuses.createMany({
    data: [
      {
        name: "Registrado",
        description: "Caso creado y pendiente de asignación a abogado.",
      },
      {
        name: "En revisión",
        description: "El abogado revisa viabilidad y documentación inicial",
      },
      {
        name: "En proceso",
        description:
          "Trámite activo: escritos, audiencias o diligencias en curso.",
      },
      {
        name: "Con resolución",
        description:
          "Se emitió decisión; pendiente de ejecución o notificación final.",
      },
      {
        name: "Cerrado",
        description: "Todas las gestiones concluidas; expediente finalizado.",
      },
    ],
  });

  // --- CREACIÓN DE USUARIOS (CLIENTES) ---
  for (const client of clientsData) {
    await prisma.users.create({
      data: {
        id: client.id,
        first_name: client.firstName,
        last_name: client.lastName,
        email: client.email,
        password: HASHED_PASSWORD,
        user_type: "client",
        status: "active",
        phone: client.phone,
        birth_date: new Date(client.birthDate),
        clientDetails: {
          create: {
            budget_range: client.budget,
            urgency_level: client.urgency,
            requirement_type: client.requirement,
          },
        },
        userDetails: {
          create: {
            gender: client.gender,
            birth_date: new Date(client.birthDate),
            Preference: {
              create: {
                communication_channel: "email",
                receive_notifications: true,
                notification_channels: "email",
              },
            },
            Locations: {
              create: {
                country: "Peru",
                state: "Junín",
                city: "Huancayo",
                latitude: -12.065,
                longitude: -75.204,
              },
            },
          },
        },
      },
    });
  }

  // --- CREACIÓN DE USUARIOS (ABOGADOS) ---
  for (const lawyer of lawyersData) {
    await prisma.users.create({
      data: {
        id: lawyer.id,
        first_name: lawyer.firstName,
        last_name: lawyer.lastName,
        email: lawyer.email,
        password: HASHED_PASSWORD,
        user_type: "lawyer",
        status: "active",
        phone: lawyer.phone,
        profile_image: lawyer.profileImage,
        birth_date: new Date(lawyer.birthDate),
        lawyerDetails: {
          create: {
            license_number: lawyer.license,
            specialty: lawyer.specialty,
            experience: lawyer.experience,
            biography: lawyer.biography,
            linkedin: lawyer.linkedin,
          },
        },
        userDetails: {
          create: {
            gender: lawyer.gender,
            birth_date: new Date(lawyer.birthDate),
            Preference: {
              create: {
                communication_channel: "email",
                receive_notifications: true,
                notification_channels: "email",
              },
            },
            Locations: {
              create: {
                country: "Peru",
                state: "Junín",
                city: "Huancayo",
                latitude: -12.065,
                longitude: -75.204,
              },
            },
          },
        },
      },
    });
  }

  // CREACIÓN DE SERVICIOS Y CASOS
  const caseCategories = await prisma.caseCategories.findMany();
  const caseStatuses = await prisma.caseStatuses.findMany();

  if (caseCategories.length === 0 || caseStatuses.length === 0) {
    throw new Error(
      "No se encontraron categorías o estados de caso. Asegúrate de que se hayan creado primero."
    );
  }

  const clientUserDetailsId = 1;
  const lawyerUserDetailsId = 25;

  for (let i = 1; i <= 40; i++) {
    const serviceId = 100 + i;
    const caseId = 100 + i;
    const isPublic = i <= 20;

    const categoryId = caseCategories[(i - 1) % caseCategories.length].id;
    const statusId =
      caseStatuses.find((s) => s.name === "Registrado")?.id ||
      caseStatuses[0].id;

    await prisma.services.create({
      data: {
        id: serviceId,
        type: "case",
        lawyer_id: lawyerUserDetailsId,
        client_id: clientUserDetailsId,
        cases: {
          create: {
            id: caseId,
            title: `Caso ${isPublic ? "público" : "privado"} ${
              isPublic ? i : i - 20
            }`,
            description: `Descripción del caso ${
              isPublic ? "público" : "privado"
            } ${isPublic ? i : i - 20}`,
            category_id: categoryId,
            urgency: "media",
            status_id: statusId,
            is_public: isPublic,
            reference_code: `RC${caseId}`,
          },
        },
      },
    });
  }

  console.log(`\n Seeding completado con éxito.`);
}
// --- EJECUCIÓN DEL SCRIPT ---
main()
  .catch((e) => {
    console.error(" Error durante el proceso de seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
