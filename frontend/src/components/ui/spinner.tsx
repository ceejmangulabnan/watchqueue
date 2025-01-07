const LoadingSpinner = () => {
  return (
    <div className='h-screen w-full relative'>
      <div className='absolute top-1/3 left-1/2 -translate-x-1/2'>
        <div className="border-gray-300 h-16 w-16 animate-spin rounded-full border-8 border-t-gray-800" />
      </div>
    </div>
  )
}

export default LoadingSpinner
