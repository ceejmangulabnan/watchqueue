import './app.scss'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import Navbar from "./components/Navbar/Navbar"
import AuthProvider from "./contexts/AuthProvider"
import LoginProvider from './contexts/LoginProvider'
import ProfilePage from './pages/ProfilePage/ProfilePage'



const queryClient = new QueryClient()

const App = () => {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <LoginProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </LoginProvider>
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  )
}

export default App
