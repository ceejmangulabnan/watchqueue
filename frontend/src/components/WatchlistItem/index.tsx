import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { WatchlistItemProps } from '../../types/WatchlistTypes'
import { Card, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'

const WatchlistItem = ({ id, title, handleDelete }: WatchlistItemProps) => {
  return (
    <Card className="overflow-hidden relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='absolute right-2 top-2'>
          <Button className='p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow'>
            <Ellipsis color='#000000' size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[10rem]'>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Pencil color="#000000" size={20} className='mr-2' />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className='text-red-500' onClick={() => handleDelete(id)}>
              <Trash2 color="red" size={20} className='mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <img src="https://placehold.co/400x600" alt="" />
      <CardFooter className="flex-col items-start p-4">
        <CardTitle className='text-md font-medium'>{title}</CardTitle>
      </CardFooter>
    </Card>
  )
}

export default WatchlistItem
