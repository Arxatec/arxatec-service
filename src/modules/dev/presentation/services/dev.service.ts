import { exec } from "child_process";
import { promisify } from "util";

/**
 * Ejecuta el comando de seeding de la base de datos (`npx prisma db seed`),
 * utilizando un proceso hijo del sistema. Captura la salida estándar (stdout) y la salida
 * de error (stderr) del comando para devolverlas como resultado.
 */

const execPromise = promisify(exec);

const seedDatabase = async (): Promise<{ stdout: string; stderr: string }> => {
  try {
    console.log("Iniciando el comando de seeding de Prisma...");
    const { stdout, stderr } = await execPromise("npx prisma db seed");
    if (stderr && !stderr.includes("The seed command has been executed.")) {
      console.error(`Salida de error inesperada durante el seeding: ${stderr}`);
    }
    console.log(`Salida del seeding: ${stdout}`);

    return { stdout, stderr };
  } catch (error) {
    console.error("Fallo catastrófico al ejecutar el proceso de seed:", error);
    throw new Error("El script de seed no pudo ejecutarse.");
  }
};

export const DevService = {
  seedDatabase,
};
