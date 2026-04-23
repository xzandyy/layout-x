import appRouterJson from "./routes.json";

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
 * 全站路由树，由 `pnpm run generate:routes` 根据 `app/` 扫描生成并写入 `routes.json`。
 */
export const appRouter = appRouterJson as Router;
