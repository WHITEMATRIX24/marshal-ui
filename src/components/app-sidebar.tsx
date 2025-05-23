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
import {
  setMainBreadcrumb,
  setSubBredCrum,
} from "@/lib/global-redux/features/uiSlice";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const { open } = useSidebar(); // Get the sidebar state
  const [standards, setStandards] = useState<{
    items: Standard[];
    total: number;
  } | null>(null);
  const router = useRouter();
  const govId = Cookies.get("selected_governance");
  const token = Cookies.get("access_token");
  const userData = Cookies.get("user_info");
  const [parsedUserData, setParsedUserData] = useState(null);
  const [role, setRole] = useState<string | null>(null);
  const handleStandardClick = (stdId: number, stdCode: string) => {
    dispatch(setSubBredCrum(stdCode));
    dispatch(changeSelectedStanderds(stdId));
  };

  const handleFetchStandards = async (parsedGovId: number) => {
    try {
      const response = await fetchStandardsApi({
        method: "GET",
        urlEndpoint: `/standards/by-governance/${parsedGovId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      console.log("parsed gov id", parsedGovId.governance_id);
      handleFetchStandards(parsedGovId.governance_id);
      setRole(parsedGovId.role_name);
    }
  }, [govId]);

  useEffect(() => {
    if (userData) {
      setParsedUserData(JSON.parse(userData));
      console.log("userData", userData);
    }
  }, [userData]);

  // Define the navigation menu
  const navMain = [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      onClick: () => dispatch(setMainBreadcrumb("Dashboard")),
      items: [
        {
          title: "Dashboard 1",
          url: "/home/dashboard/Dashboard-1",
          onClick: () => {
            dispatch(setMainBreadcrumb("Dashboard 1"));
            dispatch(setSubBredCrum(""));
          },
        },
        {
          title: "Dashboard 2",
          url: "/home/dashboard/Dashboard-2",
          onClick: () => {
            dispatch(setMainBreadcrumb("Dashboard 2"));
            dispatch(setSubBredCrum(""));
          },
        },
      ],
    },
    {
      title: "Portfolio",
      url: "/home/portfolio",
      icon: BriefcaseBusiness,
      items: standards?.items.map((standard) => ({
        title: standard.std_short_name,
        url: "/home/portfolio",
        onClick: () => {
          handleStandardClick(standard.id, standard.std_short_name);
          dispatch(setMainBreadcrumb("PORTFOLIO"));
        },
      })),
    },
    {
      title: "My Tasks",
      url: "#",
      icon: FileCheck2,
      items: [
        {
          title: "View/Edit Tasks",
          url: "/home/activites/view-activity",
          onClick: () => {
            dispatch(setMainBreadcrumb("View / Edit Activity"));
            dispatch(setSubBredCrum(""));
          },
        },
        {
          title: "View/Edit Assignment",
          url: "/home/activites/view-assignment",
          onClick: () => {
            dispatch(setMainBreadcrumb("View / Edit Assignment"));
            dispatch(setSubBredCrum(""));
          },
        },
        {
          title: "My Notification",
          url: "/home/activites/my-notifications",
          onClick: () => {
            dispatch(setMainBreadcrumb("My Notifications"));
            dispatch(setSubBredCrum(""));
          },
        },
        {
          title: "My Reviews",
          url: "/home/activites/my-reviews",
          onClick: () => {
            dispatch(setMainBreadcrumb("My Reviews"));
            dispatch(setSubBredCrum(""));
          },
        },
      ],
    },
    {
      title: "Configuration",
      url: "#",
      icon: Cog,
      items: [
        ...(role?.toLowerCase().includes("admin")
          ? [
            {
              title: "Create Assignment",
              url: "/home/configuration/assign-assignment",
              onClick: () => {
                dispatch(setMainBreadcrumb("Add Assignment"));
                dispatch(setSubBredCrum(""));
              },
            },
          ]
          : []),
        {
          title: "Create/View Compliance",
          url: "/home/configuration/create-or-view-compliance",
          onClick: () => {
            dispatch(setMainBreadcrumb("Add / View Compliance"));
            dispatch(setSubBredCrum(""));
          },
        },
      ],
    },
    { title: "Reports", url: "#", icon: FileChartColumn },
    {
      title: "Documentation",
      url: "#",
      icon: BookMarked,
      items: [
        {
          title: "Documentation",
          url: "/home/documentation/documentation",
          onClick: () => {
            dispatch(setMainBreadcrumb("Documentation"));
            dispatch(setSubBredCrum(""));
          },
        },
      ],
    },
  ];
  if (role?.toLowerCase().includes("admin")) {
    navMain.splice(2, 0, {
      title: "Role/User Management",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Role Type",
          url: "/home/role-user-management/role-type",
          onClick: () => {
            dispatch(setMainBreadcrumb("Role / User Management"));
            dispatch(setSubBredCrum(""));
          },
        },
        {
          title: "Create or Update Users",
          url: "/home/role-user-management/create-or-update-users",
          onClick: () => {
            dispatch(setMainBreadcrumb("Role / User Management"));
            dispatch(setSubBredCrum(""));
          },
        },
        {
          title: "Create or Update Roles",
          url: "/home/role-user-management/create-or-update-roles",
          onClick: () => {
            dispatch(setMainBreadcrumb("Role / User Management"));
            dispatch(setSubBredCrum(""));
          },
        },
      ],
    });
  }

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-black/85 dark:bg-black text-white font-light"
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
