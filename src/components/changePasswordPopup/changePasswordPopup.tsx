import { changePasswordApi } from "@/services/apis";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { hideChangePasswordForm } from "@/lib/global-redux/features/uiSlice";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";


const passwordRequirements = [
    { test: (val: string) => val.length >= 8, label: "8 characters" },
    { test: (val: string) => /[A-Z]/.test(val), label: "1 uppercase letter" },
    { test: (val: string) => /[a-z]/.test(val), label: "1 lowercase letter" },
    { test: (val: string) => /\d/.test(val), label: "1 number" },
    { test: (val: string) => /[^A-Za-z0-9]/.test(val), label: "1 special character" },
];

const ChangePasswordModal = () => {
    const dispatch = useDispatch();
    const token = Cookies.get("access_token");
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const failedRules = passwordRequirements.filter(r => !r.test(newPassword));
    const handleSuccessfulPasswordChange = () => {
        Cookies.remove("access_token");
        Cookies.remove("login_popup_initila_render");
        Cookies.remove("roles");
        Cookies.remove("selected_governance");
        Cookies.remove("token_type");
        Cookies.remove("user_info");
        router.push("/");
    };
    const mutation = useMutation({
        mutationFn: async ({ currentPassword, newPassword }: {
            currentPassword: string;
            newPassword: string
        }) => {
            try {
                const response = await changePasswordApi({
                    method: "PUT",
                    urlEndpoint: "/users/me/password",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword
                    }),
                });

                if (!response?.data) {
                    throw new Error("No response data received");
                }
                return response.data;
            } catch (error: any) {
                // Throw the entire error response to preserve structure
                throw error.response?.data ?? error.message;
            }
        },
        onSuccess: () => {
            dispatch(hideChangePasswordForm());
            toast.success("Password updated successfully!", {
                style: { backgroundColor: "#28a745", color: "white", border: "none" },
            });
            handleSuccessfulPasswordChange();
        },
        onError: (error: any) => {
            console.log('Raw error:', error);  // For debugging

            let errorMessage = "Failed to update password";

            // Handle different error formats
            if (typeof error?.detail === "string") {
                // Direct string error (first type)
                errorMessage = error.detail;
            } else if (Array.isArray(error?.detail)) {
                // Array of error objects (second type)
                const firstError = error.detail[0];
                if (firstError?.msg) {
                    errorMessage = firstError.msg;
                } else if (firstError?.message) {
                    errorMessage = firstError.message;
                }
            } else if (error?.message) {
                // Generic error message
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                style: { backgroundColor: "#dc3545", color: "white", border: "none" },
            });
        }
    });

    const handleModalClose = () => dispatch(hideChangePasswordForm());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast.error("Password fields cannot be empty");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (failedRules.length > 0) {
            toast.error("Password doesn't meet the requirements");
            return;
        }

        mutation.mutate({ currentPassword, newPassword });
    };

    return (
        <div className="fixed top-0 left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-[100]">
            <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
                <div className="flex justify-between items-center">
                    <h6 className="text-[14px] font-semibold text-[var(--blue)]">Change Password</h6>
                    <button onClick={handleModalClose} className="dark:text-black">X</button>
                </div>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            className="w-full px-2 py-1 pr-10 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            autoFocus
                            disabled={mutation.isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(prev => !prev)}
                            className="absolute right-2 top-[30%] text-gray-600"
                        >
                            {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full px-2 py-1 pr-10 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={mutation.isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(prev => !prev)}
                            className="absolute right-2 top-[30%] text-gray-600"
                        >
                            {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>

                    {newPassword && failedRules.length > 0 && (
                        <div className="text-[8px] text-red-500">
                            <p>Password must include:</p>
                            <ul className="list-disc ml-4">
                                {failedRules.map((rule, idx) => (
                                    <li key={idx}>{rule.label}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-2 py-1 pr-10 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={mutation.isPending}
                        />
                        {/* <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-2 top-[30%] text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button> */}
                    </div>

                    {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-[8px] text-red-500">Passwords do not match</p>
                    )}

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
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
