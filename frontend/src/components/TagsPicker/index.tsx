import { ChangeEvent, FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { TWatchlistItem } from '@/components/WatchlistTableView'
import { Row } from '@tanstack/react-table'
import { WatchlistData } from '@/types/WatchlistTypes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

interface StatusPickerProps {
  row: Row<TWatchlistItem>
  watchlistDetails: WatchlistData | undefined
}

const TagsPicker = ({ row, watchlistDetails }: StatusPickerProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(row.original.tags)
  const [newTag, setNewTag] = useState<string>('')

  const axiosPrivate = useAxiosPrivate()

  const updateTags = (newTags: string[]) => {
    return axiosPrivate.put(`/watchlists/${watchlistDetails?.id}/tags`, newTags)
  }

  const updateTagsMutation = useMutation({
    mutationFn: updateTags
  })

  // Handle Duplicates
  const handleAddTag = (tag: string) => {
    // Check for duplicates, then add new selected item to selectedTags
    if (!selectedTags.includes(tag))
      setSelectedTags((prev) => [...prev, tag])
  }

  // Show only unselected tags as the available options
  const filteredTags = watchlistDetails?.all_tags.filter(tag => !selectedTags.includes(tag))

  const handleSubmitTag = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Pass new tag in array.
    const allTags = watchlistDetails?.all_tags
    if (allTags)
      updateTagsMutation.mutateAsync([...allTags, newTag])
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='h-full w-full'>
        {
          !selectedTags.length ?
            <p className='text-left'>Add Tags</p>
            :
            (
              <div className='text-left'>
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
        <form onSubmit={(e) => handleSubmitTag(e)}>
          <Input value={newTag} onChange={handleInputChange} />
          {
            newTag
              ? (
                <button className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50' type='submit'>Create tag {`"${newTag}"?`}</button>
              )
              : null
          }
        </form>
        {
          filteredTags?.map((tag) => (
            <DropdownMenuItem onClick={() => handleAddTag(tag)}>{tag}</DropdownMenuItem>
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
