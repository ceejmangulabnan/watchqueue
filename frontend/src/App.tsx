import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import Navbar from "./components/Navbar/Navbar"
import './app.scss'



const queryClient = new QueryClient()

const App = () => {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>

        <div className="App"></div>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  )
}

export default App
