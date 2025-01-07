import { Grid3x3, Table } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WatchlistViewToggleProps {
  view: string
  setView: (view: 'item' | 'table') => void
}

const WatchlistViewToggle = ({ view, setView }: WatchlistViewToggleProps) => {
  return (
    <div className='flex items-center gap-2 py-4'>
      {
        view === "table" ? <p>Table View</p> : <p>Grid View</p>
      }
      {/* Toggle buttons for switching views */}
      <div className="inline-flex items-center rounded-md border border-input bg-transparent shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView('item')}
          className={`rounded-r-none ${view === 'item' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView('table')}
          className={`rounded-l-none ${view === 'table' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Table className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default WatchlistViewToggle
