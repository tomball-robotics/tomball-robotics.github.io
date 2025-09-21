import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | 'actions';
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  getKey: (item: T) => string; // Function to get a unique key/id for each item
}

export function DataTable<T extends { id?: string }>({
  data,
  columns,
  onEdit, // Keep for potential simpler use cases, but render function takes precedence
  onDelete, // Keep for potential simpler use cases, but render function takes precedence
  getKey,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border overflow-x-auto"> {/* Added overflow-x-auto here */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((item) => (
              <TableRow key={getKey(item)}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {/* Prioritize the custom render function if provided */}
                    {column.render ? (
                      column.render(item)
                    ) : (
                      // Fallback to default rendering if no custom render function
                      column.key === 'actions' ? (
                        <div className="flex space-x-2">
                          {onEdit && (
                            <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && item.id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this item.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => onDelete(item.id!)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      ) : (
                        item[column.key] as React.ReactNode
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}