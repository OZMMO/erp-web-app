import { IPagination } from "@/lib/interfaces/paginations.interface";
import { Direccion } from "../../sat/direcciones/direccion";

export interface Empresa extends IPagination{
  id: number;
  codigo: string;
  rfc: string;
  razon_social: string;
  nombre_comercial?: string;
  tipo_contribuyente_id?: string;
  tipo_contribuyente?: string;
  curp?: string;
  correo_electronico: string;
  telefono?: string;
  representante_legal?: string;
  certificado_csd?: string;
  llave_privada_csd?: string;
  contrasena_csd?: string;
  fecha_registro?: Date;
  estatus?: boolean;
  regimen_fiscal_id?: number;
  regimen_fiscal?: string;
  direccion?: Direccion;
  UserId?: string;
} 
