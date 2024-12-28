const IMG_URL = import.meta.env.VITE_IMG_URL
export const generatePosterLink = (imgPath: string | null) => {
  const posterLink = `${IMG_URL}/w342${imgPath}`
  return posterLink

}
