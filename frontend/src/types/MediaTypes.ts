import { MovieData } from '@/features/movies/types/movie-types'
import { TvData } from '@/features/tv/types/tv-types'
import { PersonData } from '@/features/people/types/person-types'

export type MediaData = MovieData | TvData | PersonData

export interface MediaDataQuery {
    page: number
    results: MediaData[]
    total_pages: number
    total_results: number
}
