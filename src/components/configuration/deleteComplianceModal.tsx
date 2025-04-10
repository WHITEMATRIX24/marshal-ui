import React, { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { deleteControlsApi } from "@/services/apis";
import { useQueryClient } from "@tanstack/react-query";
interface DeleteModalProps {
    compliance_id: number | null;
    isOpen: boolean;
    onClose: () => void;
    onDeleteSuccess: (deletedCtrlId: number) => void;
}

const DeletecomplianceModal: React.FC<DeleteModalProps> = ({
    compliance_id,
    isOpen,
    onClose,
    onDeleteSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const deleteControl = async () => {
        console.log("Deleting compliance with ID:", compliance_id); // Debugging line

        if (!compliance_id) {
            toast.error("Invalid compliance ID");
            return;
        }

        const token = Cookies.get("access_token");
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        };

        const urlEndpoint = `/compliance/compliance-periods/${compliance_id}`;
        const method = "DELETE";

        try {
            setLoading(true);
            const response = await deleteControlsApi({
                method,
                urlEndpoint,
                headers,
            });

            if (response?.status === 204) {
                toast.success("Successfully deleted", {
                    style: { backgroundColor: "#28a745", color: "white", border: "none" },
                });
                queryClient.invalidateQueries();
                onDeleteSuccess(compliance_id);
                onClose();
            } else {
                throw new Error("Failed to delete control");
            }
        } catch (error) {
            toast.error("Error deleting control", {
                style: { backgroundColor: "#dc3545", color: "white", border: "none" },
            });

            console.error("Error deleting control:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-[#e5e5e5] dark:border dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <h6 className="text-[14px] font-semibold text-[var(--blue)] py-2">
                        Are you sure?
                    </h6>
                    <button onClick={onClose} className="dark:text-black">X</button>
                </div>
                <p className="text-gray-600 mb-4 text-[12px] dark:text-black">
                    You are about to delete this item. This action cannot be undone.
                </p>
                <div className="flex gap-4 mx-auto mt-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black"
                        type="reset"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
                        onClick={deleteControl}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletecomplianceModal;
