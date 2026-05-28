import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProfilePage from '@/features/profile/pages/profile-page'
import LandingPage from '@/features/landing/pages/landing-page'
import AuthProvider from '@/features/auth/context/auth-provider'
import UserWatchlistProvider from '@/features/watchlist/context/user-watchlist-provider'
import ProtectedRoute from '@/features/auth/protected-route'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/features/common/navbar'
import WatchlistDetailsPage from '@/features/watchlist/pages/watchlist-details-page'
import MovieDetailsPage from '@/features/movies/pages/movie-details-page'
import TvDetailsPage from '@/features/tv/pages/tv-details-page'
import SearchResultsPage from '@/features/search/pages/search-results-page'
import MovieSearchResults from '@/features/search/pages/movie-search-results'
import MultiSearchResults from '@/features/search/pages/multi-search-results'
import TvSearchResults from '@/features/search/pages/tv-search-results'
import ThemeProvider from '@/features/common/context/theme-provider'

const queryClient = new QueryClient()

const App = () => {
    return (
        <div className="app mt-20 font-fira">
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ThemeProvider
                        defaultTheme="light"
                        storageKey="vite-ui-theme"
                    >
                        <AuthProvider>
                            <UserWatchlistProvider>
                                <Navbar />
                                <Routes>
                                    <Route path="/" element={<LandingPage />} />
                                    <Route element={<ProtectedRoute />}>
                                        <Route
                                            path="/profile"
                                            element={<ProfilePage />}
                                        />
                                        <Route
                                            path=":username/watchlist/:watchlistId"
                                            element={<WatchlistDetailsPage />}
                                        />
                                    </Route>
                                    <Route
                                        path="/search"
                                        element={<SearchResultsPage />}
                                    >
                                        <Route
                                            path="multi"
                                            element={<MultiSearchResults />}
                                        />
                                        <Route
                                            path="movie"
                                            element={<MovieSearchResults />}
                                        />
                                        <Route
                                            path="tv"
                                            element={<TvSearchResults />}
                                        />
                                    </Route>
                                    <Route
                                        path="/movie/:movieId"
                                        element={<MovieDetailsPage />}
                                    ></Route>
                                    <Route
                                        path="/tv/:tvId"
                                        element={<TvDetailsPage />}
                                    ></Route>
                                </Routes>
                            </UserWatchlistProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </BrowserRouter>
                <ReactQueryDevtools />
            </QueryClientProvider>
            <Toaster></Toaster>
        </div>
    )
}

export default App
