
import { z } from "zod";

export const RegisterSchema = z.strictObject({
  correo_electronico: z.string().email(),       
  password: z.string().min(6),    
  nombres: z.string().min(2),        
  rol: z.enum(["CLIENTE", "ABOGADO"]),  
  apellidos: z.string().min(2),   
  registro_nacional: z.string().optional(), 
  especialidades: z.array(z.string()).optional()  
});


export type RegisterDTO = z.infer<typeof RegisterSchema>;
