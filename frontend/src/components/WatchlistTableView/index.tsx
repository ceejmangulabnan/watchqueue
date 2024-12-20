import { useMemo, useState, ReactNode, ChangeEvent } from 'react'
import { WatchlistData, StatusType, WatchlistItem, statuses } from '@/types/WatchlistTypes'
import { WatchlistItemDetailsQuery } from '@/pages/WatchlistDetailsPage'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { MovieDetails } from '@/types/MovieTypes'
import { TvDetails } from '@/types/TvTypes'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'
import WatchlistItemDropdownContent from '@/components/WatchlistItem/WatchlistItemDropdownContent'
import { useMutation } from '@tanstack/react-query'


interface WatchlistItemViewProps {
  watchlistItemsDetails: {
    data: (WatchlistItemDetailsQuery | undefined)[];
    pending: boolean;
  }
  watchlistDetails: WatchlistData
  handleRemoveFromWatchlist: (watchlistId: number, mediaType: string, itemId: number) => Promise<void>
}

// Row Shape
type TWatchlistItem = {
  id: number
  title: string
  status: StatusType
  tags: string[]
  mediaType: "movie" | "tv"
  itemDetails: MovieDetails | TvDetails
}

const WatchlistTableView = ({ watchlistItemsDetails, watchlistDetails, handleRemoveFromWatchlist }: WatchlistItemViewProps) => {
  const axiosPrivate = useAxiosPrivate()
  const columnHelper = createColumnHelper<TWatchlistItem>()
  const data = watchlistItemsDetails.data

  // Form table data to follow row shape
  const tableData: TWatchlistItem[] = useMemo(() => {
    return watchlistItemsDetails.data
      .map((item) => {
        if (!item) return null

        const { type, mediaData } = item

        const matchingItem = watchlistDetails?.items.find(
          (watchlistItem) =>
            watchlistItem.id === mediaData.id && watchlistItem.media_type === type
        )

        return {
          id: mediaData.id,
          mediaType: type,
          status: matchingItem?.status || "N/A",
          tags: matchingItem?.tags || [],
          title: type === "movie" ? (mediaData as MovieDetails).title : (mediaData as TvDetails).name,
          itemDetails: mediaData
        } as TWatchlistItem
      })
      .filter((item): item is TWatchlistItem => item !== null)
  }, [watchlistItemsDetails.data, watchlistDetails])

  // Mutation Function
  const updateStatus = async ({ id, media_type, status, tags }: WatchlistItem) => {
    return axiosPrivate.put(`/watchlists/${watchlistDetails?.id}`, {
      id,
      media_type,
      status,
      tags
    })
  }

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,
  })

  // Cache to avoid recreating on every render
  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: "ID",
      cell: info => info.getValue()
    }),
    columnHelper.accessor('title', {
      header: "Title",
      cell: info => info.getValue()
    }),
    // Having trouble updating the state sa UI
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const [selectedStatus, setSelectedStatus] = useState<StatusType>(row.original.status)

        const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
          const newStatus = e.target.value
          setSelectedStatus(e.target.value as StatusType)

          updateStatusMutation.mutateAsync({
            id: row.original.id,
            media_type: row.original.mediaType,
            status: newStatus as StatusType,
            tags: row.original.tags
          })
        }

        return (
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border rounded px-2 py-1"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )

      }
    }),
    columnHelper.accessor('mediaType', {
      header: "Media Type",
      cell: info => info.getValue()
    }),
    columnHelper.accessor('tags', {
      header: "Tags",
      cell: info => info.getValue()
    }),
    // All good no need to break lol
    columnHelper.display({
      header: "",
      id: "actions",
      cell: ({ row }) => {
        const mediaType = row.original.mediaType
        const data = row.original.itemDetails
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='p-0 w-6 h-6 rounded-full bg-white hover:bg-white shadow'>
                <Ellipsis color='#000000' size={16} />
              </Button>
            </DropdownMenuTrigger>
            <WatchlistItemDropdownContent
              inWatchlist={true}
              currentWatchlist={watchlistDetails}
              mediaType={mediaType}
              itemDetails={data} // should be the mediaData
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
          </DropdownMenu>
        )
      }
    }),
  ], [data, watchlistDetails])



  // Create table 
  const table = useReactTable<TWatchlistItem>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return !watchlistItemsDetails.pending ? (
    <Table>
      <TableCaption>{`Watchlist: ${watchlistDetails.title}`}</TableCaption>
      <TableHeader>
        {
          table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {(header.column.columnDef.header) as ReactNode}
                  </TableHead>
                ))
              }
            </TableRow>
          ))
        }
      </TableHeader>
      <TableBody>
        {/* Map over watchlist items as table row */}
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                }
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : <p>Table loading...</p>
}

export default WatchlistTableView
