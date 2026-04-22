/**
 * 全局通用路由树节点（面包屑/导航等共用）。
 * `hasPage` 默认 `true`；无该 URL 前缀的独立 page 时显式为 `false`。
 */
export type Router = {
  path: string;
  title: string;
  hasPage?: boolean;
  children?: Router[];
};

/**
 * 全站唯一路由树（根为 `/`）：`/products/.../phones/:type/:year/:id`；`:type` 无 index，`:year` 有 page。
 * 与壳层配合见 `app/layout.tsx`；首页链接（如指向 `/products`）在 `app/page.tsx`。
 */
export const appRouter: Router = {
  path: "/",
  title: "首页",
  children: [
    {
      path: "products",
      title: "产品",
      children: [
        {
          path: "phones",
          title: "手机",
          children: [
            {
              path: ":type",
              title: "类型",
              hasPage: false,
              children: [
                {
                  path: ":year",
                  title: "年份",
                  children: [
                    {
                      path: ":id",
                      title: "详情",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
