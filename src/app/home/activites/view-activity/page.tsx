"use client";
import { ViewActivityTable } from "@/components/activites/viewactivitytable";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { fetchActivitesControlsApi } from "@/services/apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { formatDate } from "@/utils/formater";
import Loader from "@/components/loader";
import { useDispatch, useSelector } from "react-redux";
import { showEditTaskModal } from "@/lib/global-redux/features/uiSlice";
import EditTaskModal from "@/components/activites/editActivityModal";
import { RootState } from "@/lib/global-redux/store";
import DeletetaskModal from "@/components/activites/deleteActivityModal";

const ViewActivity = () => {
  const token = Cookies.get("access_token");
  const userData = Cookies.get("user_info");
  const govId = Cookies.get("selected_governance");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [userName, setUserName] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  const complilaceFormState = useSelector(
    (state: RootState) => state.ui.editTaskModal.isVisible
  );

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
    if (!userName || !roleName) return "/taskdetail/details";

    const role = roleName.toLowerCase();
    if (role.includes("doer")) {
      return `/taskdetail/details?doer=${userName}`;
    } else if (role.includes("reviewer")) {
      return `/taskdetail/details?reviewer=${userName}`;
    } else if (role.includes("approver")) {
      return `/taskdetail/details?approver=${userName}`;
    } else {
      return "/taskdetail/details";
    }
  };

  const columnData = [
    {
      accessorKey: "task_name",
      header: "Task Name",
      id: "task_name",
    },
    {
      accessorKey: "task_details",
      header: "Task Details",
      id: "task_details",
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
            showEditTaskModal({
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
          setDeletingTaskId(row.original.id);
          setDeleteModal(true);
        };

        return (
          <div className="flex w-full justify-center gap-2">
            <Pencil
              className="h-3 w-3 text-blue-900 cursor-pointer"
              onClick={handleOpenEdit}
            />
            {isAdmin && (
              <Trash
                className="h-3 w-3 text-[var(--red)] cursor-pointer"
                onClick={handleDeleteOption}
              />
            )}
          </div>
        );
      },
    },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ["task", userName, roleName],
    queryFn: async () =>
      await fetchActivitesControlsApi({
        method: "GET",
        urlEndpoint: getEndpointUrl(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: !!userName && !!roleName,
  });

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0">
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
            <ViewActivityTable columns={columnData} data={data.data.items.filter((item: any) => item.is_active)} />
          )
        )}
      </div>

      {complilaceFormState && <EditTaskModal />}

      {deleteModal && deletingTaskId !== null && (
        <DeletetaskModal
          task_id={deletingTaskId}
          isOpen={deleteModal}
          onClose={() => {
            setDeletingTaskId(null);
            setDeleteModal(false);
          }}
          onDeleteSuccess={() => {
            setDeletingTaskId(null);
            setDeleteModal(false);
            queryClient.invalidateQueries({ queryKey: ["task", userName, roleName] });
          }}
        />
      )}
    </div>
  );
};

export default ViewActivity;
