const BASE_IMG_LINK = 'https://image.tmdb.org/t/p/w500'
export const generatePosterLink = (imgPath: string | null) => {
  const posterLink = `${BASE_IMG_LINK}${imgPath}`
  return posterLink

}
