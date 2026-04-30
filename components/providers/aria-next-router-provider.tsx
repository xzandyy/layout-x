"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";
import { useCallback } from "react";

/**
 * 提供 React-Aria 所需的 Next.js 路由导航函数。
 * 在需要使用 React-Aria 的组件中使用，例如：
 * <AriaNextRouterProvider>
 *   <Component />
 * </AriaNextRouterProvider>
 */
export function AriaNextRouterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const navigate = useCallback(
    (href: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(href);
      } else {
        router.push(href);
      }
    },
    [router],
  );

  return <RouterProvider navigate={navigate}>{children}</RouterProvider>;
}
