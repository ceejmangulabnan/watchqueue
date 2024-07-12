import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get("https://666962592e964a6dfed4e7ce.mockapi.io/users")
  const data = await response.data as User[]
  return data
}

interface User {
  name: string
  id: number
  age: number
}
const TestQuery = () => {
  const userData = useQuery({ queryKey: ["users"], queryFn: fetchUsers })
  console.log(userData)

  return (
    <div>
      {userData.data?.map(user => (
        <div key={user.id}>
          <h1>Name: {user.name}</h1>
          <p>Age: {user.age}</p>
          <p>ID: {user.id}</p>
        </div>
      ))}
    </div>
  )
}

export default TestQuery
