import { MouseEventHandler } from "react"

export interface WatchlistItemData {
  id: number,
  title: string,
  user_id: number,
  is_private: boolean,
  items: number[]
}


export interface WatchlistItemProps {
  id: number,
  title: string,
  userId: number,
  isPrivate: boolean,
  items: number[]
  handleDelete: (id: number) => Promise<void>
}
