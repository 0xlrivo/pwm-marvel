import { useState } from "react"

export default function LoginPage() {

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        }

        const resp = await fetch('http://localhost:3000/api/user/login', options)
        if (resp.ok) {
           const content = await resp.json()
           localStorage.setItem('auth-token', content.token)
        } else {
            console.log("LOGIN FAILED")
        }
    }

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label className="form-label">Username</label>
                <input 
                    className="form-control"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label className="form-label">Password</label>
                <input 
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="submit" />
            </form>
        </div>
    )
}