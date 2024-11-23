interface ShowData {
  adult: boolean
  backdrop_path: string | null // Can be null if no backdrop is available
  genre_ids: number[] // Array of genre IDs
  id: number
  origin_country: string[] // Array of country codes
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null // Can be null if no poster is available
  first_air_date: string // ISO date string
  name: string
  vote_average: number
  vote_count: number
}

interface Creator {
  id: number
  credit_id: string
  name: string
  original_name: string
  gender: number | null // Nullable as gender info might be missing
  profile_path: string | null // Nullable if no profile picture is available
}

interface Genre {
  id: number
  name: string
}

interface Episode {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  episode_type: string | null // Nullable as not all episodes have a type
  production_code: string | null // Nullable as not all episodes have a code
  runtime: number | null // Nullable if runtime is missing
  season_number: number
  show_id: number
  still_path: string | null // Nullable if no image is available
}

interface Network {
  id: number
  logo_path: string | null // Nullable if no logo is available
  name: string
  origin_country: string
}

interface ProductionCompany {
  id: number
  logo_path: string | null // Nullable if no logo is available
  name: string
  origin_country: string
}

interface ProductionCountry {
  iso_3166_1: string
  name: string
}

interface Season {
  air_date: string | null // Nullable if air date is missing
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null // Nullable if no poster is available
  season_number: number
  vote_average: number
}

interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

interface ShowDetails extends ShowData {
  created_by: Creator[]
  episode_run_time: number[] // Array of runtimes in minutes
  genres: Genre[]
  homepage: string
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: Episode | null // Nullable if no episode has aired
  next_episode_to_air: Episode | null // Nullable if no upcoming episode
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: Season[]
  spoken_languages: SpokenLanguage[]
  status: string // E.g., "Ended", "Returning Series"
  tagline: string | null // Nullable if no tagline
  type: string // E.g., "Scripted"
}
