import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Payment, columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            appRevAreaName: 100,
            revAreaDetails: "pending",
            applicable: "m@example.com",
            justification: "nil",
        },
        {
            id: "728ed52f",
            appRevAreaName: 100,
            revAreaDetails: "pending",
            applicable: "m@example.com",
            justification: "nil",
        },
        {
            id: "728ed52f",
            appRevAreaName: 100,
            revAreaDetails: "pending",
            applicable: "m@example.com",
            justification: "nil",
        },
    ]
}

export default async function Page() {
    const data = await getData()
    return (
        <div className="flex flex-col w-full">
            <header className="flex flex-col h-16 shrink-0 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="px-4 text-[30px]">Dashboard</div>
                <div className="flex items-center gap-2 px-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbEllipsis />
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="py-10 w-full px-4">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}
