"use client";
import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { createProveedor, deleteProveedor, updateProveedor } from "./actions";
import { ProveedorForm } from "./proveedor-form";
import { Proveedor } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
// import { Bodega } from '@/lib/db/catalogos/bodega.model';
// import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<Proveedor>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: "codigo", label: "Código", sortable: true },
  { key: "nombre", label: "Nombre", sortable: true },
  { key: "contacto", label: "Contacto", sortable: true },
  { key: "telefono", label: "Teléfono", sortable: true },
  { key: "email", label: "Email", sortable: true },
  // { key: "direccion", label: "Dirección", sortable: true },
  { key: 'estatus', label: 'Estatus', sortable: true,
    render: (value: any) => {
      const status = (typeof value === 'object' && value !== null && 'estatus' in value) 
        ? value.estatus 
        : value;

      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Activo" : "Inactivo"}
        </Badge>
      );
    }
   },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
}

export interface ProveedorInfoExtra {}

export default function ProveedoresClientPage({
  payload,
  paginationParams,
}: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <CRUD<Proveedor, ProveedorInfoExtra>
      title="Catálogo de Proveedores"
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={ProveedorForm}
      // jsClassName="Empresa"
      actions={{
        create: createProveedor,
        update: updateProveedor,
        delete: deleteProveedor,
      }}
      infoExtra={{}}
    />
  );
}
