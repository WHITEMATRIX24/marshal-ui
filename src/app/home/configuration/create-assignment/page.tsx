"use client";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreateTaskModel } from "@/models/tasks";
import { useQuery } from "@tanstack/react-query";
import {
  createAssignmentApi,
  fetchUsersDataApi,
  getAllComplianceApi,
} from "@/services/apis";
import Cookies from "js-cookie";
import { roleModel } from "@/models/roles";
import { UserInfo } from "@/models/auth";
import { Compliance } from "../create-or-view-compliance/page";
import { FrequencyModel } from "@/models/frequency";
import { toast } from "sonner";

const AddAssignment = () => {
  const token = Cookies.get("access_token");
  const loginUserData = JSON.parse(Cookies.get("user_info") || "null");
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
    compliance_id: null,
    frequency: null,
    position: "",
  });
  const [positionNumber, setPositionNumber] = useState<number | null>(null);
  const [positionData, setPositionData] = useState<string[]>([]);
  const [userFilterData, setUserFilterData] = useState<{
    doer: UserInfo[];
    reviewer: UserInfo[];
    auditor: UserInfo[];
  }>();

  //   userData
  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery({
    queryKey: ["usersdata"],
    queryFn: async () =>
      await fetchUsersDataApi({
        method: "GET",
        urlEndpoint: "/users",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  useEffect(() => {
    if (userData) {
      const doers = userData.data.items.filter(
        (user: UserInfo) => user.roles[0].role_type_name === "Doer"
      );
      const reviewers = userData.data.items.filter(
        (user: UserInfo) => user.roles[0].role_type_name === "Reviewer"
      );
      const auditors = userData.data.items.filter(
        (user: UserInfo) => user.roles[0].role_type_name === "Auditor"
      );

      setUserFilterData({
        doer: doers,
        reviewer: reviewers,
        auditor: auditors,
      });
    }
  }, [userData]);

  //   fequency
  const {
    data: frequencyData,
    isLoading: frequencyDataLoading,
    error: frequencyDataError,
  } = useQuery({
    queryKey: ["frequencies"],
    queryFn: async () =>
      await fetchUsersDataApi({
        method: "GET",
        urlEndpoint: "/frequencies/frequencies",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  //   compliance fetch
  const {
    data: complianceData,
    isLoading: complianceLoading,
    error: complianceError,
  } = useQuery({
    queryKey: ["compliance"],
    queryFn: async () =>
      await getAllComplianceApi({
        method: "GET",
        urlEndpoint: "/compliance/compliance-periods",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!positionNumber) return;

    if (positionData.length < positionNumber)
      return toast.warning("Fill all positions");

    for (let index = 1; index < positionData.length; index++) {
      const current = Number(positionData[index]);
      const previous = Number(positionData[index - 1]);

      if (current <= previous) {
        return toast.warning("positin should be in a ascending order");
      }
    }

    const positionJoinedData = positionData.join(", ");

    const {
      action,
      actual_startdate,
      approver,
      compliance_id,
      doer,
      end_date,
      frequency,
      plan_startdate,
      position,
      reviewer,
      status,
      task_id,
    } = formData;

    if (
      !action ||
      !actual_startdate ||
      !approver ||
      !compliance_id ||
      !doer ||
      !end_date ||
      !frequency ||
      !plan_startdate ||
      !reviewer ||
      !status ||
      !task_id
    )
      return toast.warning("Fill form completly");

    const updatedFormData = {
      ...formData,
      position: positionJoinedData,
      approver: approver || loginUserData.username,
      doer: doer || loginUserData.username,
      reviewer: reviewer || loginUserData.username,
    };

    setFormData(updatedFormData);

    try {
      const response = await createAssignmentApi({
        method: "POST",
        urlEndpoint: "/assignments/assignments",
        data: updatedFormData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (
        (response && response?.status >= 200) ||
        (response && response?.status < 300)
      ) {
        toast.success("assignment created successfully");
        setFormData({
          action: "",
          actual_startdate: "",
          approver: "",
          doer: "",
          end_date: "",
          plan_startdate: "",
          reviewer: "",
          status: "",
          task_id: taskQuery ? taskQuery.id : null,
          compliance_id: null,
          frequency: null,
          position: "",
        });
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      toast.error("some thing went wrong");

      console.log("error on adding assignments");
    }
  };

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-4 w-full px-4 pe-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={taskQuery?.task_title || ""}
            placeholder="Task select from portfolio"
            readOnly
            className="px-3 py-1 text-[11px] border border-darkThemegrey rounded-md "
          />
          <input
            type="text"
            placeholder="Task description"
            value={taskQuery?.task_details || ""}
            readOnly
            className="px-3 py-1 text-[11px] border border-darkThemegrey rounded-md"
          />
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <select
                value={formData.doer === "" ? "default" : formData.doer}
                onChange={(e) =>
                  setFormData({ ...formData, doer: e.target.value })
                }
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  Select Doer
                </option>
                {userIsLoading ? (
                  <option disabled>loding...</option>
                ) : userError ? (
                  <option disabled>something went wrong</option>
                ) : (
                  userFilterData?.doer.map((doerData) => (
                    <option key={doerData.id} value={doerData.username}>
                      {doerData.username}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <select
                value={formData.reviewer === "" ? "default" : formData.reviewer}
                onChange={(e) =>
                  setFormData({ ...formData, reviewer: e.target.value })
                }
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  Select Reviewer
                </option>
                {userIsLoading ? (
                  <option disabled>loding...</option>
                ) : userError ? (
                  <option disabled>something went wrong</option>
                ) : (
                  userFilterData?.reviewer.map((doerData) => (
                    <option key={doerData.id} value={doerData.username}>
                      {doerData.username}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <select
                value={formData.approver === "" ? "default" : formData.approver}
                onChange={(e) =>
                  setFormData({ ...formData, approver: e.target.value })
                }
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  Select Auditor
                </option>
                {userIsLoading ? (
                  <option disabled>loding...</option>
                ) : userError ? (
                  <option disabled>something went wrong</option>
                ) : (
                  userFilterData?.auditor.map((doerData) => (
                    <option key={doerData.id} value={doerData.username}>
                      {doerData.username}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <select
                value={
                  formData.compliance_id === null
                    ? "default"
                    : formData.compliance_id
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    compliance_id: JSON.parse(e.target.value),
                  })
                }
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  Select Complience
                </option>
                {complianceLoading ? (
                  <option disabled>loading...</option>
                ) : complianceError ? (
                  <option disabled>something went wrong</option>
                ) : (
                  complianceData?.data.items.map((compliance: Compliance) => (
                    <option key={compliance.id} value={compliance.id}>
                      {compliance.compliance_title}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="plan start date (YYYY-MM-DD)"
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
                value={formData.plan_startdate}
                onChange={(e) =>
                  setFormData({ ...formData, plan_startdate: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="actual start date (YYYY-MM-DD)"
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
                value={formData.actual_startdate}
                onChange={(e) =>
                  setFormData({ ...formData, actual_startdate: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="end date (YYYY-MM-DD)"
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="status"
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="action"
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
                value={formData.action}
                onChange={(e) =>
                  setFormData({ ...formData, action: e.target.value })
                }
              />
            </div>
            <div>
              <select
                value={
                  formData.frequency === null ? "default" : formData.frequency
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    frequency: JSON.parse(e.target.value),
                  });
                  const frequencyStr = e.target.options[
                    e.target.selectedIndex
                  ].getAttribute("data-frequencycount");
                  const frequency = frequencyStr ? Number(frequencyStr) : null;
                  setPositionData([]);
                  setPositionNumber(frequency);
                }}
                className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
              >
                <option value="default" disabled>
                  Select Frequency
                </option>
                {frequencyDataLoading ? (
                  <option disabled>loading...</option>
                ) : frequencyDataError ? (
                  <option disabled>something went wrong</option>
                ) : (
                  frequencyData?.data.items.map((frequency: FrequencyModel) => (
                    <option
                      key={frequency.id}
                      value={frequency.id}
                      data-frequencycount={frequency.frequency_count}
                    >
                      {frequency.frequency}
                    </option>
                  ))
                )}
              </select>
            </div>
            {formData.frequency &&
              formData.frequency > 0 &&
              Array.from({ length: positionNumber || 0 }).map((_, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="positions"
                    className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
                    value={positionData[index] ?? ""}
                    onChange={(e) => {
                      const newData = [...positionData];
                      newData[index] = e.target.value;
                      setPositionData(newData);
                    }}
                  />
                </div>
              ))}
          </div>
          <div className="pt-4 flex justify-end gap-5">
            <button
              type="button"
              className="px-2 py-1 bg-[var(--red)] w-fit text-white text-[11px] rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2 py-1 bg-[var(--blue)] w-fit text-white text-[11px] rounded-md"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
