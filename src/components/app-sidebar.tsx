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
import { UserInfo } from "@/models/auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const [standards, setStandards] = useState<Standard[] | null>([]);
  const router = useRouter();
  const govId = Cookies.get("selected_governance");
  const userData = Cookies.get("user_info");
  const [parsedUserData, setParsedUserData] = useState(null);

  const handleStandardClick = (stdId: number, stdCode: string) => {
    // Cookies.set("std_id", JSON.stringify(stdId), { expires: 7 }); // Store for 7 days
    // console.log("Stored std_id in cookies:", stdId);
    // router.push("/home/portfolio");
    // window.location.reload();
    dispatch(setSubBredCrum(stdCode));
    dispatch(changeSelectedStanderds(stdId));
  };

  const handleFetchStanders = async (parsedGovId: number) => {
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
      console.log(parsedGovId);
      handleFetchStanders(parsedGovId[0].role_id);
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
      items: standards?.map((standard) => {
        return {
          title: standard.std_code,
          url: "/home/portfolio",
          onClick: () => {
            console.log("Clicked:", standard.std_code);
            handleStandardClick(standard.std_id, standard.std_code);
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
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-black text-white font-light"
    >
      <SidebarHeader className="pt-5 ">
        <Image
          src="/logo-no-background.svg"
          alt="logo"
          width={800}
          height={800}
          className="w-full  bg-white "
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
