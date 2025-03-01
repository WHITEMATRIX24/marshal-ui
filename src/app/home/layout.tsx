import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { GovernanceSelectPopUp } from "@/components/auth/gov-select-popup";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="w-full ml-[0px] mt-[10px]">
        <Header />
        {children}
        <Footer />
      </main>
      <GovernanceSelectPopUp />
    </SidebarProvider>
  );
}
