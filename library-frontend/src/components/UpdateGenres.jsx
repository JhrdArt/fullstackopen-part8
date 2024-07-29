import { useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_BOOKS, EDIT_GENRES } from "../queries"

export const UpdateGenres = ({ books }) => {
    const [title, setTitle] = useState("")
    const [genre, setGenre] = useState("")
    const [genres, setGenres] = useState([])

    const [changeGenres, result] = useMutation(EDIT_GENRES, {
        onError: error => console.log(error),
        update: (cache, { data }) => {
            // Actualizar manualmente la caché con los nuevos datos
            const { allBooks } = cache.readQuery({ query: ALL_BOOKS });
            // Actualiza allBooks según tu lógica, por ejemplo, encontrar el libro correcto y actualizar los géneros
            const updatedBooks = allBooks /* actualiza allBooks */
            cache.writeQuery({                   
                query: ALL_BOOKS,
                data: { allBooks: updatedBooks }
            });
        }
    })
    console.log(title)
    console.log(genres)

    const addGenre = () => {
        if (genre === "") return
        setGenres([...genres, genre])
        setGenre("")
    }

    const onSubmit = (e) => {
        e.preventDefault()
        changeGenres({
            variables: { title, setGenresTo: genres }
        })
        setTitle("")
        setGenres([])
    }

    return (
        <>
            <br />
            <h3>UpdateGenres</h3>
            <form onSubmit={onSubmit}>
                <div>
                    Select book {" "}
                    <select value={title} onChange={({ target }) => setTitle(target.value)}>
                        {
                            books.map((title, i) => (
                                <option key={i} value={title}>{title}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    genre: {" "}
                    <input type="text" value={genre} onChange={({ target }) => setGenre(target.value)} />
                    <button type="button" onClick={addGenre}>Add genre</button>
                </div>
                <div>
                    genres: <span>{genres.join(", ")}</span>
                </div>
                <button type="submit">change</button>
            </form>
        </>
    )
}
