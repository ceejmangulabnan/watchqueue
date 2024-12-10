import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProfilePage from '@/pages/ProfilePage'
import LandingPage from "@/pages/LandingPage"
import AuthProvider from "@/contexts/AuthProvider"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Toaster } from '@/components/ui/toaster'
import Navbar from "@/components/Navbar"
import WatchlistDetailsPage from '@/pages/WatchlistDetailsPage'
import MovieDetailsPage from '@/pages/MovieDetailsPage'
import SearchResultsPage from '@/pages/SearchResultsPage'
import MovieSearchResults from '@/pages/SearchResultsPage/MovieSearchResults'
import MultiSearchResults from '@/pages/SearchResultsPage/MultiSearchResults'
import TvSearchResults from '@/pages/SearchResultsPage/TvSearchResults'

const queryClient = new QueryClient()

const App = () => {
  return (
    <div className="app mt-20 font-fira">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path=":username/watchlist/:watchlistId" element={<WatchlistDetailsPage />} />
                <Route path="/movie/:movieId" element={<MovieDetailsPage />}></Route>
              </Route>
              <Route path="/search" element={<SearchResultsPage />}>
                <Route path="multi" element={<MultiSearchResults />} />
                <Route path="movie" element={<MovieSearchResults />} />
                <Route path="tv" element={<TvSearchResults />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Toaster></Toaster>
    </div>
  )
}

export default App
