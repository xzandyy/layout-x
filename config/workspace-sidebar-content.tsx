import {
  BookOpen,
  FileText,
  House,
  Info,
  LayoutGrid,
  Laptop,
  LifeBuoy,
  Package2,
  ShoppingBag,
  Smartphone,
} from "lucide-react";

import type { SidebarContentConfig } from "@/components/layout-x";

/** 根布局侧栏配置，与路由大致对齐。 */
export const workspaceSidebarContent: SidebarContentConfig = {
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
