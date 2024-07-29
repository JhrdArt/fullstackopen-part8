import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from '../queries'
import { UpdateGenres } from "./UpdateGenres"
import { useEffect, useState } from "react";

export const Books = ({ show }) => {
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [genres, setGenres] = useState([])
    const [books, setBooks] = useState([])
    const [selectedGenre, setSelectedGenre] = useState("")

    const result = useQuery(ALL_BOOKS)

    // const books = result?.data?.allBooks || []

    useEffect(() => {
        if (result.data) {
            const allBooks = result.data.allBooks
            setBooks(allBooks)
            let genres = ["All genres"]
            allBooks.forEach(elem => {
                elem.genres.forEach(g => {
                    if (genres.indexOf(g) === -1) {
                        genres.push(g)
                    }
                })
            })
            setGenres(genres)
            setSelectedGenre("All genres")
        }
    }, [result])

    useEffect(() => {
        if (selectedGenre === "All genres") {
            setFilteredBooks(books)
        } else {
            setFilteredBooks(books.filter(b => b.genres.includes(selectedGenre)))
        }
    }, [books, selectedGenre])

    if (result.loading) {
        return <div>Loading...</div>
    }

    if (!show) {
        return null
    }


    return (
        <div>
            <h3>Book</h3>
            <p>In genre <strong>{selectedGenre}</strong></p>
            {
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>author</th>
                            <th>published</th>
                            <th>genres</th>
                        </tr>
                        {filteredBooks?.map((b) => (
                            <tr key={b.title}>
                                <td>{b.title}</td>
                                <td>{b.author.name}</td>
                                <td>{b.published}</td>
                                <td>{b.genres.join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            <div>
                {
                    genres.length > 0 &&
                    genres.map(g => (
                        <button onClick={() => setSelectedGenre(g)} key={g}>
                            {g}
                        </button>
                    ))
                }
            </div>

            <UpdateGenres books={books.map(b => b.title)} />
        </div>
    )
}
