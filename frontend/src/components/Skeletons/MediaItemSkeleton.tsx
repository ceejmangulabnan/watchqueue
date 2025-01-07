import { Skeleton } from '@/components/ui/skeleton'

const MediaItemSkeleton = () => {
  return (
    <div className="flex flex-col items-start overflow-hidden">
      <Skeleton className="h-[16rem] w-full rounded-xl" />
      <div className="mt-2 space-y-1 h-16 w-full">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  )
}

export default MediaItemSkeleton
