import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination: {
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true, // Tell TanStack table we handle pagination server-side
        pageCount: pagination.last_page,
    });

    return (
        <div className="space-y-4">
            <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-black font-bold text-lg border-r-2 border-black last:border-r-0">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="border-r-2 border-black last:border-r-0 text-lg">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-lg"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-gray-600 font-vt323 text-lg">
                    Showing {pagination.from} to {pagination.to} of {pagination.total} entries
                </div>
                <div className="flex space-x-2">
                    {pagination.prev_page_url && (
                        <Link href={pagination.prev_page_url}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-vt323 text-lg"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                        </Link>
                    )}
                    
                    {pagination.next_page_url && (
                        <Link href={pagination.next_page_url}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-vt323 text-lg"
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
