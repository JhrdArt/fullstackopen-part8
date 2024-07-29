    import { useMutation } from '@apollo/client'
    import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
    import { useState } from 'react'

    export const UpdateAuthor = ({ names }) => {
        const [name, setName] = useState("")
        const [born, setBorn] = useState("")

        const [changeBorn, result] = useMutation(EDIT_AUTHOR, {
            refetchQueries: [{ query: ALL_AUTHORS }]
        })

        const onSubmit = (e) => {
            e.preventDefault()
            try {
                changeBorn({ variables: { name, setBornTo: Number(born) } })
            } catch (error) {
                console.error(error)
            }
            setName("")
            setBorn("")
        }

        return (
            <form onSubmit={onSubmit}>
                <h3>Set birthyear</h3>
                <div>
                    <select value={name} onChange={({ target }) => setName(target.value)}>
                        {
                            names.map((name, i) => {
                                return <option key={i} value={name}>{name}</option>
                            })
                        }
                    </select>
                </div>
                <div>
                    <label htmlFor="born">born</label>
                    <input value={born} onChange={({ target }) => setBorn(target.value)} type="text" />
                </div>
                <button type="submit">update author</button>
            </form>
        )
    }
