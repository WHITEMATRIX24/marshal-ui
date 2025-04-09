"use client";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreateTaskModel } from "@/models/tasks";
import { useQuery } from "@tanstack/react-query";
import { getAllClientRolesApi } from "@/services/apis";
import Cookies from "js-cookie";
import { roleModel } from "@/models/roles";

const AddAssignment = () => {
  const token = Cookies.get("access_token");
  const searchParams = useSearchParams();
  let taskQuery = null;
  try {
    const taskParams = searchParams.get("task");
    if (taskParams) taskQuery = JSON.parse(taskParams);
  } catch (error) {
    taskQuery = null;
  }
  const [formData, setFormData] = useState<CreateTaskModel>({
    action: "",
    actual_startdate: "",
    approver: "",
    doer: "",
    end_date: "",
    plan_startdate: "",
    reviewer: "",
    status: "",
    task_id: taskQuery ? taskQuery.id : null,
  });
  const [doerUsers, setDoerUser] = useState<roleModel[] | null>(null);
  const [auditors, setAuditors] = useState<roleModel[] | null>(null);
  const [reviewers, setReviewers] = useState<roleModel[] | null>(null);
  console.log(taskQuery);

  // client roles
  const {
    data: allClientRoles,
    error: allClientErrors,
    isLoading: allClientResponseLoading,
  } = useQuery({
    queryKey: ["allclientroles"],
    queryFn: () =>
      getAllClientRolesApi({
        method: "GET",
        urlEndpoint: "/clientrole/client-roles",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  useEffect(() => {
    if (allClientRoles) {
      setDoerUser(
        allClientRoles.data.items.filter(
          (users: roleModel) => users.role_type === "Doer"
        )
      );
      setReviewers(
        allClientRoles.data.items.filter(
          (users: roleModel) => users.role_type === "Reviewer"
        )
      );
      setAuditors(
        allClientRoles.data.items.filter(
          (users: roleModel) => users.role_type === "Auditee"
        )
      );
    }
  }, [allClientRoles]);

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
            value={taskQuery?.task_title || ""}
            placeholder="Task select from portfolio"
            readOnly
            className="px-3 py-1 border border-darkThemegrey rounded-md text-sm"
          />
          <input
            type="text"
            placeholder="Task description"
            value={taskQuery?.task_details || ""}
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
                {doerUsers?.map((doer) => (
                  <option key={doer.id} value={doer.role_sort_name}>
                    {doer.role_name}
                  </option>
                ))}
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
                {reviewers?.map((doer) => (
                  <option key={doer.id} value={doer.role_sort_name}>
                    {doer.role_name}
                  </option>
                ))}
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
                {auditors?.map((doer) => (
                  <option key={doer.id} value={doer.role_sort_name}>
                    {doer.role_name}
                  </option>
                ))}
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
