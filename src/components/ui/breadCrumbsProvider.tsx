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

const formatBreadcrumb = (text: string) => {
  return text
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

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
          <BreadcrumbLink href="/" className="text-[11px] text-[var(--purple)]">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        {lastTwoSegment.length > 0 &&
          lastTwoSegment.map((segment) => (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[11px]">
                  {formatBreadcrumb(decodeURIComponent(segment))}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </React.Fragment>
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
