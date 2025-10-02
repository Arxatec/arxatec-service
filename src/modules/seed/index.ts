export {
  seedClientWithCases,
  seedLawyerWithCasesAndClients,
  seedAll,
} from "./presentation/seed.service";
export {
  createClientWithCases,
  createLawyerWithCasesAndClients,
  clearData,
} from "./data/seed.repository";

// Auto-execute seed when run directly
import { seedAll } from "./presentation/seed.service";

async function main() {
  try {
    await seedAll();
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando la semilla:", error);
    process.exit(1);
  }
}

main();
