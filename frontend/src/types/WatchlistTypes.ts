export interface WatchlistData {
  id: number,
  title: string,
  user_id: number,
  is_private: boolean,
  items: WatchlistItem[]
  statuses: "completed" | "queued" | "on-hold" | "dropped" | "watching"
  all_tags: string[]
}

export interface WatchlistItemProps {
  watchlist: WatchlistData
  handleDelete: (id: number) => Promise<void>
}

export interface WatchlistItem {
  media_type: "movie" | "tv"
  id: number
}
