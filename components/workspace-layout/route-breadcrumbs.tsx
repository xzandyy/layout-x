"use client";

import { Breadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import type { Router } from "@/config/routes";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  title: string;
  href: string | null;
  isCurrent: boolean;
};

function segs(p: string) {
  if (!p || p === "/") return [] as string[];
  return p.split("/").filter(Boolean);
}

function rootSegs(path: string) {
  return segs(path.startsWith("/") ? path : `/${path}`);
}

function firstSeg(p: string) {
  return p.replace(/^\//, "").split("/").filter(Boolean)[0] ?? "";
}

const isDyn = (p: string) => firstSeg(p).startsWith(":");
const matchSeg = (pat: string, u: string) =>
  isDyn(pat) ? true : firstSeg(pat) === u;

function findChild(ch: Router[], seg: string) {
  const s = ch.find((c) => !isDyn(c.path) && firstSeg(c.path) === seg);
  if (s) return s;
  return ch.find((c) => isDyn(c.path));
}

const hasPage = (n: Router) => n.hasPage !== false;

function prefixPath(parts: string[], end: number) {
  return end <= 0 ? "/" : `/${parts.slice(0, end).join("/")}`;
}

type Step = { node: Router; endExclusive: number };

function buildSteps(pathname: string, root: Router): Step[] | null {
  const parts = segs(pathname);
  const base = rootSegs(root.path);
  for (let i = 0; i < base.length; i++) {
    if (i >= parts.length) return null;
    if (!matchSeg(`/${base[i]}`, parts[i]!)) return null;
  }
  const steps: Step[] = [{ node: root, endExclusive: base.length }];
  let rem = parts.slice(base.length);
  let cur = root;
  while (rem.length) {
    if (!cur.children?.length) break;
    const child = findChild(cur.children, rem[0]!);
    if (!child) break;
    steps.push({
      node: child,
      endExclusive: steps[steps.length - 1]!.endExclusive + 1,
    });
    rem = rem.slice(1);
    cur = child;
  }
  return steps;
}

function buildBreadcrumbItems(
  pathname: string,
  root: Router,
): BreadcrumbItem[] {
  const steps = buildSteps(pathname, root);
  if (steps == null || steps.length === 0) return [];
  const parts = segs(pathname);
  const n = steps.length;
  return steps.map((step, i) => {
    const last = i === n - 1;
    if (last) {
      return { title: step.node.title, href: null, isCurrent: true };
    }
    if (!hasPage(step.node)) {
      return { title: step.node.title, href: null, isCurrent: false };
    }
    return {
      title: step.node.title,
      href: prefixPath(parts, step.endExclusive),
      isCurrent: false,
    };
  });
}

export type RouteBreadcrumbsProps = {
  route: Router;
  className?: string;
};

export function RouteBreadcrumbs({ route, className }: RouteBreadcrumbsProps) {
  const pathname = usePathname() || "/";
  const items = useMemo(
    () => buildBreadcrumbItems(pathname, route),
    [pathname, route],
  );

  if (items.length === 0) return null;

  const staticItemClass = cn(
    "no-underline",
    "pointer-events-none cursor-default",
    "text-foreground !no-underline",
    "hover:!text-foreground",
    "data-[hovered]:!text-foreground data-[hovered]:no-underline",
  );

  return (
    <Breadcrumbs
      aria-label="Breadcrumb"
      className={cn(
        "route-breadcrumbs min-w-0 flex-wrap items-center",
        className,
      )}
      separator={<span className="text-muted">/</span>}
    >
      {items.map((item, i) =>
        item.href ? (
          <Breadcrumbs.Item
            key={`${i}-${item.title}-${item.href}`}
            className="no-underline"
            href={item.href}
          >
            <span className="mr-1">{item.title}</span>
          </Breadcrumbs.Item>
        ) : (
          <Breadcrumbs.Item
            key={`${i}-${item.title}-${String(item.isCurrent)}`}
            className={staticItemClass}
          >
            <span className="mr-1">{item.title}</span>
          </Breadcrumbs.Item>
        ),
      )}
    </Breadcrumbs>
  );
}
