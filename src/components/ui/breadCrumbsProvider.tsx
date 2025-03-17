"use client";

import { RootState } from "@/lib/global-redux/store";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

const BreadCrumbsProvider = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastTwoSegment =
    pathSegments.length > 2
      ? pathSegments.slice(pathSegments.length - 2)
      : pathSegments.slice(pathSegments.length - 1);
  const subMenu = useSelector((state: RootState) => state.ui.subBreadCrum);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-[11px]">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis className="text-[11px]" />
        </BreadcrumbItem>
        {lastTwoSegment &&
          lastTwoSegment.length > 0 &&
          lastTwoSegment.map((lastSegment) => (
            <div className="flex items-center gap-3" key={lastSegment}>
              <BreadcrumbSeparator className="ms-3" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[11px]">
                  {decodeURIComponent(lastSegment).replace(/-/g, " ")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </div>
          ))}
        {subMenu && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[11px]">{subMenu}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbsProvider;
