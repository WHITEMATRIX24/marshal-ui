"use client";
import React, { useState } from "react";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import Cookies from "js-cookie";
import { Pencil, Trash } from "lucide-react";
import { ViewComplianceTable } from "@/components/configuration/viewCompliance";
import { getAllComplianceApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/formater";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/global-redux/store";
import AddEditCompilanceModal from "@/components/add_eddit_compilance";
import { showAddEditComapilanceModal } from "@/lib/global-redux/features/uiSlice";
import { toast } from "sonner";
import DeletecomplianceModal from "@/components/configuration/deleteComplianceModal";
import Loader from "@/components/loader";

export interface Compliance {
  id: number;
  compliance_title: string;
  gov_id: number;
  std_id: number;
  gov_name: string;
  std_name: string;
  compliance_startdate: string;
  compliance_enddate: string;
  compliance_year: string;
  is_active: boolean;
}

const ViewCompliance = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");
  const complilaceFormState = useSelector(
    (state: RootState) => state.ui.addEditComapilanecModal.isVisible
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingComplianceId, setDeletingComplianceId] = useState<
    number | null
  >(null);

  const { data, isLoading, error } = useQuery({
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

  const compliance: Compliance[] = data?.data?.items || [];

  const columnsData = [
    {
      accessorKey: "compliance_title",
      header: "Title",
    },
    {
      accessorKey: "gov_name",
      header: "Governance",
    },
    {
      accessorKey: "std_name",
      header: "Standard",
    },
    {
      accessorKey: "compliance_startdate",
      header: "Start Date",
      cell: ({ row }: any) => formatDate(row.original.compliance_startdate),
    },
    {
      accessorKey: "compliance_enddate",
      header: "End Date",
      cell: ({ row }: any) => formatDate(row.original.compliance_enddate),
    },
    {
      accessorKey: "compliance_year",
      header: "Year",
    },
    {
      accessorKey: "actions",
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const handleOpenEdit = () => {
          const { compliance_startdate, compliance_enddate, ...rest } =
            row.original;

          // Format to 'YYYY-MM-DD'
          const formattedStartDate = compliance_startdate?.split("T")[0];
          const formattedEndDate = compliance_enddate?.split("T")[0];

          dispatch(
            showAddEditComapilanceModal({
              ...rest,
              compliance_startdate: formattedStartDate,
              compliance_enddate: formattedEndDate,
            })
          );
        };
        const handleDeleteOption = () => {
          setDeletingComplianceId(row.original.id);
          setDeleteModal(true);
        };

        return (
          <div className="flex w-full justify-center gap-2">
            <Pencil
              onClick={handleOpenEdit}
              className="h-4 w-4 text-blue-900 cursor-pointer"
            />
            <Trash
              onClick={handleDeleteOption}
              className="h-4 w-4 text-[var(--red)] cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
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
            <ViewComplianceTable columns={columnsData} data={compliance} />
          )}
        </div>
      </div>

      {complilaceFormState && <AddEditCompilanceModal />}

      {deleteModal && (
        <DeletecomplianceModal
          compliance_id={deletingComplianceId}
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDeleteSuccess={() => {
            setDeletingComplianceId(null);
            setDeleteModal(false);
          }}
        />
      )}
    </>
  );
};

export default ViewCompliance;
