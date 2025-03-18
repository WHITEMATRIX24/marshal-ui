"use client";

import AddNewRoleModal from "@/components/add_newrole_form";
import { RolesManagementDataTable } from "@/components/rolesManagement/role_management_datatable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { RootState } from "@/lib/global-redux/store";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const CreateUpdateRole = () => {
    const isModalVisible = useSelector(
        (state: RootState) => state.ui.addNewRoleOnRoleMenuModal
    );
    const columnData = [
        {
            accessorKey: "role_id",
            header: "Role Id",
            id: "role_id",
        },
        {
            accessorKey: "role_name",
            header: "Role Name",
            id: "role_name",
        },
        {
            id: "actions",
            header: "Actions",
            cell: () => (
                <div className="flex gap-2 ">
                    <Pencil
                        className="h-3 w-3 text-blue-900 cursor-pointer"

                    />
                    <Trash className="h-3 w-3 text-orange-500 cursor-pointer"
                    />
                </div>
            ),
        },
    ];
    const tableData = [
        {
            role_id: "test",
            role_name: "test",
        },
    ];

    return (
        <>
            <div className="flex flex-col w-full mb-[50px]">
                <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <BreadCrumbsProvider />
                    </div>
                </header>
                <div className="py-0 w-full px-4">
                    <RolesManagementDataTable columns={columnData} data={tableData} />
                </div>
            </div>
            {isModalVisible && <AddNewRoleModal />}
        </>
    );
};

export default CreateUpdateRole;
