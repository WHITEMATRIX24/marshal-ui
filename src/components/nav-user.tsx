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

export function NavUser({ user, avatar }: { user: UserInfo; avatar: string }) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const selectedGovernance = Cookies.get("selected_governance");
  const selectedGovernanceKey = Cookies.get("selected_governance_key");
  const parsedSelectedGovernance = selectedGovernance
    ? JSON.parse(selectedGovernance)
    : [];
  console.log(parsedSelectedGovernance);

  const handleChangeGovernance = () => {
    dispatch(showGovernanveModal());
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
                <AvatarImage src={avatar} alt={user.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
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
                  <AvatarImage src={avatar} alt={user.username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                  {parsedSelectedGovernance && (
                    <span className="truncate text-xs">
                      {parsedSelectedGovernance[0]?.role_name}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Blend />
                {`Governance: ${selectedGovernanceKey}`}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Edit2 />
                <button onClick={handleChangeGovernance}>
                  Change Governance
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserRoundPen />
                Change Role
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
