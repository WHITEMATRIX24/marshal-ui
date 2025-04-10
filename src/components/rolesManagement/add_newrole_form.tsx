import { hideNewRoleAddForm } from "@/lib/global-redux/features/uiSlice";
import { AddRolesApi, createRoleWithFileApi, downloadClientRoleExcelTemplateApi, fetchAllRolesDataApi } from "@/services/apis";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
const AddNewRoleModal = () => {
    const dispatch = useDispatch();
    const [roleName, setRoleName] = useState("");
    const [roleShortName, setRoleShortName] = useState("");
    const [roleTypeId, setRoleTypeId] = useState("");
    const queryClient = useQueryClient();
    const [roleExcelFile, setRoleExcelFile] = useState<File | null>(null);
    const token = Cookies.get("access_token");
    interface Role {
        id: number;
        role_name: string;
    }
    const mutation = useMutation({
        mutationFn: async (variables: { roleName: string; roleShortName: string; roleTypeId: number }) => {
            const { roleName, roleShortName, roleTypeId } = variables;
            const requestBody = JSON.stringify({
                role_name: roleName,
                role_sort_name: roleShortName,
                role_type_id: roleTypeId
            });

            const response = await AddRolesApi({
                method: "POST",
                urlEndpoint: "/clientrole/client-roles",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                data: requestBody,
            });

            if (!response?.data) {
                throw new Error("Failed to add role");
            }
            return response.data;
        },
        onSuccess: () => {
            dispatch(hideNewRoleAddForm());
            queryClient.invalidateQueries({ queryKey: ["clientroles"] });
            toast.success("Role added successfully!", {
                style: { backgroundColor: "#28a745", color: "white", border: "none" },
            });
        },
        onError: (error) => {
            console.error("Error adding role:", error);
            toast.error("Failed to add role");
        }
    });

    const handleModalClose = () => dispatch(hideNewRoleAddForm());
    const { data: rolesData, isLoading: rolesLoading, isError: rolesError } = useQuery({
        queryKey: ["allroles"],
        queryFn: async () =>
            await fetchAllRolesDataApi({
                method: "GET",
                urlEndpoint: "/role/roles",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
    });
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const { mutateAsync: createRoleWithFile, isPending: createRoleWithFilePending } = useMutation({
        mutationFn: createRoleWithFileApi,
        onSuccess: () => {
            dispatch(hideNewRoleAddForm());
            queryClient.invalidateQueries({ queryKey: ["clientroles"] });
            toast.success("Roles imported successfully!", {
                style: { backgroundColor: "#28a745", color: "white", border: "none" },
            });
        },
        onError: (error) => {
            console.error("Error importing roles:", error);
            toast.error(error.message || "Failed to import roles", {
                style: { backgroundColor: "#ff5555", color: "white", border: "none" },
            });
        }
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
            setRoleExcelFile(file);
        }
    };

    const handleCreateWithFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!roleExcelFile) {
            toast.warning("Please select an Excel file");
            return;
        }

        const formData = new FormData();
        formData.append("file", roleExcelFile);

        try {
            await createRoleWithFile({
                method: "POST",
                urlEndpoint: "/clientrole/client-roles/import/excel",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                data: formData,
            });
        } catch (error) {
            console.error("File upload error:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!roleName.trim() || !roleShortName.trim() || !roleTypeId) {
            toast.error("Please fill all required fields");
            return;
        }
        mutation.mutate({ roleName, roleShortName, roleTypeId: Number(roleTypeId) });
    };
    //download template 
    const exportMutation = useMutation<AxiosResponse, Error, void>({
        mutationFn: () =>
            downloadClientRoleExcelTemplateApi({
                method: "GET",
                urlEndpoint: "/clientrole/client-roles/import/template",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            }),
        onSuccess: (response) => {
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "client_roles.xlsx");
        },
    });
    return (
        <div className="fixed top-0 left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
            <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <h6 className="text-[14px] font-semibold text-[var(--blue)]">Add New Role</h6>
                    <button onClick={handleModalClose} className="dark:text-black">X</button>
                </div>
                <form className="flex flex-col gap-2" onSubmit={roleExcelFile ? handleCreateWithFile : handleSubmit}>
                    <input
                        type="text"
                        className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        autoFocus
                        disabled={mutation.isPending || createRoleWithFilePending}
                    />
                    <input
                        type="text"
                        className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="Role Short Name"
                        value={roleShortName}
                        onChange={(e) => setRoleShortName(e.target.value)}
                        disabled={mutation.isPending || createRoleWithFilePending}
                    />
                    <select
                        value={roleTypeId || ""}
                        onChange={(e) => setRoleTypeId(e.target.value)}
                        className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        disabled={mutation.isPending}
                    >
                        <option value="" disabled>
                            Select Role
                        </option>
                        {rolesLoading ? (
                            <option disabled>Loading...</option>
                        ) : rolesError ? (
                            <option disabled>Something went wrong</option>
                        ) : (
                            rolesData?.data?.items.map((role: Role) => (
                                <option value={role.id} key={role.id}>{role.role_name}</option>
                            ))
                        )}
                    </select>
                    <div className="relative my-0">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-[#E5E5E5] text-[10px] text-gray-500 dark:text-gray-400">
                                OR
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">

                        <div className="flex items-center gap-2 min-w-0">
                            <input
                                type="file"
                                id="excel-upload"
                                hidden
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('excel-upload')?.click()}
                                className="py-1 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap"
                                disabled={mutation.isPending || createRoleWithFilePending}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 24"
                                    fill="currentColor"
                                >
                                    <path d="M13 11h-2v3H8v2h3v3h2v-3h3v-2h-3zm1-9H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                                </svg>
                                Import from Excel
                            </button>
                            {selectedFileName && (
                                <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                    {selectedFileName}
                                </span>
                            )}
                        </div>

                        <button
                            className="cursor-pointer bg-transparent text-[var(--blue)] text-[10px] px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 group justify-self-end"
                            onClick={(e) => {
                                e.preventDefault();
                                exportMutation.mutate();
                            }}
                            disabled={exportMutation.isPending}
                            type="button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 group-hover:translate-y-0.5 transition-transform text-[var(--blue)]"
                                viewBox="0 0 20 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            {exportMutation.isPending ? "Downloading..." : "Template"}
                        </button>

                    </div>

                    <div className="flex gap-4 mt-3 justify-end">
                        <button
                            className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black"
                            type="button"
                            onClick={handleModalClose}
                            disabled={mutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
                            type="submit"
                            disabled={mutation.isPending || createRoleWithFilePending}
                        >
                            {mutation.isPending || createRoleWithFilePending
                                ? "Submitting..."
                                : "Submit"}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default AddNewRoleModal;