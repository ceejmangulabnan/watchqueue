import { Helmet } from 'react-helmet-async'
import Watchlists from '@/features/watchlist/components/watchlists'

const ProfilePage = () => {
    return (
        <>
        <Helmet>
            <title>Profile - WatchQueue</title>
        </Helmet>
        <div className="mx-10 md:mx-20 my-10">
            <Watchlists />
        </div>
        </>
    )
}

export default ProfilePage
