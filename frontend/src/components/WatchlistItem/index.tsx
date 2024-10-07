import { WatchlistItemProps } from '../../types/WatchlistTypes'
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'


const WatchlistItem = ({ id, title, userId, isPrivate, items }: WatchlistItemProps) => {
  return (
    <Card className="overflow-hidden">
      <img src="https://placehold.co/400x600" alt="" />
      <CardFooter className="flex-col items-start p-4">
        <CardTitle>{title}</CardTitle>
      </CardFooter>
    </Card>
  )
}

export default WatchlistItem
