import { Card, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { FALLBACK_POSTER, generatePosterLink } from '@/utils'
import { PersonData } from '@/types/PersonTypes'
import { useNavigate } from 'react-router-dom'

interface PersonItemProps {
  person: PersonData
}

const PersonItem = ({ person }: PersonItemProps) => {
  const navigate = useNavigate()
  const posterLink = generatePosterLink(person.profile_path)

  const personTitle = () => person.gender === 1 ? "Actress" : person.gender === 2 ? "Actor" : "Artist"

  return (
    <Card className='overflow-hidden'>
      <img
        src={posterLink}
        loading='lazy'
        onClick={() => navigate(`/person/${person.id}/${encodeURIComponent(person.name)}`)}
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_POSTER
        }} />
      <CardFooter className='flex flex-col items-start p-4'>
        <CardTitle className='text-sm md:text-md truncate w-full'>{person.name}</CardTitle>
        <CardDescription>{personTitle()}</CardDescription>
      </CardFooter>

    </Card>
  )
}

export default PersonItem
