import {
  createClientWithCases,
  createLawyerWithCasesAndClients,
  clearData,
} from "../data/seed.repository";

export async function seedClientWithCases() {
  try {
    console.log("🧹 Limpiando datos anteriores...");
    await clearData();

    console.log("🌱 Creando semilla de cliente con 30 casos...");
    const result = await createClientWithCases();

    console.log("✅ Semilla completada exitosamente:");
    console.log(`   - Cliente creado: ${result.client.email}`);
    console.log(`   - Categorías de casos: ${result.categories}`);
    console.log(`   - Estados de casos: ${result.statuses}`);
    console.log(`   - Casos creados: ${result.cases}`);
    console.log(`   - Historiales creados: ${result.histories}`);

    return result;
  } catch (error) {
    console.error("❌ Error en la semilla:", error);
    throw error;
  }
}

export async function seedLawyerWithCasesAndClients() {
  try {
    console.log("🧹 Limpiando datos anteriores...");
    await clearData();

    console.log("🌱 Creando semilla de abogado con 20 casos y 25 clientes externos...");
    const result = await createLawyerWithCasesAndClients();

    console.log("✅ Semilla de abogado completada exitosamente:");
    console.log(`   - Abogado creado: ${result.lawyer.email}`);
    console.log(`   - Nombre: ${result.lawyer.first_name} ${result.lawyer.last_name}`);
    console.log(`   - Especialidad: ${result.lawyer.lawyer_details?.specialty}`);
    console.log(`   - Clientes externos creados: ${result.externalClients}`);
    console.log(`   - Servicios creados: ${result.services}`);
    console.log(`   - Casos creados: ${result.cases}`);

    return result;
  } catch (error) {
    console.error("❌ Error en la semilla de abogado:", error);
    throw error;
  }
}

export async function seedAll() {
  try {
    console.log("🧹 Limpiando todos los datos anteriores...");
    await clearData();

    console.log("\n🌱 Creando semilla completa...\n");

    console.log("📋 Paso 1: Creando cliente con casos...");
    const clientResult = await createClientWithCases();
    console.log("✅ Cliente creado exitosamente");

    console.log("\n⚖️  Paso 2: Creando abogado con casos y clientes externos...");
    const lawyerResult = await createLawyerWithCasesAndClients();
    console.log("✅ Abogado creado exitosamente");

    console.log("\n🎉 Semilla completa finalizada:");
    console.log("\n📊 Resumen:");
    console.log(`   Cliente: ${clientResult.client.email}`);
    console.log(`   - Casos del cliente: ${clientResult.cases}`);
    console.log(`\n   Abogado: ${lawyerResult.lawyer.email}`);
    console.log(`   - Clientes externos: ${lawyerResult.externalClients}`);
    console.log(`   - Casos del abogado: ${lawyerResult.cases}`);
    console.log(`\n   Total de casos en el sistema: ${clientResult.cases + lawyerResult.cases}`);

    return {
      client: clientResult,
      lawyer: lawyerResult,
    };
  } catch (error) {
    console.error("❌ Error en la semilla completa:", error);
    throw error;
  }
}

