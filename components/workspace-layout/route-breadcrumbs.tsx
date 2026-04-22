"use client";

import { Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import type { BreadcrumbRouteNode } from "@/lib/breadcrumb-route";
import { buildBreadcrumbItems } from "@/lib/breadcrumb-route";
import { cn } from "@/lib/utils";

export type RouteBreadcrumbsProps = {
  /** 单根路由树，如 `{ path: "/products", meta: { title: "产品" }, children: [...] }` */
  route: BreadcrumbRouteNode;
  className?: string;
};

/**
 * 根据当前 `pathname` 与路由树匹配面包屑。使用 HeroUI `Breadcrumbs` + `Breadcrumbs.Item`（与官方文档一致：有 `href` 可点，无 `href` 为仅展示/当前节）。
 * 由 `WorkspaceLayout` 顶栏使用；也可单独使用。
 * @see https://heroui.com/docs/react/components/breadcrumbs
 */
export function RouteBreadcrumbs({ route, className }: RouteBreadcrumbsProps) {
  const pathname = usePathname() || "/";
  const items = useMemo(
    () => buildBreadcrumbItems(pathname, route),
    [pathname, route],
  );

  if (items.length === 0) {
    return null;
  }

  const staticItemClass = cn(
    "no-underline",
    "pointer-events-none cursor-default",
    "text-foreground !no-underline",
    "hover:!text-foreground",
    "data-[hovered]:!text-foreground data-[hovered]:no-underline",
  );

  return (
    <Breadcrumbs aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      {items.map((item, i) =>
        item.href ? (
          <Breadcrumbs.Item
            key={`${i}-${item.title}-${item.href}`}
            className="no-underline"
            href={item.href}
          >
            {item.title}
          </Breadcrumbs.Item>
        ) : (
          <Breadcrumbs.Item
            key={`${i}-${item.title}-${String(item.isCurrent)}`}
            className={staticItemClass}
          >
            {item.title}
          </Breadcrumbs.Item>
        ),
      )}
    </Breadcrumbs>
  );
}
