import React, { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Trash2 } from "lucide-react";
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
                <p className="text-gray-600 mb-4">
                    You are about to delete this item. This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={deleteControl}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        {loading ? "Deleting..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;