"use client";

import React from "react";

export default function Login() {
  const checkvalue = "";

  return (
    <div className="grid grid-cols-5 h-dvh">
      <div className="col-span-3"></div>
      <div className="col-span-2 flex flex-col justify-center items-center gap-10 px-5 md:px-20 ">
        <div>image</div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="m-0 w-fit">Login</p>
            <input
              type="text"
              className="w-96 outline-none border border-gray-300 bg-greycomponentbg px-3 py-2 rounded-md"
            />
          </div>
          <div className="relative flex flex-col gap-2">
            <p className="m-0 w-fit">password</p>
            <input
              type="password"
              className="w-96 outline-none border border-gray-300 bg-greycomponentbg ps-3 pe-16 py-2 rounded-md"
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

          <button className="bg-colorblue rounded-md py-2 font-semibold text-white mt-4">
            Sign in
          </button>
          <div className="w-full border mt-3"></div>
          <p className="m-0 text-center">
            Dont have an account?{" "}
            <span className="ms-2 text-textcolorblue">Sign up now</span>
          </p>
        </div>
      </div>
    </div>
  );
}
