import useRefreshToken from "../../hooks/useRefreshToken"

const Refresh = () => {
  const refresh = useRefreshToken()

  return (
    <button onClick={refresh}>Refresh</button>
  )
}

export default Refresh
