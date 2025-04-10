"use client";

import {
  Blend,
  ChevronsUpDown,
  Edit2,
  LogOut,
  UserRoundPen,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { showGovernanveModal } from "@/lib/global-redux/features/uiSlice";
import { useDispatch } from "react-redux";
import { UserInfo } from "@/models/auth";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { formatName } from "@/utils/formater";
import { fetchProfilePhotoApi } from "@/services/apis";
import { useQuery } from "@tanstack/react-query";

export function NavUser({ user }: { user: UserInfo; avatar: string }) {
  if (!user) return;
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const selectedGovernance = Cookies.get("selected_governance");
  const selectedGovernanceKey = Cookies.get("selected_governance_key");
  const token = Cookies.get("access_token");
  const parsedSelectedGovernance = selectedGovernance
    ? JSON.parse(selectedGovernance)
    : [];

  const handleChangeGovernance = () => {
    dispatch(showGovernanveModal());
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["profilePicture"],
    queryFn: async () => {
      const response = await fetchProfilePhotoApi({
        method: "GET",
        urlEndpoint: "/profile-photos/profile-photo/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data || "";
    },
  });
  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("login_popup_initila_render");
    Cookies.remove("roles");
    Cookies.remove("selected_governance");
    Cookies.remove("token_type");
    Cookies.remove("user_info");

    redirect("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {isLoading ? (
                  <p className="text-[6px]">Loading..</p>
                ) : error ? (
                  <AvatarImage
                    src="/user.svg"
                    alt={user?.username}
                    className="w-[30px] h-[30px] p-0.5 bg-white rounded-[5px]"
                  />
                ) : (
                  <AvatarImage
                    src={data?.photo_url || "/user.svg"}
                    alt={user?.username}
                    className="w-[30px] h-[30px] p-0.5 bg-white rounded-[5px]"
                  />
                )}

                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-[11px] ]">
                  {formatName(user?.username)}
                </span>
                <span className="truncate text-[10px] text-white">
                  {user?.email_address}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {isLoading ? (
                    <p className="text-[6px]">Loading..</p>
                  ) : error ? (
                    <AvatarImage
                      src="/user.svg"
                      alt={user?.username}
                      className="w-[30px] h-[30px] p-0.5 bg-white rounded-[5px]"
                    />
                  ) : (
                    <AvatarImage
                      src={data?.photo_url || "/user.svg"}
                      alt={user?.username}
                      className="w-[30px] h-[30px] p-0.5 bg-white rounded-[5px]"
                    />
                  )}

                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-[11px] leading-tight">
                  <span className="truncate font-semibold text-[13px]">
                    {formatName(user?.username)}
                  </span>
                  {parsedSelectedGovernance && (
                    <span className="truncate text-[11px]">
                      {parsedSelectedGovernance?.governance_name}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-[11px]">
                <Blend />
                {`Governance: ${parsedSelectedGovernance?.governance_name}`}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-[11px]">
                <Edit2 />
                <button
                  onClick={handleChangeGovernance}
                  className="text-[11px]"
                >
                  Change Governance
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem className="pointer-events-none opacity-50 text-[11px]">
                <UserRoundPen />
                Change Role
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-[11px]">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
