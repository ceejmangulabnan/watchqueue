import { useState, ReactNode, useEffect, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { WatchlistData, StatusType } from '@/types/WatchlistTypes'
import { WatchlistItemDetailsQuery } from '@/pages/WatchlistDetailsPage'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { MovieDetails } from '@/types/MovieTypes'
import { TvDetails } from '@/types/TvTypes'
import { statuses } from '@/types/WatchlistTypes'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import WatchlistItemDropdownContent from '@/components/WatchlistItem/WatchlistItemDropdownContent'
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'

interface WatchlistItemViewProps {
  watchlistItemsDetails: {
    data: (WatchlistItemDetailsQuery | undefined)[];
    pending: boolean;
  }
  watchlistDetails: WatchlistData | undefined
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
  const [tableData, setTableData] = useState<TWatchlistItem[]>([])

  const data = watchlistItemsDetails.data

  useEffect(() => {
    const watchlistTableData: TWatchlistItem[] = data.map((item) => {
      if (!item) return null // Guard for undefined items

      const { type, mediaData } = item

      // Get status and tags from watchlistDetails based on id and mediaType
      const matchingItem = watchlistDetails?.items.find(
        (watchlistItem) =>
          watchlistItem.id === mediaData.id && watchlistItem.media_type === type
      )

      return {
        id: mediaData.id,
        mediaType: type,
        status: matchingItem?.status || "N/A", // Default to N/A for now, still need to update db
        tags: matchingItem?.tags || [], // Default to empty array
        title: type === "movie" ? (mediaData as MovieDetails).title : (mediaData as TvDetails).name,
        itemDetails: mediaData
      } as TWatchlistItem
    }).filter((item): item is TWatchlistItem => item !== null) // Type guard to exclude null values


    setTableData(watchlistTableData)
  }, [data, watchlistDetails])


  const columnHelper = createColumnHelper<TWatchlistItem>()

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
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const [selectedStatus, setSelectedStatus] = useState(row.original.status)

        const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedStatus(e.target.value as StatusType)
          // You can call an API or a function to persist the change
          console.log(
            `Status for ID ${row.original.id} changed to ${e.target.value}`
          )
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
      },
    }),
    columnHelper.accessor('mediaType', {
      header: "Media Type",
      cell: info => info.getValue()
    }),
    columnHelper.accessor('tags', {
      header: "Tags",
      cell: info => info.getValue()
    }),
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
              mediaType={mediaType} // get from column mediaType in same row
              itemDetails={data} // should be the mediaData
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
          </DropdownMenu>

        )
      }
    }),
  ], [data, watchlistDetails])


  const table = useReactTable<TWatchlistItem>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  console.log(table.getHeaderGroups())

  return !watchlistItemsDetails.pending ? (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
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
