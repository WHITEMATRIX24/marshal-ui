"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DeleteCnfModal from "../ui/delete-cnf-modal";
import Image from "next/image";
import Cookies from "js-cookie";
import { formatName } from "@/utils/formater";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchProfilePhotoApi, UploadProfilePhotoApi } from "@/services/apis";
import { toast } from "sonner";
import { RootState } from "@/lib/global-redux/store";
import { useDispatch, useSelector } from "react-redux";
import { showChangePasswordForm } from "@/lib/global-redux/features/uiSlice";
import ChangePasswordModal from "../changePasswordPopup/changePasswordPopup";
import { X } from "lucide-react";

interface SettingsPopUpProps {
  onClose: () => void;
}

export const SettingsPopUp: React.FC<SettingsPopUpProps> = ({ onClose }) => {
  const [deleteCnfModalShow, setDeleteCnfModalShow] = useState<boolean>(false);
  const userData = Cookies.get("user_info");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const token = Cookies.get("access_token");
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isChangePasswordModalVisible = useSelector(
    (state: RootState) => state.ui.changePasswordModal.isVisible
  );
  const handelOpenChangePasswordModal = () => dispatch(showChangePasswordForm());
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profilePicture"],
    queryFn: async () => {
      const response = await fetchProfilePhotoApi({
        method: "GET",
        urlEndpoint: "/profile-photos/profile-photo/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data || "";
    },
  });

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await UploadProfilePhotoApi({
        method: "POST",
        urlEndpoint: "/profile-photos/upload-profile-photo/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });

      if (!response?.data) {
        throw new Error("Failed to upload profile photo");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile photo updated successfully!", {
        style: { backgroundColor: "#28a745", color: "white", border: "none" },
      });
      refetch(); // refetch profile picture
    },
    onError: (error) => {
      console.error("Error uploading profile photo:", error);
      toast.error("Error uploading profile photo");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      mutation.mutate(selectedFile);
    }
  };

  const handleDeleteBtn = () => {
    setDeleteCnfModalShow(true);
  };

  const handleCnfModalClose = () => {
    setDeleteCnfModalShow(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).id === "settings-popup-overlay") {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <>
      <div
        id="settings-popup-overlay"
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-20"
      >
        <div className="flex flex-col gap-6 w-full md:w-[30rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md ">
          <div className="flex justify-between items-center">
            <h6 className="text-sm font-semibold text-[var(--blue)]">Settings</h6>
            <button onClick={onClose} className="font-bold dark:text-black">
              <X size={18} />
            </button>

          </div>
          <div className="h-62 flex flex-col gap-5">
            <div className="flex items-center justify-end gap-3">
              <div className="flex flex-col items-end">
                <h6 className="font-semibold text-[var(--blue)]">
                  {formatName(parsedUserData?.username) || "User"}
                </h6>

                <label
                  htmlFor="change-profilePic"
                  className="text-[11px] text-textcolorblue text-black cursor-pointer"
                >
                  Change Profile Picture
                </label>


                <input
                  type="file"
                  id="change-profilePic"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="h-16 w-16 bg-greycomponentbg rounded-[5px] relative flex justify-center items-center">
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <Image
                    src="/user.svg"
                    alt="user"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <Image
                    src={data?.photo_url || "/user.svg"}
                    alt="Profile Picture"
                    fill
                    className="object-cover rounded-[5px]"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 bg-greycomponentbg h-full px-3 py-2 rounded-md">
              <button
                onClick={handelOpenChangePasswordModal}
                className="w-fit text-[11px] dark:text-black"
              >
                Change password
              </button>

              {/* <Link
                href="/home/dashboard/subscriptionplan"
                className="w-fit text-[11px] dark:text-black"
              >
                View subscription option
              </Link> */}
              <button onClick={handleDeleteBtn} className="w-fit text-[11px] text-[var(--red)]">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      {deleteCnfModalShow && (
        <DeleteCnfModal modalCloseHandler={handleCnfModalClose} />
      )}
      {isChangePasswordModalVisible && <ChangePasswordModal />}

    </>
  );
};
