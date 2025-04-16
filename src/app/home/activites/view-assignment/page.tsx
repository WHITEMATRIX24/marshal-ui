"use client";
import { ViewActivityTable } from "@/components/activites/viewactivitytable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { fetchActivitesControlsApi, fetchAdditionalDataApi } from "@/services/apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { formatDate } from "@/utils/formater";
import Loader from "@/components/loader";
import axios from "axios";
import { showEditAssignmentModal } from "@/lib/global-redux/features/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import EditAssignmentModal from "@/components/activites/editAssignmentModal";
import { RootState } from "@/lib/global-redux/store";
import DeleteAssignmentModal from "@/components/activites/deleteAssignmentModal";

const ViewActivity = () => {
  const token = Cookies.get("access_token");
  const userData = Cookies.get("user_info");
  const govId = Cookies.get("selected_governance");
  const dispatch = useDispatch();
  const [userName, setUserName] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const assignmentEditState = useSelector((state: RootState) => state.ui.editAssignmentModal.isVisible);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserName(parsed.username);
    }
  }, [userData]);

  useEffect(() => {
    if (govId) {
      const parsedGovId = JSON.parse(govId);
      setRoleName(parsedGovId.role_type_name);
    }
  }, [govId]);

  const getEndpointUrl = () => {
    if (!userName || !roleName) return "/assignments/assignments";
    const role = roleName.toLowerCase();
    if (role.includes("doer")) {
      return `/assignments/assignments?doer=${userName}`;
    } else if (role.includes("reviewer") || role.includes("approver")) {
      return `/assignments/assignments?reviewer=${userName}`;
    } else if (role.includes("auditor") || role.includes("approver")) {
      return `/assignments/assignments?reviewr=${userName}`;
    } else {
      return "/assignments/assignments";
    }
  };

  const fetchAdditionalData = async (items: any[]) => {
    const enrichedData = await Promise.all(
      items.map(async (item) => {
        try {
          const taskRes = await fetchAdditionalDataApi({
            method: "GET",
            urlEndpoint: `/tasks/${item.task_id}`,
            headers: { Authorization: `Bearer ${token}` },
          });

          const freqRes = await fetchAdditionalDataApi({
            method: "GET",
            urlEndpoint: `/frequencies/frequencies/${item.frequency}`,
            headers: { Authorization: `Bearer ${token}` },
          });
          const complianceRes = await fetchAdditionalDataApi({
            method: "GET",
            urlEndpoint: `/compliance/compliance-periods/${item.compliance_id}`,
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("task res ", taskRes)
          return {
            ...item,
            task_name: taskRes?.data?.task_title ?? "N/A",
            frequency: freqRes?.data?.frequency ?? "N/A",
            compliance: complianceRes?.data?.compliance_title ?? "N/A"
          };
        } catch (err) {
          console.error("Failed to fetch task or frequency for item", item.id, err);
          return {
            ...item,
            task_name: "N/A",
            frequency: "N/A",
            compliance: "N/A"
          };
        }
      })
    );
    return enrichedData;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["assignment", userName, roleName],
    queryFn: async () => {
      const response = await fetchActivitesControlsApi({
        method: "GET",
        urlEndpoint: getEndpointUrl(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const enriched = await fetchAdditionalData(response?.data.items);
      return enriched;
    },
    enabled: !!userName && !!roleName,
  });

  const columnData = [
    {
      accessorKey: "task_name",
      header: "Task Name",
      id: "task_name",
    },
    {
      accessorKey: "doer",
      header: "Doer",
      id: "doer",
    },
    {
      accessorKey: "reviewer",
      header: "Reviewer",
      id: "reviewer",
    },
    {
      accessorKey: "approver",
      header: "Approver",
      id: "approver",
    },
    {
      accessorKey: "compliance",
      header: "Compliance",
      id: "compliance",
      // cell: () => "Compliance Period 2025",
    },

    {
      accessorKey: "frequency",
      header: "Frequency",
      id: "frequency",
    },
    {
      accessorKey: "plan_startdate",
      header: "Planned Start Date",
      id: "plan_startdate",
      cell: ({ row }: any) => formatDate(row.original.plan_startdate),
    },
    {
      accessorKey: "actual_startdate",
      header: "Actual Start Date",
      id: "actual_startdate",
      cell: ({ row }: any) => formatDate(row.original.actual_startdate),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      id: "end_date",
      cell: ({ row }: any) => formatDate(row.original.end_date),
    },
    {
      accessorKey: "status",
      header: "Status",
      id: "status",
    },
    {
      accessorKey: "action",
      header: "Action",
      id: "action",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const isAdmin = roleName?.toLowerCase().includes("admin");
        const handleOpenEdit = () => {
          const {
            id,
            task_name,
            task_details,
            doer,
            reviewer,
            approver,
            plan_startdate,
            actual_startdate,
            end_date,
            status,
            action,
            is_active,
          } = row.original;

          dispatch(
            showEditAssignmentModal({
              id,
              task_name,
              task_details,
              doer,
              reviewer,
              approver,
              plan_startdate: plan_startdate?.split("T")[0],
              actual_startdate: actual_startdate?.split("T")[0],
              end_date: end_date?.split("T")[0],
              status,
              action,
              is_active,
            })
          );
        };
        const handleDeleteOption = () => {
          setDeletingAssignmentId(row.original.id);
          setDeleteModal(true);
        };
        return (
          <div className="flex w-full justify-center gap-2">
            <Pencil className="h-3 w-3 text-blue-900 cursor-pointer" onClick={handleOpenEdit} />
            {isAdmin && (
              <Trash className="h-3 w-3 text-[var(--red)] cursor-pointer"
                onClick={handleDeleteOption} />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-0 w-full px-4">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p>Something went wrong ...</p>
        ) : (
          data && (
            roleName?.toLowerCase().includes("doer") ||
              roleName?.toLowerCase().includes("reviewer") ||
              roleName?.toLowerCase().includes("auditor") ||
              roleName?.toLowerCase().includes("admin") ? (
              <ViewActivityTable columns={columnData} data={data.filter((item: any) => item.is_active)} />
            ) : (
              <p className=" text-[11px] text-gray-600 mt-6">No assignments found</p>
            )
          )
        )}
      </div>
      {assignmentEditState && <EditAssignmentModal />}
      {deleteModal && deletingAssignmentId !== null && (
        <DeleteAssignmentModal
          assignment_id={deletingAssignmentId}
          isOpen={deleteModal}
          onClose={() => {
            setDeletingAssignmentId(null);
            setDeleteModal(false);
          }}
          onDeleteSuccess={() => {
            setDeletingAssignmentId(null);
            setDeleteModal(false);
            queryClient.invalidateQueries({ queryKey: ["assignment", userName, roleName] });
          }}
        />
      )}
    </div>
  );
};

export default ViewActivity;
