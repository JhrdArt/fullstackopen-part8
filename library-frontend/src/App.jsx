import React from 'react'
import { Authors } from './components/Authors'
import { ALL_BOOKS, BOOK_ADDED, ME } from './queries'
import { useApolloClient, useQuery, useSubscription } from "@apollo/client"
import { Books } from './components/books'
import { useState } from 'react'
import { BookForm } from './components/BookForm'
import { LoginForm } from './components/LoginForm'
import { Recommended } from './components/Recommended'


export const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const { loading, error, data } = useQuery(ME)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includeIn = (set, object) => {
      return set.map(p => p.id).includes(object.id)
    }

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includeIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscription: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;

      updateCacheWith(addedBook)
    }
  })
  console.log(data)
  if (!token) {
    return (
      <>
        <button onClick={() => setPage("authors")}>Authors</button>
        <button onClick={() => setPage("books")} >Books</button>
        <button onClick={() => setPage("login")} >Login</button>
        <LoginForm show={page === "login"} setToken={setToken} />
      </>
    )
  }



  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <>
      <p>Welcome {data?.me?.username.toUpperCase()}</p>
      <button onClick={() => setPage("authors")}>Authors</button>
      <button onClick={() => setPage("books")} >Books</button>
      <button onClick={() => setPage("form")} >Add Book</button>
      <button onClick={() => setPage("recommended")} >Recommended</button>
      <button onClick={logout}>logout</button>
      <Recommended show={page === "recommended"} />
      <BookForm show={page === "form"} />
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
    </>
  )
}
