import type { BreadcrumbRouteNode } from "@/lib/breadcrumb-route";

/** 根路径为 `/` 的示例，用于当前首页。 */
export const homeBreadcrumbRoute: BreadcrumbRouteNode = {
  path: "/",
  meta: { title: "首页" },
};

/**
 * 与下列路径对应：`/products`、`/products/phones`、`/products/phones/:type/:year/:id`。
 * - `:type` 无 index（`hasPage: false`）；
 * - `:year` 有独立页（`hasPage` 默认 `true`）；
 * - `:id` 为详情。
 */
export const productBreadcrumbTree: BreadcrumbRouteNode = {
  path: "/products",
  meta: { title: "产品" },
  children: [
    {
      path: "phones",
      meta: { title: "手机" },
      children: [
        {
          path: ":type",
          meta: { title: "类型" },
          hasPage: false,
          children: [
            {
              path: ":year",
              meta: { title: "年份" },
              children: [
                {
                  path: ":id",
                  meta: { title: "详情" },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * 演示「中间段无 index」：`/phones` 无 page（`hasPage: false`），仅 `/phones/a` 等有 page。
 * 与 `app/phones/a/page.tsx` 同用；访问 `/phones/a` 查看面包屑效果。
 */
export const phonesSegmentBreadcrumbTree: BreadcrumbRouteNode = {
  path: "/",
  meta: { title: "首页" },
  children: [
    {
      path: "phones",
      meta: { title: "手机" },
      hasPage: false,
      children: [
        {
          path: "a",
          meta: { title: "A 区" },
        },
      ],
    },
  ],
};
