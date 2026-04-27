import appRouterJson from "./routes.json";

/**
 * Shared route tree node (breadcrumbs, nav, etc.).
 * `hasPage` defaults to `true`; set `false` when that URL segment has no `page.tsx`.
 */
export type Router = {
  path: string;
  title: string;
  hasPage?: boolean;
  children?: Router[];
};

/**
 * App route tree: generated into `routes.json` by `npm run gen-routes` from `app/`.
 */
export const appRouter = appRouterJson as Router;
