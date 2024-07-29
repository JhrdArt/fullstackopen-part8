import { useMutation } from "@apollo/client"
import { LOGIN, ME } from "../queries"
import { useState } from "react"
import { useEffect } from "react"

export const LoginForm = ({ show, setToken }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [login, result] = useMutation(LOGIN, {
        refetchQueries: [{ query: ME }]
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem("library-user-token", token)
        }
    }, [result.data])

    if (!show) {
        return null
    }

    const onSubmit = async e => {
        e.preventDefault()
        await login({ variables: { username, password } })
        setUsername("");
        setPassword("");
    }

    return (
        <form onSubmit={onSubmit} >
            <div>
                username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div>password <input type={showPassword ? "text" : "password"} value={password} onChange={({ target }) => setPassword(target.value)} /> <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> show </div>
            <button type="submit">submit</button>
        </form>
    )
}
