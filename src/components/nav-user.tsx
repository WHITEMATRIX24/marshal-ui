"use client";

import {
  BadgeCheck,
  Bell,
  Blend,
  ChevronsUpDown,
  CreditCard,
  Edit2,
  LogOut,
  Sparkles,
  User2,
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
import { Role, UserInfo } from "@/models/auth";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { formatName } from "@/utils/formater";

export function NavUser({ user, avatar }: { user: UserInfo; avatar: string }) {
  if (!user) return;
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const selectedGovernance = Cookies.get("selected_governance");
  const selectedGovernanceKey = Cookies.get("selected_governance_key");
  const parsedSelectedGovernance = selectedGovernance
    ? JSON.parse(selectedGovernance)
    : [];

  const handleChangeGovernance = () => {
    dispatch(showGovernanveModal());
  };

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
                <AvatarImage
                  src="/user.svg"
                  alt={user?.username}
                  className="w-[30px] h-[30px] p-0.5 bg-white rounded-[5px]"
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-[11px] dark:text-[#E18358] text-[#c20114]">
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
                <Avatar className="h-6 w-6 rounded-lg">
                  <AvatarImage
                    src="/user.svg"
                    alt={formatName(user?.username)}
                    className="w-[25px] h-[25px] p-0 bg-white rounded-[5px]"
                  />
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
