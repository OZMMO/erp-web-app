'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils';
import TablePagination from '../tables/table-pagination';

// Placeholder type definitions
// Replace these with actual definitions as needed

type ModelType = string; // Example placeholder

export type ActionState<T> = {
  error?: Error;
  data?: T;
};

type FieldErrors<T> = Record<keyof T, string[]>;

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T]) => React.ReactNode;
}

interface CRUDProps<T extends { id: string | number }, TInfoExtra> {
  columns: Column<T>[];
  data: T[];  // Cambiamos a datos serializados
  jsClassName?: ModelType;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  actions: {
    create: (data: T) => Promise<ActionState<T>>;
    update: (data: T) => Promise<ActionState<T>>;
    delete: (data: T) => Promise<ActionState<T>>;
  };
  formComponent: React.ComponentType<{
    initialData?: T
    onSubmit: (data: T) => void
    errors?: FieldErrors<T>
    infoExtra?: TInfoExtra
  }>;
  searchable?: boolean;
  path?: string;
  formClassName?: string;
  infoExtra?: TInfoExtra;
  redirectMode?: boolean;  
}

export function CRUD<T extends { id: string | number }, TInfoExtra>({
  columns,
  data,
  jsClassName,
  totalCount,
  totalPages,
  currentPage,
  pageSize,
  actions,
  formComponent: FormComponent,
  searchable = true,
  formClassName,
  path,
  infoExtra,
  redirectMode = false
}: CRUDProps<T, TInfoExtra>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpenNew, setIsOpenNew] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [errors, setErrors] = useState<FieldErrors<T>>({} as FieldErrors<T>);

  const query = searchParams.get('query') || '';
  const orderByColumn = searchParams.get('orderByColumn') as keyof T || columns[0].key;
  const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc';

  const handleCreate = async (formData: T) => {
    try {
      const result = await actions.create(formData);
      if (result.error) throw result.error;
      toast.success('Item created successfully!');
      setIsOpenNew(false);
      router.refresh()
    } catch (error: any) {
      console.error('Error creating item:', error);
      toast.error(error.message);
      if (error.details) {
        setErrors({ ...error.details });
      }
    }
  };

  const handleUpdate = async (formData: T) => {
    console.log('update', {formData})
    try {
      const result = await actions.update(formData);
      if (result.error) throw result.error;
      toast.success('Item updated successfully!');
      setEditItem(null);
      router.refresh()  
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast.error(error.message);
      if (error.details) {
        setErrors({ ...error.details });
      }
    }
  };

  const handleDelete = async (item: T) => {
    setIsDeleting(String(item));
    try {
      const result = await actions.delete(item);
      if (result.error) throw result.error;
      toast.success('Item deleted successfully!');
      router.refresh()
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error(error.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });
    return newSearchParams.toString();
  };

  const onNew = () => {
    if (redirectMode) {
      router.push(`${path}/0`);
    } else {
      setIsOpenNew(true);
    }
  };

  const onEdit = (item: T) => {
    console.log('edit', {item})
    if (redirectMode) {
      router.push(`${path}/${String(item[columns[0].key])}`);
    } else {
      setEditItem(item);
    }
  };

  const renderCellContent = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item[column.key]);
    }
    const value = item[column.key];
    if (typeof value?.toLocaleString === 'function') {
      return value.toLocaleString();
    }
    return String(value || '');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {searchable && (
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search..."
              defaultValue={searchParams.get('query') || ''}
              onChange={(e) => {
                const query = createQueryString({
                  query: e.target.value,
                  page: 1,
                });
                router.push(`${pathname}?${query}`);
              }}
              className="max-w-sm"
            />
          </div>
        )}
        <Button variant="outline" onClick={onNew}>Add New</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actions</TableHead>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted' : ''}
                  onClick={() => {
                    if (column.sortable) {
                      const query = createQueryString({
                        orderByColumn: column.key as string,
                        orderDirection: orderByColumn === column.key && orderDirection === 'asc'
                          ? 'desc'
                          : 'asc',
                      });
                      router.push(`${pathname}?${query}`);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && orderByColumn === column.key && (
                      <span>{orderDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: T) => (
              <TableRow key={String(item[columns[0].key])}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" title="Eliminar registro">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-red-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente este registro
                            y todos sus datos relacionados de nuestros servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item)}
                            disabled={isDeleting === String(item[columns[0].key])}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                          >
                            {isDeleting === String(item[columns[0].key]) ? 'Eliminando...' : 'Eliminar'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={`${String(item[columns[0].key])}-${String(column.key)}`}>
                    {renderCellContent(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Sheet open={isOpenNew} onOpenChange={setIsOpenNew}>
        <SheetContent className={cn('w-[400px] sm:w-[540px] overflow-y-auto', formClassName)}>
          <SheetHeader>
            <SheetTitle>Add new</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <FormComponent
              onSubmit={handleCreate}
              errors={errors}
              infoExtra={infoExtra}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={editItem !== null} onOpenChange={(open) => !open && setEditItem(null)}>
        <SheetContent className={cn('w-[400px] sm:w-[540px] overflow-y-auto', formClassName)}>
          <SheetHeader>
            <SheetTitle>Editing</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <FormComponent
              initialData={editItem || undefined}
              onSubmit={handleUpdate}
              errors={errors}
              infoExtra={infoExtra}
            />
          </div>
          {/* <SheetFooter>
            <Button type="button" variant="outline" onClick={() => setEditItem(null)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>

      {/* <div className="flex items-center justify-between">
        <div>
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => {
              const query = createQueryString({ page: currentPage - 1 });
              router.push(`${pathname}?${query}`);
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => {
              const query = createQueryString({ page: currentPage + 1 });
              router.push(`${pathname}?${query}`);
            }}
          >
            Next
          </Button>
        </div>
      </div> */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={pageSize}
      />
    </div>
  );
}