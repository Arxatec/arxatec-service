import { createClientWithCases, clearData } from "../data/seed.repository";

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

async function main() {
  try {
    await seedClientWithCases();
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando la semilla:", error);
    process.exit(1);
  }
}

main();
