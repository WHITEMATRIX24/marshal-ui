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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [standards, setStandards] = useState<Standerds[] | null>([]);
  const router = useRouter();
  const govId = Cookies.get("selected_governance");

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
            // handleStandardClick(standard.std_id);
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
      <SidebarHeader className="pt-5">
        <Image
          src="/logo-no-background.svg"
          alt="logo"
          width={500}
          height={500}
          className="w-full"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "username",
            role: "rolename",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
