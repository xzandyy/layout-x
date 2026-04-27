import {
  BookOpen,
  Box,
  CircleInfo,
  Display,
  FileText,
  House,
  LayoutCells,
  LayoutSideContentLeft,
  LifeRing,
  Person,
  ShoppingBag,
  Sliders,
  Smartphone,
  Wrench,
} from "@gravity-ui/icons";

import type { RouteConfig, SidebarContentConfig } from "@/components/layout-x";

const ic = "size-4 shrink-0 text-foreground/90";
const railIc = "size-5 shrink-0";

/** 主工作区：首页、内容、产品（与站内路由对齐）。 */
const workspaceSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      menu: [
        {
          icon: <House className={ic} />,
          label: "首页",
          href: "/",
        },
      ],
    },
    {
      type: "group",
      label: "内容",
      menu: [
        {
          icon: <BookOpen className={ic} />,
          label: "文档",
          children: [
            {
              icon: <FileText className={ic} />,
              label: "文档中心",
              href: "/docs",
            },
            {
              icon: <FileText className={ic} />,
              label: "使用指南",
              href: "/docs/guide",
            },
          ],
        },
        {
          icon: <LifeRing className={ic} />,
          label: "帮助与支持",
          href: "/support",
        },
        {
          icon: <CircleInfo className={ic} />,
          label: "关于",
          href: "/about",
        },
      ],
    },
    {
      type: "group",
      label: "产品",
      menu: [
        {
          icon: <ShoppingBag className={ic} />,
          label: "产品总览",
          children: [
            {
              icon: <LayoutCells className={ic} />,
              label: "产品列表",
              href: "/products",
            },
            {
              icon: <Smartphone className={ic} />,
              label: "手机",
              href: "/products/phones",
            },
            {
              icon: <Display className={ic} />,
              label: "笔记本",
              href: "/products/laptops",
            },
            {
              icon: <Box className={ic} />,
              label: "配件",
              href: "/products/accessories",
            },
          ],
        },
      ],
    },
  ],
};

/** 工具与效率：与「工具」Rail 项对应。 */
const toolsSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "工具",
      menu: [
        {
          icon: <Wrench className={ic} />,
          label: "工具台",
          href: "/tools",
        },
        {
          icon: <FileText className={ic} />,
          label: "文档中心",
          href: "/docs",
        },
        {
          icon: <LifeRing className={ic} />,
          label: "帮助与支持",
          href: "/support",
        },
      ],
    },
  ],
};

/** 账户与个人：与「我的」Rail 项对应。 */
const accountSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "我的",
      menu: [
        {
          icon: <Person className={ic} />,
          label: "个人资料",
          href: "/profile",
        },
        {
          icon: <Sliders className={ic} />,
          label: "账户设置",
          href: "/settings",
        },
        {
          icon: <CircleInfo className={ic} />,
          label: "关于我们",
          href: "/about",
        },
      ],
    },
  ],
};

/**
 * 根布局唯一 Route 配置：Rail 多入口，各自 `sidebar` 树。
 * URL 与当前 Rail 项的自动对齐由 `sidebar-routing` 从叶子 `href` 推导。
 */
export const workspaceRoute: RouteConfig = {
  defaultEntryId: "workspace",
  entries: [
    {
      id: "workspace",
      label: "工作区",
      icon: <LayoutSideContentLeft className={railIc} />,
      sidebar: workspaceSidebar,
    },
    {
      id: "tools",
      label: "工具",
      icon: <Wrench className={railIc} />,
      sidebar: toolsSidebar,
    },
    {
      id: "account",
      label: "我的",
      icon: <Person className={railIc} />,
      sidebar: accountSidebar,
    },
  ],
};
