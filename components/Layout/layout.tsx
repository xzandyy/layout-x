import "server-only";

import { LayoutRoot } from "./root-server";
import { Rail, RailHeader, RailMain, RailFooter } from "./rail";
import { Sidebar, SidebarHeader, SidebarMain, SidebarFooter } from "./sidebar";
import { Content, ContentHeader, ContentBody } from "./content";

export type { LayoutProps } from "./root-client";

/** 仅从服务端 app layout 导入，勿在带 use client 的模块中引用本文件 */
export const Layout = Object.assign(LayoutRoot, {
  Rail,
  RailHeader,
  RailMain,
  RailFooter,
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  Content,
  ContentHeader,
  ContentBody,
});
