import React from "react";

const ForgetPassword = () => {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <div className="flex flex-col items-center gap-6 bg-greycomponentbg rounded-lg px-10 py-8">
        <h6 className="font-semibold text-[12px]">Reset Password</h6>
        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="enter the email"
            className="px-3 py-1 rounded-md text-[12px]"
          />
          <button className="bg-[var(--blue)] w-fit px-3 py-1 self-end rounded-md text-[12px]">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
