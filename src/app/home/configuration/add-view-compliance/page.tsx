"use client";
import React from "react";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import Cookies from "js-cookie";
import { Pencil, Trash } from "lucide-react";
import { ViewComplianceTable } from "@/components/configuration/viewCompliance";
import { getAllComplianceApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/formater";

export interface Compliance {
    id: number;
    compliance_title: string;
    gov_id: number;
    std_id: number;
    compliance_startdate: string;
    compliance_enddate: string;
    compliance_year: string;
    is_active: boolean;
}

const ViewCompliance = () => {
    const token = Cookies.get("access_token");

    const { data, isLoading, error } = useQuery({
        queryKey: ["clientroles"],
        queryFn: async () =>
            await getAllComplianceApi({
                method: "GET",
                urlEndpoint: "/compliance/compliance-periods",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    const compliance: Compliance[] = data?.data?.items || [];
    const columnsData = [
        {
            accessorKey: "compliance_title",
            header: "Title",
        },
        {
            accessorKey: "gov_id",
            header: "Gov ID",
        },
        {
            accessorKey: "std_id",
            header: "Standard ID",
        },
        {
            accessorKey: "compliance_startdate",
            header: "Start Date",
            cell: ({ row }: any) => formatDate(row.original.compliance_startdate),
        },
        {
            accessorKey: "compliance_enddate",
            header: "End Date",
            cell: ({ row }: any) => formatDate(row.original.compliance_enddate),
        },
        {
            accessorKey: "compliance_year",
            header: "Year",
        },
        {
            accessorKey: "actions",
            id: "actions",
            header: "Actions",
            cell: ({ row }: any) => (
                <div className="flex w-full justify-center gap-2">
                    <Pencil className="h-4 w-4 text-blue-900 cursor-pointer" />
                    <Trash className="h-4 w-4 text-[var(--red)] cursor-pointer" />
                </div>
            ),
        },
    ];
    return (
        <div className="flex flex-col w-full mb-[50px]">
            <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <BreadCrumbsProvider />
                </div>
            </header>
            <div className="py-0 w-full px-4">
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Something went wrong ...</p>
                ) : (
                    <ViewComplianceTable columns={columnsData} data={compliance} />
                )}
            </div>
        </div>
    );
};

export default ViewCompliance;
