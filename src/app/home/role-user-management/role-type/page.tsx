"use client";
import BreadCrumbsProvider from "@/components/ui/breadCrumbsProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const roles = [
    { id: 1, name: "Client Admin" },
    { id: 2, name: "Performer" },
    { id: 3, name: "Auditor" },
];

export default function HomePage() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [pageSize, setPageSize] = useState(5);


    const itemsPerPage = pageSize;

    // Filter roles based on search input
    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRoles = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        ;
    };


    return (
        <div className="py-0 px-4">
            <BreadCrumbsProvider />
            <div className="flex items-center justify-end py-2 space-x-1">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm px-3 h-7 text-[11px] bg-[#f9fafb] dark:bg-[#e5e5e5]"
                />
            </div>

            {/* Table */}
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[#4F028F] dark:bg-[#6E3A99] z-100">
                    <tr className="text-white text-[12px] px-1 h-7 bg-[#4F028F] dark:bg-[#6E3A99] text-left">
                        <th >Role ID</th>
                        <th >Role Name</th>
                    </tr>
                </thead>
                <tbody className="overflow-y-auto">
                    {currentRoles.length > 0 ? (
                        currentRoles.map((role, index) => (
                            <tr key={role.id} className={`text-[11px] transition-colors hover:bg-[var(--hover-bg)] ${index % 2 === 0 ? 'bg-[var(--table-bg-even)] text-black' : 'bg-[var(--table-bg-odd)] text-black'
                                }`}>
                                <td className="border-b p-1">{role.id}</td>
                                <td className="border-b p-1">{role.name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="p-2 text-center text-[11px]">
                                No results found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="fixed bottom-[20px] w-[80%] flex items-center justify-between py-4 mr-4">
                <div className="flex items-center space-x-2 relative">
                    <span className="text-[11px]">Items per page</span>
                    <button
                        className="border px-2 py-1 rounded flex justify-end text-[10px]"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {pageSize} ▼
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-[-60px] left-[60%] mt-1 bg-white border rounded shadow-lg z-10 text-[10px]">
                            {[5, 10, 25, 50].map((size) => (
                                <button
                                    key={size}
                                    className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                                    onClick={() => {
                                        handlePageSizeChange(size);
                                        setIsDropdownOpen(false); // Close the dropdown after selection
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4 text-[10px]">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] text-[#0392cb] dark:text-[#69c3df]"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        {"<"}
                    </Button>
                    <span>
                        {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredRoles.length)} of {filteredRoles.length}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] text-[#0392cb] dark:text-[#69c3df]"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        {">"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
