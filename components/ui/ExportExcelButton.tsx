"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportExcelButtonProps {
    data: any[];
    fileName: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    onFetchAll?: () => Promise<any[]>;
}

export function ExportExcelButton({
    data,
    fileName,
    className,
    variant = "outline",
    size = "sm",
    onFetchAll
}: ExportExcelButtonProps) {
    const [loading, setLoading] = useState(false);

    const processData = (dataToExport: any[]) => {
        return dataToExport.map(item => {
            const flat: any = {};

            const processObject = (obj: any, prefix = '') => {
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        const value = obj[key];
                        const newKey = prefix ? `${prefix}_${key}` : key;

                        if (value === null || value === undefined) {
                            flat[newKey] = "";
                        } else if (value instanceof Date) {
                            flat[newKey] = format(value, "yyyy-MM-dd HH:mm:ss");
                        } else if (typeof value === 'object' && !Array.isArray(value)) {
                            processObject(value, newKey);
                        } else if (Array.isArray(value)) {
                            flat[newKey] = value.map((v: any) =>
                                typeof v === 'object' ? JSON.stringify(v) : String(v)
                            ).join(", ");
                        } else {
                            flat[newKey] = String(value);
                        }
                    }
                }
            };

            processObject(item);
            return flat;
        });
    };

    const handleExport = async (dataToExport: any[], customFileName?: string) => {
        setLoading(true);
        try {
            const flattenedData = processData(dataToExport);

            const worksheet = XLSX.utils.json_to_sheet(flattenedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

            // Generate timestamp
            const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
            const finalName = `${customFileName || fileName}_${timestamp}.xlsx`;

            XLSX.writeFile(workbook, finalName);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportAll = async () => {
        if (!onFetchAll) return;
        setLoading(true); // Manually set loading here since handleExport also toggles it but we want to show it while fetching
        try {
            const allData = await onFetchAll();
            await handleExport(allData, `${fileName}_ALL`);
        } catch (error) {
            console.error("Failed to fetch all data:", error);
            setLoading(false);
        }
    };

    if (onFetchAll) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={variant}
                        size={size}
                        className={className}
                        disabled={loading}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {loading ? "Exporting..." : "Export"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                    <DropdownMenuItem onClick={() => handleExport(data)}>
                        Export Current Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportAll}>
                        Export All Data
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={() => handleExport(data)}
            disabled={loading || !data || data.length === 0}
        >
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Exporting..." : "Export to Excel"}
        </Button>
    );
}
