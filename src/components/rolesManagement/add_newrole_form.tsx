import { hideNewRoleAddForm } from "@/lib/global-redux/features/uiSlice";
import { AddRolesApi, fetchAllRolesDataApi } from "@/services/apis";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner"; // Install if not already present
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AddNewRoleModal = () => {
    const dispatch = useDispatch();
    const [roleName, setRoleName] = useState("");
    const [roleShortName, setRoleShortName] = useState("");
    const [roleTypeId, setRoleTypeId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const token = Cookies.get("access_token");

    const AddRole = async () => {
        try {
            const requestBody = JSON.stringify({ role_name: roleName, role_sort_name: roleShortName, role_type_id: roleTypeId });
            console.log("Request Body:", requestBody);
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

            dispatch(hideNewRoleAddForm());
            toast.success("Role added successfully!", {
                style: { backgroundColor: "#28a745", color: "white", border: "none" },
            });
            return response.data;
        } catch (error) {
            console.error("Full Error Response:", error.response?.data);
            toast.error(`Error: ${error.response?.data?.message || "Failed to add role"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => dispatch(hideNewRoleAddForm());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roleName.trim()) {
            toast.error("Role name cannot be empty");
            return;
        }
        setIsSubmitting(true);
        try {
            await AddRole();
            queryClient.invalidateQueries();
        } catch (error) { }
    };

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

    return (
        <div className="fixed top-0 left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
            <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <h6 className="text-[14px] font-semibold text-[var(--blue)]">Add New Role</h6>
                    <button onClick={handleModalClose} className="dark:text-black">X</button>
                </div>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                        autoFocus
                        disabled={isSubmitting}
                    />
                    <input
                        type="text"
                        className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="Role Short Name"
                        value={roleShortName}
                        onChange={(e) => setRoleShortName(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <select
                        value={roleTypeId || ""}
                        onChange={(e) => setRoleTypeId(e.target.value)}
                        className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        required
                        disabled={isSubmitting}
                    >
                        <option value="" disabled>
                            Select Role
                        </option>

                        {rolesLoading ? (
                            <option disabled>Loading...</option>
                        ) : rolesError ? (
                            <option disabled>Something went wrong</option>
                        ) : (
                            rolesData?.data.items.map((role) => (
                                <option value={role.id} key={role.id}>{role.role_name}</option>
                            ))
                        )}
                    </select>

                    <div className="flex gap-4 mt-3 justify-end">
                        <button
                            className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black"
                            type="button"
                            onClick={handleModalClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewRoleModal;