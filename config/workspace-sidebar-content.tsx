import { House, ShoppingBag, Smartphone } from "lucide-react";

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
      label: "产品",
      menu: [
        {
          icon: <ShoppingBag size={16} />,
          label: "产品总览",
          href: "/products",
          children: [
            {
              icon: <Smartphone size={16} />,
              label: "手机",
              href: "/products/phones",
            },
          ],
        },
      ],
    },
  ],
};
