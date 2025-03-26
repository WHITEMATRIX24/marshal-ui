"use client";

import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import React from "react";
import Cookies from "js-cookie";
import { fetchRolesApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import { RolesTypeDataTable } from "@/components/rolesManagement/roleTypeTable";

export interface Role {
    role_name: string;
    id: number;
    is_active: boolean;
}

const Role = () => {
    const token = Cookies.get("access_token");

    const { data, isLoading, error } = useQuery({
        queryKey: ["usersdata"],
        queryFn: async () =>
            await fetchRolesApi({
                method: "GET",
                urlEndpoint: "/role/roles",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    const activeRoles = data?.data?.items?.filter((role: Role) => role.is_active) || [];

    console.log("Filtered Active Roles:", activeRoles);

    const columnData = [
        {
            accessorKey: "role_name",
            header: "Role Name",
            id: "role_name",
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
                    <RolesTypeDataTable columns={columnData} data={activeRoles} />
                )}
            </div>
        </div>
    );
};

export default Role;
