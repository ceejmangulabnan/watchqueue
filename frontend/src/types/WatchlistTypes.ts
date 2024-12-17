export const statuses = ["completed", "queued", "on-hold", "dropped", "watching"] as const;
export type StatusType = typeof statuses[number];

export interface WatchlistData {
  id: number,
  title: string,
  user_id: number,
  is_private: boolean,
  items: WatchlistItem[]
  statuses: typeof statuses
  all_tags: string[]
}

export interface WatchlistItemProps {
  watchlist: WatchlistData
  handleDelete: (id: number) => Promise<void>
}

export interface WatchlistItem {
  media_type: "movie" | "tv"
  id: number
  status: StatusType
  tags: string[]
}
