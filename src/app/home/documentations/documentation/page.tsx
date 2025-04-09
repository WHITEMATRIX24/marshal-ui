import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";

export default function Documentation() {
    return (
        <>
            <div className="flex flex-col w-full mb-[50px]">
                <header className="flex flex-col shrink-0 gap-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <BreadCrumbsProvider />
                    </div>
                </header>
                <div className="py-16 w-full px-4 pe-20">Documentation</div>
            </div>
        </>
    );
}