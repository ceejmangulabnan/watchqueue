
const IMG_URL = import.meta.env.VITE_IMG_URL
export const generatePosterLink = (imgPath: string | null) => {
  const posterLink = `${IMG_URL}/w342${imgPath}`
  return posterLink

}

export const handlePosterError = (setPosterLink: (value: React.SetStateAction<string | undefined>) => void) => {
  setPosterLink("https://placehold.co/400x600?text=Poster+Unavailable&font=lato")
}
