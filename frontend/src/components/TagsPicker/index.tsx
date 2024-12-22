import { ChangeEvent, FormEvent, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TWatchlistItem } from '@/components/WatchlistTableView'
import { Row } from '@tanstack/react-table'
import { WatchlistData, WatchlistItem } from '@/types/WatchlistTypes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { CircleX, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StatusPickerProps {
  row: Row<TWatchlistItem>
  watchlistDetails: WatchlistData | undefined
}

const TagsPicker = ({ row, watchlistDetails }: StatusPickerProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(row.original.tags)
  const [newTag, setNewTag] = useState<string>('')
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const updateTags = (newTags: string[]) => {
    return axiosPrivate.put(`/watchlists/${watchlistDetails?.id}/tags`, newTags)
  }

  const updateTagsMutation = useMutation({
    mutationFn: updateTags
  })

  const updateItemTags = (updateWatchlistItemTags: WatchlistItem) => {
    return axiosPrivate.put(`/watchlists/${watchlistDetails?.id}/item/tags`, updateWatchlistItemTags)
  }

  const updateItemTagsMutation = useMutation({
    mutationFn: updateItemTags
  })

  const handleAddTag = async (tag: string) => {
    // Check for duplicates, then add new selected item to selectedTags
    if (selectedTags.includes(tag)) return

    const updatedItemTags = [...selectedTags, tag]

    setSelectedTags(updatedItemTags)

    updateItemTagsMutation.mutateAsync({
      // Watchlist Item
      id: row.original.id,
      media_type: row.original.mediaType,
      status: row.original.status,
      tags: updatedItemTags
    }, {
      onSuccess: () => {
        // Trigger refetch of watchlist data
        if (watchlistDetails) {
          queryClient.invalidateQueries({ queryKey: ['watchlistDetails', Number(watchlistDetails.id)] })
        }
      }
    })
  }

  // Show only unselected tags as the available options
  const filteredTags = watchlistDetails?.all_tags.filter(tag => !selectedTags.includes(tag))

  const handleSubmitTag = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Pass new tag in array.
    const allTags = watchlistDetails?.all_tags
    if (allTags)
      updateTagsMutation.mutateAsync([...allTags, newTag], {
        onSuccess: () => {
          // Trigger refetch of watchlist data
          queryClient.invalidateQueries({ queryKey: ['watchlistDetails', Number(watchlistDetails.id)] })
        }
      })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value)
  }

  return (
    <div className='flex items-center'>
      <div className='w-full flex items-center gap-2'>
        {
          selectedTags.map(tag => (
            <div className='flex items-center p-2 hover:bg-gray-400/25 bg-gray-100 rounded-md gap-2'>
              <p className='flex'>{tag}</p>
              <CircleX size={16} />
            </div>
          ))
        }
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {
            <Button className='rounded-full bg-white hover:bg-white shadow'>
              <Plus color='#000000' size={16} />
              <p className='text-foreground ml-2'>Add Tag</p>
            </Button>
          }
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[15rem]'>
          <DropdownMenuLabel className='text-xs text-gray-400'>Select multiple tags </DropdownMenuLabel>
          <form onSubmit={(e) => handleSubmitTag(e)}>
            <Input placeholder='Search for a tag...' value={newTag} onChange={handleInputChange} />
            {
              newTag
                ? (
                  <button
                    className='w-full relative flex cursor-default select-none items-center rounded-sm
                    px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent 
                    focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    type='submit'>
                    Create tag {`"${newTag}"?`}
                  </button>
                )
                : null
            }
          </form>
          <DropdownMenuSeparator />
          {
            filteredTags?.map((tag) => (
              <DropdownMenuItem onClick={() => handleAddTag(tag)}>{tag}</DropdownMenuItem>
            ))
          }
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button className='text-red-500' onClick={() => setSelectedTags([])}>Remove All Tags</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TagsPicker
