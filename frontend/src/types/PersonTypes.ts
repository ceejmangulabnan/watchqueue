import { MovieData } from '@/types/MovieTypes'

export interface PersonData {
  id: number
  name: string
  original_name: string
  media_type?: "person"
  adult: boolean
  popularity: number
  gender: 0 | 1 | 2 // Gender field is usually 1 (female), 2 (male), or 0 (not specified).
  known_for_department: string
  profile_path: string
  known_for: MovieData[]
}


export interface PersonDataQuery {
  page: number
  results: PersonData[]
  total_pages: number
  total_results: number
}
