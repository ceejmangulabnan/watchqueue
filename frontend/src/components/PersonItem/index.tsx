import { Card, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { generatePosterLink } from '@/utils/generateImgLinks'
import { PersonData } from '@/types/PersonTypes'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface PersonItemProps {
  person: PersonData
}

const PersonItem = ({ person }: PersonItemProps) => {
  const [posterLink, setPosterLink] = useState(() => generatePosterLink(person.profile_path))
  const navigate = useNavigate()

  const personTitle = () => person.gender === 1 ? "Actress" : person.gender === 2 ? "Actor" : "Artist"

  const handlePosterError = () => {
    setPosterLink("https://placehold.co/400x600?text=Poster+Unavailable&font=lato")
  }

  return (
    <Card className='overflow-hidden'>
      <img onClick={() => navigate(`/person/${person.id}/${encodeURIComponent(person.name)}`)} src={posterLink} onError={handlePosterError} />
      <CardFooter className='flex flex-col items-start p-4'>
        <CardTitle className='text-sm md:text-md truncate w-full'>{person.name}</CardTitle>
        <CardDescription>{personTitle()}</CardDescription>
      </CardFooter>

    </Card>
  )
}

export default PersonItem
