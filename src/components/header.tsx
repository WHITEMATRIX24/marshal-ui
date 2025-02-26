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
            <div className="flex items-center gap-5 mr-2">
                <Bell className="w-6 h-6 cursor-pointer" />
                <Settings className="w-6 h-6 cursor-pointer" />
                <MoreVertical className="w-6 h-6 cursor-pointer" />
            </div>
        </header>
    );
};

export default Header;
