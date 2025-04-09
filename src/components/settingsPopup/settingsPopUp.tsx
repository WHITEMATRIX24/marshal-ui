"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteCnfModal from "../ui/delete-cnf-modal";
import Image from "next/image";
import Cookies from "js-cookie";
import { formatName } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import { fetchProfilePhotoApi } from "@/services/apis";

interface SettingsPopUpProps {
  onClose: () => void;
}

export const SettingsPopUp: React.FC<SettingsPopUpProps> = ({ onClose }) => {
  const [deleteCnfModalShow, setDeleteCnfModalShow] = useState<boolean>(false);
  const userData = Cookies.get("user_info");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const token = Cookies.get("access_token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["profilePicture"],
    queryFn: async () => {
      const response = await fetchProfilePhotoApi({
        method: "GET",
        urlEndpoint: "/profile-photos/profile-photo/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data || "";s
    },
  });

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
        <div className="flex flex-col gap-6 w-full md:w-[30rem] h-auto bg-white dark:bg-black px-5 py-4 rounded-md dark:border">
          <div className="flex justify-between items-center">
            <h6 className="text-sm font-semibold ">Settings</h6>
            <button onClick={onClose} className="text-lg font-bold">
              ✖
            </button>
          </div>
          <div className="h-62 flex flex-col gap-5">
            <div className="flex items-center justify-end gap-3">
              <div className="flex flex-col items-end">
                <h6 className="font-semibold">
                  {formatName(parsedUserData?.username) || "User"}
                </h6>
                <label
                  htmlFor="chnage-profilePic"
                  className="text-[11px] text-textcolorblue cursor-pointer"
                >
                  Change Profile Picture
                </label>
                <input type="file" id="chnage-profilePic" className="hidden" />
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
              <Link href="/home/dashboard/changepassword" className="w-fit text-[11px]">
                Change password
              </Link>
              <Link href="/home/dashboard/subscriptionplan" className="w-fit text-[11px]">
                View subscription option
              </Link>
              <button onClick={handleDeleteBtn} className="w-fit text-[11px]">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      {deleteCnfModalShow && <DeleteCnfModal modalCloseHandler={handleCnfModalClose} />}
    </>
  );
};
