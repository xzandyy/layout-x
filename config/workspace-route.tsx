import {
  BookOpen,
  FileText,
  House,
  Info,
  Laptop,
  LayoutGrid,
  LifeBuoy,
  Package2,
  Settings2,
  ShoppingBag,
  Smartphone,
  User,
  Wrench,
} from "lucide-react";

import type { RouteConfig, SidebarContentConfig } from "@/components/layout-x";

/** 主工作区：首页、内容、产品（与站内路由对齐）。 */
const workspaceSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      menu: [
        {
          icon: <House size={16} />,
          label: "首页",
          href: "/",
        },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "内容",
      menu: [
        {
          icon: <BookOpen size={16} />,
          label: "文档",
          children: [
            {
              icon: <FileText size={16} />,
              label: "文档中心",
              href: "/docs",
            },
            {
              icon: <FileText size={16} />,
              label: "使用指南",
              href: "/docs/guide",
            },
          ],
        },
        {
          icon: <LifeBuoy size={16} />,
          label: "帮助与支持",
          href: "/support",
        },
        {
          icon: <Info size={16} />,
          label: "关于",
          href: "/about",
        },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "产品",
      menu: [
        {
          icon: <ShoppingBag size={16} />,
          label: "产品总览",
          children: [
            {
              icon: <LayoutGrid size={16} />,
              label: "产品列表",
              href: "/products",
            },
            {
              icon: <Smartphone size={16} />,
              label: "手机",
              href: "/products/phones",
            },
            {
              icon: <Laptop size={16} />,
              label: "笔记本",
              href: "/products/laptops",
            },
            {
              icon: <Package2 size={16} />,
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
          icon: <Wrench size={16} />,
          label: "工具台",
          href: "/tools",
        },
        {
          icon: <FileText size={16} />,
          label: "文档中心",
          href: "/docs",
        },
        {
          icon: <LifeBuoy size={16} />,
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
          icon: <User size={16} />,
          label: "个人资料",
          href: "/profile",
        },
        {
          icon: <Settings2 size={16} />,
          label: "账户设置",
          href: "/settings",
        },
        {
          icon: <Info size={16} />,
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
      icon: <LayoutGrid size={20} />,
      sidebar: workspaceSidebar,
    },
    {
      id: "tools",
      label: "工具",
      icon: <Wrench size={20} />,
      sidebar: toolsSidebar,
    },
    {
      id: "account",
      label: "我的",
      icon: <User size={20} />,
      sidebar: accountSidebar,
    },
  ],
};
