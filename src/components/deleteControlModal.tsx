import React, { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";;
import { deleteControlsApi } from "@/services/apis";

interface DeleteModalProps {
    ctrlId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onDeleteSuccess: (deletedCtrlId: number) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    ctrlId,
    isOpen,
    onClose,
    onDeleteSuccess
}) => {
    const [loading, setLoading] = useState(false);

    const deleteControl = async () => {
        if (!ctrlId) return;

        const token = Cookies.get("access_token");
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,

        };

        const urlEndpoint = `/controls/${ctrlId}`;
        const method = "DELETE";

        try {
            setLoading(true);
            const response = await deleteControlsApi({
                method,
                urlEndpoint,
                headers,
            });

            if (!response?.data) {
                throw new Error("Failed to delete control");
            }

            toast.success("Successfully deleted", {
                style: { backgroundColor: "#28a745", color: "white", border: "none" },
            });
            onDeleteSuccess(ctrlId);
            onClose();

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
            <div className="bg-white p-6 rounded-lg shadow-lg w-96  dark:bg-black dark:border dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <h6 className="text-[14px] font-semibold py-2" >Are you sure?</h6>
                    <button onClick={onClose}>X</button>
                </div>
                <p className="text-gray-600 mb-4 text-[12px] dark:text-gray-300">
                    You are about to delete this item. This action cannot be undone.
                </p>
                <div className="flex gap-4 mx-auto mt-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-0.5 bg-transparent border border-black text-black text-[12px] rounded-[5px] dark:text-white dark:bg-[var(--table-bg-even)]"
                        type="reset"
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-0.5 bg-black text-white border-black text-[12px] rounded-[5px] dark:text-white dark:bg-[var(--table-bg-even)]"
                        onClick={deleteControl}
                        disabled={loading}>
                        {loading ? "Deleting..." : "Confirm"}
                    </button>
                </div>


            </div>
        </div>
    );
};

export default DeleteModal;