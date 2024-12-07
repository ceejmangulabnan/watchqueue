import { MovieData } from '@/types/MovieTypes'
import { TvData } from '@/types/TvTypes'
import { PersonData } from '@/types/PersonTypes'

export type MediaData = MovieData | TvData | PersonData

export interface MediaDataQuery {
  page: number
  results: MediaData[]
  total_pages: number
  total_results: number
}
