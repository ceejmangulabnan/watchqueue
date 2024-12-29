import { Skeleton } from '@/components/ui/skeleton'

const MediaItemSkeleton = () => {
  return (
    <div className="flex flex-col items-start">
      <Skeleton className="h-[18rem] w-full" />
      <div className="mt-4 space-y-2 h-20 w-full">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  )
}

export default MediaItemSkeleton
