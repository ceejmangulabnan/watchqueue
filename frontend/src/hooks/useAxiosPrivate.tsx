import { useAuth } from "../contexts/AuthProvider"
import { axiosPrivate } from "../api/axios"

const useAxiosPrivate = () => {
  const { auth, setAuth } = useAuth()

  axiosPrivate.interceptors.request.use(config => {
    // here we add the access token
    return config
  })


  return {}
}

export default useAxiosPrivate
