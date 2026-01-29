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

import { PaginationProps } from "@/types";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: PaginationProps<TData> | null;
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
        manualPagination: !!pagination, // Only manual if pagination props provided
        pageCount: pagination?.last_page ?? -1,
    });

    return (
        <div className="space-y-4">
            <div className="border-2 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-black dark:text-white font-bold text-lg border-r-2 border-black dark:border-white last:border-r-0"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
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
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="border-r-2 border-black dark:border-white last:border-r-0 text-lg"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-lg text-gray-500 dark:text-gray-400"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-vt323 text-lg">
                        Showing {pagination.from} to {pagination.to} of{" "}
                        {pagination.total} entries
                    </div>
                    <div className="flex space-x-2">
                        {pagination.prev_page_url && (
                            <Link href={pagination.prev_page_url}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-2 border-black dark:border-white text-black dark:text-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-gray-100 dark:hover:bg-gray-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-vt323 text-lg"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />{" "}
                                    Previous
                                </Button>
                            </Link>
                        )}

                        {pagination.next_page_url && (
                            <Link href={pagination.next_page_url}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-2 border-black dark:border-white text-black dark:text-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-gray-100 dark:hover:bg-gray-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-vt323 text-lg"
                                >
                                    Next{" "}
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
