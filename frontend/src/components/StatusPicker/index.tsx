import { useState } from 'react'
import { TWatchlistItem } from '@/components/WatchlistTableView'
import { Row } from '@tanstack/react-table'
import { WatchlistData } from '@/types/WatchlistTypes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface StatusPickerProps {
  row: Row<TWatchlistItem>
  watchlistDetails: WatchlistData | undefined
}

const TagsPicker = ({ row, watchlistDetails }: StatusPickerProps) => {
  const [selectedTags, setSelectedTags] = useState<Array<string>>(row.original.tags)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='h-full w-full'>
        {
          !selectedTags.length ? <p>Add Tags</p>
            :
            (
              <div>
                {
                  selectedTags.map(tag => (
                    <p>{tag}</p>
                  ))

                }
              </div>

            )
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[15rem]'>
        {
          watchlistDetails?.all_tags.map((tag) => (
            <DropdownMenuItem onClick={() => setSelectedTags((prev) => [...prev, tag])}>{tag}</DropdownMenuItem>
          ))
        }
        <DropdownMenuItem>
          <button className='text-red-500' onClick={() => setSelectedTags([])}>Remove All Tags</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TagsPicker
