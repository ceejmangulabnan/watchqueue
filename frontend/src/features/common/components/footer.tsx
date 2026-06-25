const Footer = () => {
    return (
        <footer className="border-t py-6 text-center text-sm text-muted-foreground mt-20">
            <p>
                Watchqueue &copy; {new Date().getFullYear()} Cheljee Mangulabnan
            </p>
            <div className="flex justify-center gap-4 mt-2">
                <a
                    href="https://github.com/ceejmangulabnan/watchqueue"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    GitHub
                </a>
                <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    powered by TMDB
                </a>
            </div>
        </footer>
    )
}

export default Footer
