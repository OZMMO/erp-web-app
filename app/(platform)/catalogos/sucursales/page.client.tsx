'use client';

// Example usage in your page component:
import {SupabaseCRUD, Column} from '@/components/supabase-crud';
import { useEffect, useState } from 'react';
import { Database, Tables } from "@/database.types";
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createServer, deleteServer, updateServer } from './actions';

// // Define your data type
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   created_at: string;
// }

type Empresa = Database['catalogos']['Tables']['tbl_empresas']['Row'];


// interface CustomColumn<T> {
//   key: keyof T;
//   label: string;
//   sortable: boolean;
//   render?: (value: T[keyof T]) => ReactNode;
//   accessorKey?: keyof T;
// }

// Define your columns
const columns: Column<Empresa>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'razon_social', label: 'Razón Social', sortable: true },
  { key: 'nombre_comercial', label: 'Nombre Comercial', sortable: true }, 
  { key: 'rfc', label: 'RFC', sortable: true },
  { key: 'correo_electronico', label: 'Correo', sortable: true },
  { key: 'telefono', label: 'Teléfono', sortable: true },
  { 
    key: 'fecha_registro',
    label: 'Fecha Registro', 
    sortable: true,
    render: (value: string | number | boolean | null) => 
      value && typeof value !== 'boolean' ? new Date(value.toString()).toLocaleDateString() : ''
  },
  { key: 'estatus', label: 'Estatus', sortable: true }
];

// |Your form component
const EmpresaForm = ({ 
  initialData = null, 
  onSubmit, 
  errors 
}: { 
  initialData?: Empresa | null,
  onSubmit: (data: Empresa) => void, 
  errors?: Record<string, string[]> 
}) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Handle form submission
    }}>
      {/* Your form fields */}
    </form>
  );
};

interface PageProps {
  payload: IResponseModel<Empresa[]>;
  paginationParams: IPageSearchPaginationParams;
}

export default function EmpresasClientPage({ payload, paginationParams }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <SupabaseCRUD<Empresa, null>
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={EmpresaForm}
      jsClassName="Empresa"
      actions={{
        create: createServer,
        update: updateServer,
        delete: deleteServer,
      }}
    />
  );
}