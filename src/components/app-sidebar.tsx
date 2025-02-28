"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import Cookies from "js-cookie";
import {
  BookMarked,
  BriefcaseBusiness,
  Cog,
  FileCheck2,
  FileChartColumn,
  LayoutDashboard,
  UserCog,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { fetchStandardsApi } from "@/services/apis";
import { cookies } from "next/headers";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [standards, setStandards] = React.useState([]);
  const router = useRouter();
  const handleStandardClick = (stdId: string) => {
    Cookies.set("std_id", stdId, { expires: 7 }); // Store for 7 days
    console.log("Stored std_id in cookies:", stdId);
  };
  React.useEffect(() => {
    const governanceData = Cookies.get("selected_governance");
    console.log("governance", governanceData);
    if (governanceData) {
      try {
        const parsedGovernance = JSON.parse(governanceData);
        const governanceId = parsedGovernance[0]?.role_id;
        console.log("api callig standards");
        if (governanceId) {
          fetchStandardsApi(governanceId).then(setStandards);
        }
      } catch (error) {
        console.error("Error parsing governance data:", error);
      }
    }
  }, []);

  // Log updated standards when they change
  React.useEffect(() => {
    console.log("Updated standards:", standards);
  }, [standards]);

  // Define the navigation menu
  const navMain = [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Portfolio",
      url: "/home/portfolio",
      icon: BriefcaseBusiness,
      items: standards.map((standard) => {
        console.log("Mapping standard:", standard.std_code);
        return {
          title: standard.std_code,
          url: "/home/portfolio",
          onClick: () => {
            console.log("Clicked:", standard.std_code);
            handleStandardClick(standard.std_id);
          },
        };
      }),
    },
    {
      title: "Role/ User Management",
      url: "#",
      icon: UserCog,
    },
    {
      title: "My Activities",
      url: "#",
      icon: FileCheck2,
    },
    {
      title: "Configuration",
      url: "#",
      icon: Cog,
    },
    {
      title: "Reports",
      url: "#",
      icon: FileChartColumn,
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookMarked,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props} className="bg-black text-white font-light">
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: "username", role: "rolename", avatar: "/avatars/shadcn.jpg" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
