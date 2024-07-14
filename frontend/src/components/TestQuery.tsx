import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MovieDataQuery } from '../types/MovieTypes'

const baseImgUrl = 'https://image.tmdb.org/t/p/w500'

// const fetchUsers = async (): Promise<User[]> => {
//   const response = await axios.get("https://666962592e964a6dfed4e7ce.mockapi.io/users")
//   const data = await response.data as User[]
//   return data
// }

const fetchFastapi = async () => {
  const response = await axios.get("http://localhost:8000/test", {
  })
  const data = await response.data as MovieDataQuery
  return data

}

// interface User {
//   name: string
//   id: number
//   age: number
// }

const TestQuery = () => {
  const fastapi = useQuery({ queryKey: ["fastapi"], queryFn: fetchFastapi })
  console.log(fastapi.data)
  // console.log(userData)

  // {
  //   userData.data?.map(user => (
  //     <div key={user.id}>
  //       <h1>Name: {user.name}</h1>
  //       <p>Age: {user.age}</p>
  //       <p>ID: {user.id}</p>
  //     </div>
  //   ))
  // }
  return (
    <div>
      {
        fastapi.isSuccess && (
          fastapi.data.results.map(movie => (
            <div className=''>
              <p>{movie.title}</p>
              <img src={`${baseImgUrl}${movie.poster_path}`} />
            </div>

          )
          )
        )
      }

    </div>
  )
}

export default TestQuery
