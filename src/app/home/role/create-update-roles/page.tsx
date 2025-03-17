import { DataTable } from "@/components/data-table";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import React from "react";

const CreateUpdateRole = () => {
  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-0 w-full px-4">
        <DataTable
          columns={[
            {
              accessorKey: "ctrl_name",
              header: "App Rev Area Name",
              id: "ctrl_name",
            },
            {
              accessorKey: "applicable_str",
              header: "Applicable",
              id: "applicable_str",
            },
            {
              accessorKey: "justification",
              header: "Justification",
              id: "justification",
            },
          ]}
          data={[]}
        />
      </div>
    </div>
  );
};

export default CreateUpdateRole;
