"use client";

import Cookies from "js-cookie";
import { loginApiHandler } from "@/services/apis";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faUser } from "@fortawesome/free-regular-svg-icons";
import { LoginResponse } from "../models/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

interface loginCred {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [loginCred, setLoginCred] = useState<loginCred>({
    email: "",
    password: "",
  });
  const [passVissible, setPassVisible] = useState<boolean>(false);
  const checkvalue = "";

  // password visible handler
  const togglePasswordVisiblity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPassVisible(!passVissible);
  };

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: loginApiHandler,
    onError: (error) => {
      return toast.error(error.message, {
        style: { backgroundColor: "#ff5555", color: "white", border: "none" },
      });
    },
    onSuccess: async (responseData) => {
      const { data } = responseData as { data: LoginResponse };
      console.log(data);

      Cookies.set("access_token", data?.access_token);
      Cookies.set(
        "roles_by_governance",
        JSON.stringify(data?.roles_by_governance)
      );
      Cookies.set("user_info", JSON.stringify(data?.user_info));
      Cookies.set("token_type", data?.token_type);
      Cookies.set("login_popup_initila_render", JSON.stringify(true));
      router.replace("/home/dashboard");
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
        <div className="col-span-2 flex flex-col justify-center items-center gap-10 px-5 lg:px-16 bg-black/25">
          <div className="relative flex justify-center w-full min-h-fit">
            <Image
              src="/logo-no-background.svg"
              alt="logo"
              width={300}
              height={66}
            />
          </div>
          <form
            onSubmit={loginHandler}
            className="flex flex-col gap-5 w-full 2xl:w-3/4"
          >
            <div className="relative flex flex-col gap-2">
              {/* <p className="m-0 w-fit">Login</p> */}
              <input
                type="text"
                placeholder="Login"
                value={loginCred.email}
                onChange={(e) =>
                  setLoginCred({ ...loginCred, email: e.target.value })
                }
                className="w-full outline-none border border-gray-600 bg-greycomponentbg px-3 py-2 rounded-md"
              />
              <FontAwesomeIcon
                className="absolute top-3 right-4"
                icon={faUser}
              />
            </div>
            <div className="relative flex flex-col gap-2">
              {/* <p className="m-0 w-fit">Password</p> */}
              <input
                placeholder="Password"
                type={passVissible ? "text" : "password"}
                value={loginCred.password}
                onChange={(e) =>
                  setLoginCred({ ...loginCred, password: e.target.value })
                }
                className="w-full outline-none border border-gray-600 bg-greycomponentbg ps-3 pe-16 py-2 rounded-md"
              />
              {/* <p className="ms-auto text-textcolorblue">Link Button Label</p> */}
              <button
                type="button"
                onClick={togglePasswordVisiblity}
                className={`absolute right-4 top-2.5 cursor-pointer`}
              >
                <FontAwesomeIcon
                  icon={faEye}
                  color={passVissible ? "#0079ff" : "black"}
                />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative inline-block w-11 h-5">
                  <input
                    value={checkvalue}
                    id="switch-component"
                    type="checkbox"
                    className="peer appearance-none w-11 h-5 bg-greycomponentbg rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300 border border-gray-600"
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
            <div className="w-full border mt-3 dark:border-gray-600"></div>
            <p className="m-0 text-center">
              Dont have an account?{" "}
              <span className="ms-2 text-textcolorblue">Sign up now</span>
            </p>
          </form>
        </div>
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
