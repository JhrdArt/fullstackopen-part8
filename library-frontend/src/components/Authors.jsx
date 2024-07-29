import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"
import { UpdateAuthor } from "./UpdateAuthor"

export const Authors = ({ show }) => {
    const result = useQuery(ALL_AUTHORS)

    if (result.loading) {
        return <div>Loading...</div>
    }

    if (!show) {
        return null
    }

    const authors = result?.data?.allAuthors || [];

    return (
        <div>
            {
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>born</th>
                            <th>books</th>
                        </tr>
                        {authors.map((a) => (
                            <tr key={a.name}>
                                <td>{a.name}</td>
                                <td>{a.born}</td>
                                <td>{a.bookCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            <UpdateAuthor names={authors.map(a => a.name)} />
        </div>
    )
}
