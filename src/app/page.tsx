"use client";

import Cookies from "js-cookie";
import { loginApiHandler } from "@/services/apis";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { LoginResponse } from "./models/auth";
import { GovernanceSelectPopUp } from "@/components/auth/gov-select-popup";

interface loginCred {
  email: string;
  password: string;
}

interface GovernancePopUp {
  modalState: boolean;
  popUpData: any;
}

export default function Login() {
  const [openModal, setOpenModal] = useState<GovernancePopUp>({
    modalState: false,
    popUpData: null,
  });
  const [loginCred, setLoginCred] = useState<loginCred>({
    email: "",
    password: "",
  });
  const checkvalue = "";

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: loginApiHandler,
    onError: (error) => {
      return alert(error.message);
    },
    onSuccess: async (responseData) => {
      const { data } = responseData as { data: LoginResponse };

      Cookies.set("access_token", data?.access_token, { secure: true });
      Cookies.set(
        "roles_by_governance",
        JSON.stringify(data?.roles_by_governance)
      );
      Cookies.set("user_info", JSON.stringify(data?.access_token));
      Cookies.set("token_type", data?.token_type);

      setOpenModal({ ...openModal, modalState: true });
    },
  });

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = loginCred;
    if (!email || !password) return;

    const loginFormData = new URLSearchParams();
    loginFormData.append("grand_type", "password");
    loginFormData.append("username", email); //Jacob
    loginFormData.append("password", password); // Passw0rd3

    await loginMutation({
      urlEndpoint: "/users/login",
      method: "POST",
      data: loginFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // setOpenModal({ ...openModal, modalState: true });
  };

  return (
    <div className="h-dvh">
      <div className="grid md:grid-cols-5 h-full justify-center">
        <div className="col-span-3"></div>
        <div className="col-span-2 flex flex-col justify-center items-center gap-10 px-5 lg:px-16">
          <div>image</div>
          <form
            onSubmit={loginHandler}
            className="flex flex-col gap-5 w-full 2xl:w-3/4"
          >
            <div className="flex flex-col gap-2">
              <p className="m-0 w-fit">Login</p>
              <input
                type="text"
                value={loginCred.email}
                onChange={(e) =>
                  setLoginCred({ ...loginCred, email: e.target.value })
                }
                className="w-full outline-none border border-gray-300 bg-greycomponentbg px-3 py-2 rounded-md"
              />
            </div>
            <div className="relative flex flex-col gap-2">
              <p className="m-0 w-fit">password</p>
              <input
                type="password"
                value={loginCred.password}
                onChange={(e) =>
                  setLoginCred({ ...loginCred, password: e.target.value })
                }
                className="w-full outline-none border border-gray-300 bg-greycomponentbg ps-3 pe-16 py-2 rounded-md"
              />
              <p className="ms-auto text-textcolorblue">Link Button Label</p>
              <span className="absolute right-5 top-10">icon</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative inline-block w-11 h-5">
                  <input
                    value={checkvalue}
                    id="switch-component"
                    type="checkbox"
                    className="peer appearance-none w-11 h-5 bg-greycomponentbg rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300 border border-gray-300"
                  />
                  <label
                    htmlFor="switch-component"
                    className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
                  ></label>
                </div>
                <p>Remember me</p>
              </div>
              <button className="outline-none border-none text-textcolorblue">
                Forget password?
              </button>
            </div>

            <button
              type="submit"
              className="bg-colorblue rounded-md py-2 font-semibold text-white mt-4"
            >
              Sign in
            </button>
            <div className="w-full border mt-3"></div>
            <p className="m-0 text-center">
              Dont have an account?{" "}
              <span className="ms-2 text-textcolorblue">Sign up now</span>
            </p>
          </form>
        </div>
        {openModal.modalState && <GovernanceSelectPopUp />}
      </div>
      <video
        className="fixed top-0 left-0 -z-10 w-screen h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <source src="/videos/login-background.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
