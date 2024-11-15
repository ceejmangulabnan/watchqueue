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
import WatchlistDetails from '@/components/WatchlistDetails'
import MovieDetailsPage from '@/pages/MovieDetailsPage'

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
                <Route path=":username/watchlist" element={<WatchlistDetailsPage />}>
                  <Route path=':watchlistId' element={<WatchlistDetails />}></Route>
                </Route>
                <Route path="/movie/:movieId" element={<MovieDetailsPage />}></Route>
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
