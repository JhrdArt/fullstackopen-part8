import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, } from '../queries'
import { error } from 'qrcode-terminal'

export const BookForm = ({ show }) => {
    const [author, setAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [published, setPublished] = useState("")
    const [genre, setGenre] = useState("")
    const [genres, setGenres] = useState([])

    const [addBook] = useMutation(ADD_BOOK);

    if (!show) return null

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            addBook({
                variables: {
                    author: { name: author },
                    published: Number(published),
                    title,
                    genres
                },

                refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
                onError: error => {
                    console.log(error)
                },

                // update: (store, response) => {
                //     console.log("store", store)
                //     genres.forEach(genre => {
                //         try {
                //             const dataInStore = store.readQuery({
                //                 query: ALL_BOOKS,
                //                 variables: { genre }
                //             })

                //             store.writeQuery({
                //                 query: ALL_BOOKS,
                //                 variables: { genre },
                //                 data: {
                //                     allBooks: [...dataInStore.allBooks].concat(response.data.createBook)
                //                 }
                //             })
                //         } catch (error) {
                //             console.log(`${genre} not queried`)
                //         }
                //     })
                // }
            });

            setAuthor("")
            setTitle("")
            setGenres([])
            setPublished("")

        } catch (error) {
            console.error(`error during mutation ${error}`)
        }
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre("")
    }

    return (
        <>
            <h2>Add new book</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="title">title</label>
                    <input value={title} onChange={({ target }) => setTitle(target.value)} type="text" />
                </div>
                <div>
                    <label htmlFor="author">author</label>
                    <input value={author} onChange={({ target }) => setAuthor(target.value)} type="text" />
                </div>
                <div>
                    <label htmlFor="published">published</label>
                    <input value={published} onChange={({ target }) => setPublished(target.value)} type="text" />
                </div>
                <div>
                    <input value={genre} onChange={({ target }) => setGenre(target.value)} type="text" />
                    <button type="button" onClick={addGenre}>Add genre</button>
                </div>
                <div>
                    <span>genres: {genres.join(", ")} </span>
                </div>
                <button type='submit'>create book</button>
            </form>
        </>
    )
}
