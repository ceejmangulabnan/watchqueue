const IMG_URL = import.meta.env.VITE_IMG_URL

export const generatePosterLink = (imgPath: string | null) => {
  const posterLink = `${IMG_URL}/w342${imgPath}`
  return posterLink
}

export const FALLBACK_POSTER = "https://placehold.co/400x600?text=Poster+Unavailable&font=lato"
