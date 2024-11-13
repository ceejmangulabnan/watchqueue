import { useState } from "react"
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogHeader } from '@/components/ui/dialog'
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
  const [isOpen, setIsOpen] = useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.post('/watchlists/create', { "title": watchlistTitle })
      if (response.status === 200) {
        refetchUserWatchlists()
        setIsOpen(false)
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
    <div className='mx-auto xl:max-w-[1400px] 2xl:max-w-[1600px]'>
      <div className="flex justify-between items-center py-6">
        <h3 className="text-xl font-semibold">Your Watchlists</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"secondary"}>Create Watchlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Watchlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='flex flex-col gap-y-3 mt-4'>
              <Label htmlFor="watchlist-title">Watchlist Title</Label>
              <Input id="watchlist-title" value={watchlistTitle} onChange={handleChange} placeholder='Watchlist Title' />
              <Button type="submit" className='w-full'>Create</Button>
            </form>
          </DialogContent>

        </Dialog>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
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
