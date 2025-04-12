"use client";
import { hideAddEditComapilanceModal } from "@/lib/global-redux/features/uiSlice";
import { Standard } from "@/models/standards";
import {
  createComplinecApi,
  editComplinceApi,
  fetchStandardsApi,
} from "@/services/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { RootState } from "@/lib/global-redux/store";
import { ComplianceAddModel } from "@/models/compilance";
import { X } from "lucide-react";

const AddEditCompilanceModal = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const selectedGovernace = JSON.parse(
    Cookies.get("selected_governance") || "null"
  );
  const token = Cookies.get("access_token");
  const complianceEditdata = useSelector(
    (state: RootState) => state.ui.addEditComapilanecModal.data
  );
  const [formData, setFormData] = useState<ComplianceAddModel>({
    compliance_title: complianceEditdata
      ? complianceEditdata.compliance_title
      : "",
    gov_id: selectedGovernace.governance_id || null,
    std_id: complianceEditdata ? complianceEditdata.std_id : null,
    compliance_enddate: complianceEditdata
      ? complianceEditdata.compliance_enddate
      : "",
    compliance_startdate: complianceEditdata
      ? complianceEditdata.compliance_startdate
      : "",
    compliance_year: complianceEditdata
      ? complianceEditdata.compliance_year
      : "",
  });

  const {
    data: standersData,
    isLoading: standerdsLoading,
    error: standerdsError,
  } = useQuery({
    queryKey: ["standers"],
    queryFn: async () =>
      await fetchStandardsApi({
        method: "GET",
        urlEndpoint: `/standards/by-governance/${selectedGovernace.governance_id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  const handleModalClose = () => dispatch(hideAddEditComapilanceModal());

  const { mutateAsync: createComplince } = useMutation({
    mutationFn: complianceEditdata ? editComplinceApi : createComplinecApi,
    onError: () => toast.error("Something went wrong"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance"] });
      toast.success(
        complianceEditdata
          ? "compilance updated successfully"
          : "compilance created successfully", { style: { backgroundColor: "#28a745", color: "white", border: "none" } }
      );
      handleModalClose();
    },
  });

  const handleCreateComplience = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const {
      gov_id,
      std_id,
      compliance_enddate,
      compliance_startdate,
      compliance_title,
      compliance_year,
    } = formData;
    if (
      !gov_id ||
      !std_id ||
      !compliance_enddate ||
      !compliance_startdate ||
      !compliance_title ||
      !compliance_year
    )
      return toast.warning("fill form");

    createComplince({
      method: complianceEditdata ? "PUT" : "POST",
      urlEndpoint: complianceEditdata
        ? `/compliance/compliance-periods/${complianceEditdata.id}`
        : "/compliance/compliance-periods",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    });
  };

  return (
    <div className="fixed top-0 -left-0 h-full w-full bg-black/50 flex justify-center items-center pointer-events-auto z-10">
      <div className="flex flex-col gap-2 w-full md:w-[25rem] h-auto bg-white dark:bg-[#E5E5E5] px-5 py-4 rounded-md dark:border dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h6 className="text-[14px] font-semibold text-[var(--blue)]">
            Add compliance
          </h6>
          <button onClick={handleModalClose} className="dark:text-black">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleCreateComplience} className="flex flex-col gap-2">
          <input
            type="text"
            value={formData.compliance_title}
            onChange={(e) =>
              setFormData({ ...formData, compliance_title: e.target.value })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Compliance Title"
          />
          <input
            type="text"
            value={formData.compliance_startdate}
            onChange={(e) =>
              setFormData({ ...formData, compliance_startdate: e.target.value })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Start Date (YYYY-MM-DD)"
          />
          <input
            type="text"
            value={formData.compliance_enddate}
            onChange={(e) =>
              setFormData({ ...formData, compliance_enddate: e.target.value })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="End Date (YYYY-MM-DD)"
          />
          <input
            type="text"
            value={formData.compliance_year}
            onChange={(e) =>
              setFormData({ ...formData, compliance_year: e.target.value })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
            placeholder="Compliance Year"
          />
          <select
            value={
              formData.std_id === null
                ? "default"
                : JSON.stringify(formData.std_id)
            }
            onChange={(e) =>
              setFormData({ ...formData, std_id: JSON.parse(e.target.value) })
            }
            className="px-2 py-1 border outline-none rounded-md text-[11px] border-gray-300 dark:border-gray-600 bg-[var(--table-bg-even)] dark:text-black"
          >
            <option value="default" disabled>
              Select Standard
            </option>
            {standerdsLoading ? (
              <option disabled>loading</option>
            ) : standerdsError ? (
              <option disabled>something went wrong</option>
            ) : (
              standersData?.data.items.map((standerd: Standard) => (
                <option key={standerd.id} value={standerd.id}>
                  {standerd.std_short_name}
                </option>
              ))
            )}
          </select>
          <div className="flex gap-4 mt-3 justify-end">
            <button
              className="px-4 py-0.5 bg-[var(--red)] text-white text-[12px] rounded-[5px] dark:text-black "
              type="reset"
            >
              Cancel
            </button>

            <button
              className="px-4 py-0.5 bg-[var(--blue)] text-white text-[12px] rounded-[5px] dark:text-black"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCompilanceModal;
