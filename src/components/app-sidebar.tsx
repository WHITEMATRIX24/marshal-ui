"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import Image from "next/image";
import { Standard } from "@/models/standards";
import { useDispatch } from "react-redux";
import { changeSelectedStanderds } from "@/lib/global-redux/features/standerdsSlice";
import { setSubBredCrum } from "@/lib/global-redux/features/uiSlice";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const { open } = useSidebar(); // Get the sidebar state
  const [standards, setStandards] = useState<Standard[] | null>([]);
  const router = useRouter();
  const govId = Cookies.get("selected_governance");
  const userData = Cookies.get("user_info");
  const [parsedUserData, setParsedUserData] = useState(null);

  const handleStandardClick = (stdId: number, stdCode: string) => {
    dispatch(setSubBredCrum(stdCode));
    dispatch(changeSelectedStanderds(stdId));
  };

  const handleFetchStandards = async (parsedGovId: number) => {
    try {
      const response = await fetchStandardsApi({
        method: "GET",
        urlEndpoint: `/standards/governance/${parsedGovId}`,
      });
      setStandards(response.data);
    } catch (error) {
      console.log(error);
      setStandards(null);
      router.push("/home/dashboard");
    }
  };

  useEffect(() => {
    if (govId) {
      const parsedGovId = JSON.parse(govId);
      handleFetchStandards(parsedGovId[0].role_id);
    }
  }, [govId]);

  useEffect(() => {
    if (userData) {
      setParsedUserData(JSON.parse(userData));
    }
  }, []);

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
      items: standards?.map((standard) => ({
        title: standard.std_code,
        url: "/home/portfolio",
        onClick: () => handleStandardClick(standard.id, standard.std_code),
      })),
    },
    { title: "Role/ User Management", url: "#", icon: UserCog },
    { title: "My Activities", url: "#", icon: FileCheck2 },
    { title: "Configuration", url: "#", icon: Cog },
    { title: "Reports", url: "#", icon: FileChartColumn },
    { title: "Documentation", url: "#", icon: BookMarked },
  ];

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-black text-white font-light"
    >
      <SidebarHeader className="pt-5">
        <Image
          src={open ? "/logo-no-background.svg" : "/logo-short.png"} // Different logos based on sidebar state
          alt="logo"
          width={open ? 40 : 800}
          height={open ? 40 : 800}
          className="w-full  bg-white rounded-[7px]"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        {parsedUserData && (
          <NavUser user={parsedUserData} avatar="/avatars/shadcn.jpg" />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
