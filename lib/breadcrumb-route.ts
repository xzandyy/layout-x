/**
 * 与某一级 URL 段对应的单棵路由树节点（子节点 path 为相对该级的段，如 `phones`、`:id`）。
 * `hasPage` 默认 `true`；仅当该 URL 前缀没有独立 page（如仅有 deeper 子路由有 page）时显式设 `false`。
 */
export type BreadcrumbRouteNode = {
  path: string;
  meta: { title: string };
  /**
   * 该节点对应的 URL 前缀是否有可访问的 page（有 index/落地页）。
   * 省略为 `true`；无 page 时显式为 `false`（例如 `/phones` 无 page，仅有 `/phones/a` 等）。
   */
  hasPage?: boolean;
  children?: BreadcrumbRouteNode[];
};

export type BreadcrumbItem = {
  title: string;
  /** 可导航的规范路径；不可点时（含末级、当前页、`hasPage: false` 等）为 `null` */
  href: string | null;
  isCurrent: boolean;
};

export function pathToSegments(pathname: string): string[] {
  if (!pathname || pathname === "/") {
    return [];
  }
  return pathname.split("/").filter(Boolean);
}

function rootPathSegments(path: string): string[] {
  return pathToSegments(path.startsWith("/") ? path : `/${path}`);
}

function firstSegment(path: string): string {
  const s = path.replace(/^\//, "");
  return s.split("/").filter(Boolean)[0] ?? "";
}

function isDynamicSegment(pattern: string): boolean {
  return firstSegment(pattern).startsWith(":");
}

function segmentEquals(pattern: string, urlSegment: string): boolean {
  if (isDynamicSegment(pattern)) {
    return true;
  }
  return firstSegment(pattern) === urlSegment;
}

function findMatchingChild(
  children: BreadcrumbRouteNode[],
  urlSegment: string,
): BreadcrumbRouteNode | undefined {
  const staticMatch = children.find(
    (c) => !isDynamicSegment(c.path) && firstSegment(c.path) === urlSegment,
  );
  if (staticMatch) {
    return staticMatch;
  }
  return children.find((c) => isDynamicSegment(c.path));
}

function nodeHasPage(node: BreadcrumbRouteNode): boolean {
  return node.hasPage !== false;
}

/** 用已匹配的 URL 前 `endExclusive` 段拼出 path（0 个段时为 `/`） */
function formatPathPrefix(parts: string[], endExclusive: number): string {
  if (endExclusive <= 0) {
    return "/";
  }
  return `/${parts.slice(0, endExclusive).join("/")}`;
}

type MatchedStep = { node: BreadcrumbRouteNode; endExclusive: number };

function buildMatchedSteps(
  pathname: string,
  root: BreadcrumbRouteNode,
): MatchedStep[] | null {
  const parts = pathToSegments(pathname);
  const base = rootPathSegments(root.path);
  for (let i = 0; i < base.length; i += 1) {
    if (i >= parts.length) {
      return null;
    }
    if (!segmentEquals(`/${base[i]}`, parts[i]!)) {
      return null;
    }
  }
  const steps: MatchedStep[] = [
    { node: root, endExclusive: base.length },
  ];
  let remaining = parts.slice(base.length);
  let current = root;
  while (remaining.length > 0) {
    if (!current.children?.length) {
      break;
    }
    const child = findMatchingChild(current.children, remaining[0]!);
    if (!child) {
      break;
    }
    const endExclusive = steps[steps.length - 1]!.endExclusive + 1;
    steps.push({ node: child, endExclusive });
    remaining = remaining.slice(1);
    current = child;
  }
  return steps;
}

/**
 * 匹配 `pathname` 与路由树，并生成带 `href` / `isCurrent` 的面包屑项（末级不链；`hasPage: false` 不链）。
 */
export function buildBreadcrumbItems(
  pathname: string,
  root: BreadcrumbRouteNode,
): BreadcrumbItem[] {
  const steps = buildMatchedSteps(pathname, root);
  if (steps == null || steps.length === 0) {
    return [];
  }
  const parts = pathToSegments(pathname);
  const n = steps.length;
  return steps.map((step, i) => {
    const isLast = i === n - 1;
    const isCurrent = isLast;
    if (isCurrent) {
      return {
        title: step.node.meta.title,
        href: null,
        isCurrent: true,
      };
    }
    if (!nodeHasPage(step.node)) {
      return {
        title: step.node.meta.title,
        href: null,
        isCurrent: false,
      };
    }
    return {
      title: step.node.meta.title,
      href: formatPathPrefix(parts, step.endExclusive),
      isCurrent: false,
    };
  });
}

/**
 * 将 `pathname` 与以 `root` 为根的路由树做前缀匹配，返回已命中的各层 `meta.title`。
 * 根路径不匹配则返回 `[]`；子级无法继续匹配时，保留已成功的上一级标题。
 */
export function matchBreadcrumbTrail(
  pathname: string,
  root: BreadcrumbRouteNode,
): { title: string }[] {
  return buildBreadcrumbItems(pathname, root).map(({ title }) => ({ title }));
}
