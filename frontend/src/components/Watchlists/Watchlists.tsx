import './watchlists.scss'
import { axiosPrivate } from "../../api/axios"
import { useState } from "react"
import useFetchWatchlists from "../../hooks/useFetchWatchlists"
import WatchlistItem from "../WatchlistItem/WatchlistItem"
import { WatchlistItemData } from "../../types/WatchlistTypes"


const Watchlists = () => {
  // Fetch all watchlists of user
  const [watchlistTitle, setWatchlistTitle] = useState({
    title: ''
  })
  const { userWatchlists } = useFetchWatchlists()

  const handleCreateWatchlist = async () => {
    // const response = await axiosPrivate.post('/watchlists/create', watchlistTitle)
    // console.log(response)
    console.log('create clicked')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWatchlistTitle({ ...watchlistTitle, [e.target.name]: e.target.value })
    console.log(watchlistTitle)
  }

  return (
    <section className='watchlists'>
      <h1 className='watchlists__title'>Watchlists</h1>
      {
        userWatchlists &&
        <div className="watchlists__container">
          <div className='watchlists__create'>
            <div className='watchlists__create__icon' onClick={handleCreateWatchlist}>
              <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed">
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </div>
            <p className='watchlists__create__text'>Create New Watchlist</p>
          </div>
          {userWatchlists.map((watchlist: WatchlistItemData) => (
            <WatchlistItem
              id={watchlist.id}
              title={watchlist.title}
              userId={watchlist.user_id}
              isPrivate={watchlist.is_private}
              items={watchlist.items} />
          ))}

        </div>
      }
    </section>
  )
}

export default Watchlists
