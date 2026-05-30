import { Helmet } from 'react-helmet-async'
import useMediaData from '@/hooks/useMediaData'
import { generatePosterLink } from '@/utils'
import { Button } from '@/components/ui/button'
import { Info, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MovieData } from '@/features/movies/types/movie-types'
import { TvData } from '@/features/tv/types/tv-types'

const LandingPage = () => {
    const { data: topTrending, isLoading: isTopTrendingLoading } = useMediaData(
        '/trending/all/day',
        'topTrending'
    )

    const hero = !isTopTrendingLoading && topTrending?.results?.[0]
    const isMovie = hero?.media_type === 'movie'
    const heroTitle = isMovie
        ? (hero as MovieData).title
        : (hero as TvData).name
    const heroRelease = isMovie
        ? (hero as MovieData).release_date?.slice(0, 4)
        : (hero as TvData).first_air_date?.slice(0, 4)
    const heroOverview = hero?.overview ?? ''

    return (
        <>
            <Helmet>
                <title>WatchQueue</title>
            </Helmet>

            <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
                {hero && (
                    <>
                        <img
                            src={generatePosterLink(
                                hero.backdrop_path,
                                'original'
                            )}
                            alt={heroTitle}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

                        <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-10 md:px-20 max-w-4xl">
                            <h1 className="text-4xl md:text-6xl font-bold font-inter mb-2">
                                {heroTitle}
                            </h1>
                            {heroRelease && (
                                <p className="text-sm md:text-base text-muted-foreground mb-4">
                                    {heroRelease}
                                </p>
                            )}
                            <p className="text-sm md:text-base line-clamp-3 mb-6 max-w-2xl text-muted-foreground">
                                {heroOverview}
                            </p>
                            <div className="flex gap-3">
                                <Button asChild>
                                    <Link
                                        to={
                                            isMovie
                                                ? `/movie/${hero.id}`
                                                : `/tv/${hero.id}`
                                        }
                                    >
                                        <Info />
                                        Details
                                    </Link>
                                </Button>
                                <Button variant="secondary" asChild>
                                    <Link
                                        to={
                                            isMovie
                                                ? `/movie/${hero.id}`
                                                : `/tv/${hero.id}`
                                        }
                                    >
                                        <Play />
                                        Trailer
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </section>
            <section></section>
        </>
    )
}

export default LandingPage
