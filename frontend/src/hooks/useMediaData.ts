import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'

// Fetch data for general media lists
const useMediaData = (endpoint: string, queryKey: string) => {
  const fetchMediaData = async () => {
    const response = await axiosBase.get(endpoint)
    return response.data
  }

  return useQuery({ queryKey: [queryKey], queryFn: fetchMediaData })
}

export default useMediaData
