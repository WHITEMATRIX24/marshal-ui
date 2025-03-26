"use client";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import React from "react";

const AddAssignment = () => {
  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-16 w-full px-4 pe-20">
        <form className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Task select from portfolio"
            readOnly
            className="px-3 py-1 border border-darkThemegrey rounded-md text-sm"
          />
          <input
            type="text"
            placeholder="Task description"
            readOnly
            className="px-3 py-1 border border-darkThemegrey rounded-md text-sm"
          />
          <div className="grid grid-cols-3 gap-8">
            <div className="w-full">
              <select
                value={"default"}
                onChange={(e) => console.log(e.target.value)}
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  select the deour
                </option>
              </select>
            </div>
            <div>
              <select
                value={"default"}
                onChange={(e) => console.log(e.target.value)}
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  select the reviewer
                </option>
              </select>
            </div>
            <div>
              <select
                value={"default"}
                onChange={(e) => console.log(e.target.value)}
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  select the auditor
                </option>
              </select>
            </div>
          </div>
          <div className="pt-20 flex justify-end gap-5">
            <button className="px-2 py-1 bg-[var(--red)] w-fit rounded-md">
              Cancel
            </button>
            <button className="px-2 py-1 bg-[var(--blue)] w-fit rounded-md">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
