"use client";

import { ChartComponent } from "@/components/dashboard/lineChart";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";

export default function Page() {
  const cardData = [
    { title: "Task Assignments", value: 120 },
    { title: "Standards Met", value: 85 },
    { title: "Pending Reviews", value: 30 },
    { title: "Completed Projects", value: 45 },
  ];

  return (
    <div className="flex flex-col w-full mb-[50px]">
      <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <BreadCrumbsProvider />
        </div>
      </header>
      <div className="py-4 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center">
            <h3 className="text-[15px] font-semibold">{card.title}</h3>
            <p className="text-[20px] font-bold text-blue-600">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="py-0 w-full px-4">
        <ChartComponent />
      </div>
    </div>
  );
}