"use client";

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

// Async function to fetch data
async function getData(): Promise<Payment[]> {
    return [
        {
            id: "1",
            appRevAreaName: "Architecture",
            revAreaDetails: "Application Architecture",
            applicable: "Yes",
            justification: "nil",
            subRows: [
                {
                    id: "1-1",
                    appRevAreaName: "Sub Area 1.1",
                    revAreaDetails: "Sub Details 1.1",
                    applicable: "No",
                    justification: "Optional",
                    subRows: [
                        {
                            id: "1-1-1",
                            appRevAreaName: "Sub Sub Area 1.1.1",
                            revAreaDetails: "Sub Details 1.1.1",
                            applicable: "Yes",
                            justification: "Important",
                        },
                    ],
                },
            ],
        },
        {
            id: "2",
            appRevAreaName: "Main Area 2",
            revAreaDetails: "Details 2",
            applicable: "No",
            justification: "Not Required",
        },
    ];
}

// Breadcrumb Component to avoid invalid hook usage
function Breadcrumbs() {
    const pathname = usePathname(); // Use hook inside a valid function component
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

    useEffect(() => {
        getData().then(setData);
    }, []);

    return (
        <div className="flex flex-col w-full">
            <header className="flex flex-col h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">

                <div className="flex items-center gap-2 px-4">
                    <Breadcrumbs />
                </div>
            </header>
            <div className="py-10 w-full px-4">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
}
