import { direccionSchema } from "@/lib/db/sat/direcciones/schema";
import { z } from "zod";

export const sucursalSchema = z.object({
  id: z.number().int().optional(),
  empresa_id: z.number().int().nullable().optional(),
  codigo: z.string(),
  nombre: z.string(),
  telefono: z.string().optional(),
  correo_electronico: z.string().email().optional(),
  responsable: z.string().optional(),
  estatus: z.boolean(),
  direccion: direccionSchema.optional(),
});
