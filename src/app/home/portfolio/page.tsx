"use client";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/data-table";
import { Payment, columns } from "@/components/columns";
import { useEffect, useState } from "react";
import { fetchControlsByStandardApi } from "@/services/apis";
// Importing the API function

function updateData(data: Payment[], updatedRow: Payment): Payment[] {
    return data.map(row => {
        if (row.id === updatedRow.id) {
            return updatedRow;
        } else if (row.subRows) {
            return {
                ...row,
                subRows: updateData(row.subRows, updatedRow),
            };
        }
        return row;
    });
}

// Breadcrumb Component to avoid invalid hook usage
function Breadcrumbs() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                </BreadcrumbItem>
                {lastSegment && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {decodeURIComponent(lastSegment).replace(/-/g, " ")}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default function Page() {
    const [data, setData] = useState<Payment[]>([]);

    const stdId = Cookies.get("std_id");
    console.log("std id ", stdId);
    useEffect(() => {
        if (stdId) {
            fetchControlsByStandardApi(stdId).then((fetchedData) => {
                const transformedData = fetchedData.map(control => ({
                    id: control.ctrl_id.toString(),
                    appRevAreaName: control.ctrl_name,
                    revAreaDetails: "", // Adjust this if details exist in API response
                    applicable: control.applicable ? "Yes" : "No",
                    justification: control.justification,
                    subRows: [], // Handle nested data if applicable
                }));
                setData(transformedData);
                console.log("api", data);
            });
        }
    }, [stdId]);

    return (
        <div className="flex flex-col w-full">
            <header className="flex flex-col h-16 shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <Breadcrumbs />
                </div>
            </header>
            <div className="py-0 w-full px-4">
                <DataTable
                    columns={columns}
                    data={data}
                    onEdit={(updatedRow) => {
                        setData(prev => updateData(prev, updatedRow as Payment));
                    }}
                />
            </div>
        </div>
    );
}
