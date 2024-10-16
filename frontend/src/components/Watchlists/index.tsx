import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useFetchWatchlists from "@/hooks/useFetchWatchlists"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import WatchlistItem from "@/components/WatchlistItem"
import { WatchlistItemData } from "@/types/WatchlistTypes"


const Watchlists = () => {
  const [watchlistTitle, setWatchlistTitle] = useState('')
  const axiosPrivate = useAxiosPrivate()
  const { userWatchlists, refetchUserWatchlists } = useFetchWatchlists()


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.post('/watchlists/create', { "title": watchlistTitle })
      if (response.status === 200) {
        refetchUserWatchlists()
      }

    } catch (e) {
      console.log(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWatchlistTitle(e.target.value)
  }

  const handleDelete = async (id: number) => {
    const response = await axiosPrivate.delete(`/watchlists/${id}`)
    if (response.status === 200) {
      refetchUserWatchlists()
    }
  }

  return (
    <div className="m-8 my-10">
      <div className="flex justify-between items-center py-6">
        <h3 className="text-xl font-semibold">Your Watchlists</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"secondary"}>Create Watchlist</Button>
          </PopoverTrigger>
          <PopoverContent>
            <form onSubmit={handleSubmit}>
              <Label htmlFor="watchlist-title">Watchlist Title</Label>
              <Input id="watchlist-title" value={watchlistTitle} onChange={handleChange} />
              <Button type="submit">Create</Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4">
        { /* If the user has no watchlists, display "no watchlists", else render userWatchlists */}
        {
          userWatchlists && userWatchlists.length === 0
            ? (
              <div>No watchlists</div>
            )
            : (
              userWatchlists?.map((watchlist: WatchlistItemData) => (
                <WatchlistItem
                  key={watchlist.id}
                  id={watchlist.id}
                  title={watchlist.title}
                  userId={watchlist.user_id}
                  isPrivate={watchlist.is_private}
                  items={watchlist.items}
                  handleDelete={handleDelete}
                />
              ))
            )
        }
      </div>
    </div>
  )
}

export default Watchlists
