const IMG_URL = import.meta.env.VITE_IMG_URL

export const generatePosterLink = (
    imgPath: string | undefined,
    size: string = 'w342'
    // backdrop: boolean = false
) => {
    const posterLink = `${IMG_URL}/${size}${imgPath}`
    return posterLink
}

export const FALLBACK_POSTER =
    'https://placehold.co/400x600?text=Poster+Unavailable&font=lato'
