import { useQuery } from '@apollo/client'
import React from 'react'
import { ALL_BOOKS, ME } from '../queries'

export const Recommended = ({ show }) => {
    const currentUser = useQuery(ME)
    const books = useQuery(ALL_BOOKS)
    console.log(currentUser)

    if (!show || !currentUser.data || !books.data) {
        return null
    }

    if (currentUser.loading || books.loading) {
        return <div>...Loading</div>
    }

    if (currentUser.error || books.error) {
        return <p>Something error ocurred</p>
    }

    const favoriteGenre = currentUser?.data?.me?.favoriteGenre

    const booksRecommendations = books.data.allBooks.filter(b => {
        return b.genres.includes(favoriteGenre)
    })


    return (
        <div>
            <h2>Recommended</h2>
            {
                booksRecommendations.length > 0 ? (
                    <div>
                        <p>Books in your favorite genre <strong>{favoriteGenre}</strong></p>

                        <table>
                            <tr>
                                <th></th>
                                <th>author</th>
                                <th>published</th>
                            </tr>
                            {
                                booksRecommendations.map(b => (
                                    <tr key={b.title}>
                                        <td>{b.title}</td>
                                        <td>{b.author.name}</td>
                                        <td>{b.published}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>

                ) : (
                    <p>
                        No books have been added yet based on your favorite genre <strong>{favoriteGenre}</strong>
                    </p>
                )
            }
        </div>
    )
}
