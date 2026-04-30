"use client";

import { Breadcrumbs as HeroBreadcrumbs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";

import type { Paths } from "./types";
import { cn } from "@/lib/utils";

export type BreadcrumbsProps = {
  paths: Paths;
  className?: string;
};

export const Breadcrumbs = memo(function Breadcrumbs({
  paths,
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname() || "/";
  const items = useMemo(
    () => buildBreadcrumbItems(pathname, paths),
    [pathname, paths],
  );

  const BREADCRUMB_SEPARATOR = useMemo(
    () => <span className="text-fg-4! shrink-0">/</span>,
    [],
  );

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "min-w-0 touch-pan-x overflow-x-auto overflow-y-hidden",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <HeroBreadcrumbs
        className={cn(
          "breadcrumbs flex min-w-max flex-nowrap items-center whitespace-nowrap",
        )}
        separator={BREADCRUMB_SEPARATOR}
      >
        {items.map((item, i) =>
          item.href ? (
            <HeroBreadcrumbs.Item
              key={`${i}-${item.title}-${item.href}`}
              className="no-underline"
              href={item.href}
            >
              <span className="mr-1 whitespace-nowrap text-[0.8rem] text-fg-4!">
                {item.title}
              </span>
            </HeroBreadcrumbs.Item>
          ) : (
            <HeroBreadcrumbs.Item
              key={`${i}-${item.title}-${String(item.isCurrent)}`}
              className={cn(
                "no-underline",
                "pointer-events-none cursor-default",
                "no-underline!",
                "data-hovered:no-underline",
              )}
            >
              <span
                className={cn(
                  "mr-1 whitespace-nowrap text-[0.8rem]",
                  item.isCurrent
                    ? "hover:text-fg-1! data-hovered:text-fg-1!"
                    : "hover:text-fg-4! data-hovered:text-fg-4!",
                )}
              >
                {item.title}
              </span>
            </HeroBreadcrumbs.Item>
          ),
        )}
      </HeroBreadcrumbs>
    </div>
  );
});

// ---------------------------------------------------------------------------
// 以下为面包屑数据构建辅助函数
// ---------------------------------------------------------------------------

type BreadcrumbItem = {
  title: string;
  href: string | null;
  isCurrent: boolean;
};

type Step = { node: Paths; endExclusive: number };

/**
 * 将路径按 `/` 拆成段数组；根路径或空串返回空数组。
 */
function segs(p: string) {
  if (!p || p === "/") return [] as string[];
  return p.split("/").filter(Boolean);
}

/**
 * 若路径无前置 `/` 则先补上，再拆成段（与 `segs` 配合用于路由配置里的 path）。
 */
function rootSegs(path: string) {
  return segs(path.startsWith("/") ? path : `/${path}`);
}

/**
 * 取路径去掉开头 `/` 之后的第一段，用于和路由里配置的各段做比对。
 */
function firstSeg(p: string) {
  return p.replace(/^\//, "").split("/").filter(Boolean)[0] ?? "";
}

/**
 * 判断某段路径是否为动态参数（以 `:` 开头，如 `:id`）。
 */
function isDyn(p: string) {
  return firstSeg(p).startsWith(":");
}

/**
 * 将路由上的模板段与 URL 中实际段比对：动态段恒视为匹配，否则要求字面一致。
 */
function matchSeg(pat: string, u: string) {
  return isDyn(pat) ? true : firstSeg(pat) === u;
}

/**
 * 由已匹配的段下标，拼出到该层为止的 URL 前缀（用于可点击的面包屑链）。
 */
function prefixPath(parts: string[], end: number) {
  return end <= 0 ? "/" : `/${parts.slice(0, end).join("/")}`;
}

/**
 * 路由树子节点在「当前这一 URL 段」下应落到哪条：先找静态 path 完全匹配，没有则用动态子路由。
 */
function findChild(ch: Paths[], seg: string) {
  const s = ch.find((c) => !isDyn(c.path) && firstSeg(c.path) === seg);
  if (s) return s;
  return ch.find((c) => isDyn(c.path));
}

/**
 * 该路由节点是否对应真实页面；`hasPage === false` 时只作分组、不出可点链接。
 */
function hasPage(n: Paths) {
  return n.hasPage !== false;
}

/**
 * 自根路由起沿当前路径逐级向下匹配，得到每一级命中的 `Paths` 节点及在 pathname 中已消费的段数。
 */
function buildSteps(pathname: string, root: Paths): Step[] | null {
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

/**
 * 将匹配步骤展开为带标题、链接、是否当前项的面包屑列表；`workspace-paths.json` 中标题为空的段会略去，并保证最后一项为「当前」。
 */
function buildBreadcrumbItems(pathname: string, root: Paths): BreadcrumbItem[] {
  const steps = buildSteps(pathname, root);
  if (steps == null || steps.length === 0) return [];
  const parts = segs(pathname);
  const n = steps.length;
  const items = steps.map((step, i) => {
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
  const visible = items.filter((item) => item.title.trim() !== "");
  if (visible.length === 0) return [];
  return visible.map((item, i, arr) => ({
    ...item,
    isCurrent: i === arr.length - 1,
  }));
}
