"use client"
import { usePathname } from "next/navigation";
import { Bell, Settings, MoreVertical } from "lucide-react";

const Header = () => {
    const pathname = usePathname();

    // Extract the page name from the pathname
    const getPageTitle = (path: string) => {
        const segments = path.split("/").filter(Boolean);
        return segments.length > 0 ? segments[segments.length - 1].replace(/-/g, " ") : "Dashboard";
    };

    return (
        <header className="flex items-center justify-between w-full h-16  ">
            <h1 className="text-[30px] font-semibold capitalize px-4">{getPageTitle(pathname)}</h1>
            <div className="flex items-center gap-5 mr-4">
                <Bell className="w-[18px] h-[18px] cursor-pointer" />
                <Settings className="w-[18px] h-[18px] cursor-pointer" />
                <MoreVertical className="w-[18px] h-[18px] cursor-pointer" />
            </div>
        </header>
    );
};

export default Header;
