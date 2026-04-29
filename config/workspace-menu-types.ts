/** 驱动 `buildWorkspaceMenuConfig` 的快照；字段多为占位数据，后续可接接口 */
export type WorkspaceMenuState = {
  inboxRailUnread: number;
  inboxPrimaryCount: number;
  inboxReviewCount: number;
  homeDraftsChip: number;
};

export const defaultWorkspaceMenuState: WorkspaceMenuState = {
  inboxRailUnread: 3,
  inboxPrimaryCount: 12,
  inboxReviewCount: 3,
  homeDraftsChip: 3,
};
