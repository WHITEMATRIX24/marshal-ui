"use client";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { CreateTaskModel } from "@/models/tasks";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  createAssignmentApi,
  fetchL1ControlsByStandardApi,
  fetchStandardsApi,
  fetchUsersDataApi,
  getAllComplianceApi,
} from "@/services/apis";
import { Standard } from "@/models/standards";
import { Control } from "@/models/control";
import { AssignAssignmentTable } from "@/components/assign_assignment_table";
import { toast } from "sonner";
import { Compliance } from "../create-or-view-compliance/page";
import { UserInfo } from "@/models/auth";
import { FrequencyModel } from "@/models/frequency";

const AssignAssignment = () => {
  const selectedGovernance = JSON.parse(
    Cookies.get("selected_governance") || "null"
  );
  const token = Cookies.get("access_token");
  const [formData, setFormData] = useState<CreateTaskModel>({
    action: "",
    actual_startdate: "",
    approver: "",
    doer: "",
    end_date: "",
    plan_startdate: "",
    reviewer: "",
    status: "",
    task_id: null,
    compliance_id: null,
    frequency: null,
    position: "",
  });
  const [selectedStandards, setSelcetedStandards] = useState<string | number>(
    "default"
  );
  const [tableData, setTableData] = useState<Control[]>([]);
  const [positionNumber, setPositionNumber] = useState<number | null>(null);
  const [positionData, setPositionData] = useState<string[]>([]);
  const [userFilterData, setUserFilterData] = useState<{
    doer: UserInfo[];
    reviewer: UserInfo[];
    auditor: UserInfo[];
  }>();
  const [taskNameDisplay, setTaskNameDisplay] = useState<string>("");

  //   columns data
  const tableColumnData = [
    {
      accessorKey: "control_full_name",
      header: "App Rev Area Name",
      id: "control_full_name",
    },
  ];

  //   standerds fetch
  const {
    data: standerdsData,
    isLoading: standerdsLoading,
    error: standardsError,
  } = useQuery({
    queryKey: ["standerdsbygovid"],
    queryFn: () =>
      fetchStandardsApi({
        method: "GET",
        urlEndpoint: `/standards/by-governance/${selectedGovernance.governance_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: selectedGovernance ? true : false,
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

  //   fetch tasks
  const fetchtasks = async () => {
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const urlEndpoint = `/controls/tree/with-tasks/?std_id=${selectedStandards}&gov_id=${selectedGovernance.governance_id}`;
    const method = "GET";

    try {
      const response = await fetchL1ControlsByStandardApi({
        urlEndpoint,
        method,
        headers,
      });
      console.log(response?.data.items);

      setTableData(response?.data.items);
    } catch (error) {
      console.log("error in fetching controls in assign assignment");
    }
  };
  useEffect(() => {
    if (selectedStandards != "default") {
      fetchtasks();
    }
  }, [selectedStandards]);

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

  //   handle submit
  const handleSubmit = async () => {
    if (!positionNumber) return;

    if (positionData.length < positionNumber)
      return toast.warning("Fill all positions");

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
      //   !approver ||
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

    setFormData({ ...formData, position: positionJoinedData });

    try {
      const response = await createAssignmentApi({
        method: "POST",
        urlEndpoint: "/assignments/assignments",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (error) {
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
        <div className="flex flex-col gap-2">
          <select
            value={selectedStandards}
            onChange={(e) => setSelcetedStandards(e.target.value)}
            className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
          >
            <option value="default" disabled>
              select standards
            </option>
            {standerdsLoading ? (
              <option disabled>loading...</option>
            ) : standardsError ? (
              <option disabled>something went erong</option>
            ) : (
              standerdsData?.data.items.map((standerds: Standard) => (
                <option key={standerds.id} value={standerds.id}>
                  {standerds.std_short_name}
                </option>
              ))
            )}
          </select>
          <input
            type="text"
            placeholder="selected task"
            readOnly
            className="px-2 py-1 border outline-none rounded-md text-[11px] w-full"
            value={taskNameDisplay}
          />
          {/* task table */}
          <div className="relative h-[23rem]">
            <AssignAssignmentTable
              columns={tableColumnData}
              data={tableData}
              displayHandler={setTaskNameDisplay}
              taskDataHandler={(taskId: number) =>
                setFormData({ ...formData, task_id: taskId })
              }
            />
          </div>
          {/* form */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div className="w-full">
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
                placeholder="plan start date"
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
                placeholder="actual start date"
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
                placeholder="end date"
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
            <button className="px-2 py-1 bg-[var(--red)] w-fit text-white text-[11px] rounded-md">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-2 py-1 bg-[var(--blue)] w-fit text-white text-[11px] rounded-md"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAssignment;
