"use client";
import { hideEditTaskModal } from "@/lib/global-redux/features/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { RootState } from "@/lib/global-redux/store";
import { X } from "lucide-react";
import { editTaskApi } from "@/services/apis";

const EditTaskModal = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const token = Cookies.get("access_token");

    const taskEditData = useSelector(
        (state: RootState) => state.ui.editTaskModal.data
    );

    const [formData, setFormData] = useState({
        actual_startdate: taskEditData?.actual_startdate || "",
        end_date: taskEditData?.end_date || "",
        status: taskEditData?.status || "",
        action: taskEditData?.action || "",
    });

    const handleModalClose = () => dispatch(hideEditTaskModal());

    const { mutateAsync: editTask } = useMutation({
        mutationFn: editTaskApi,
        onError: () => toast.error("Something went wrong"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["task"] });
            toast.success("Task updated successfully", {
                style: {
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                },
            });
            handleModalClose();
        },
    });

    const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { actual_startdate, end_date, status, action } = formData;

        if (!actual_startdate || !end_date || !status || !action)
            return toast.warning("Please fill all fields");

        editTask({
            method: "PUT",
            urlEndpoint: `/taskdetail/details/${taskEditData?.id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: formData,
        });
    };

    return (
        <div className="fixed top-0 left-0 h-full w-full bg-black/50 flex justify-center items-center z-10">
            <div className="flex flex-col gap-2 w-full md:w-[25rem] bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <h6 className="text-[14px] font-semibold text-[var(--blue)]">
                        Edit Task
                    </h6>
                    <button onClick={handleModalClose} className="dark:text-black">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleEditTask} className="flex flex-col gap-2">
                    <input
                        type="date"
                        value={formData.actual_startdate}
                        onChange={(e) =>
                            setFormData({ ...formData, actual_startdate: e.target.value })
                        }
                        className="px-2 py-1 border rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="Actual Start Date"
                    />
                    <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) =>
                            setFormData({ ...formData, end_date: e.target.value })
                        }
                        className="px-2 py-1 border rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="End Date"
                    />
                    <input
                        type="text"
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                        }
                        className="px-2 py-1 border rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="Status"
                    />
                    <input
                        type="text"
                        value={formData.action}
                        onChange={(e) =>
                            setFormData({ ...formData, action: e.target.value })
                        }
                        className="px-2 py-1 border rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                        placeholder="Action"
                    />

                    <div className="flex gap-4 mt-3 justify-end">
                        <button
                            type="reset"
                            onClick={handleModalClose}
                            className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
