import { useState } from "react"

export default function LoginPage() {

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // make a request to the login endpoint, if successfull is will return a JWT token
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

           // save the auth JWT token in local storage
           localStorage.setItem('auth-token', content.token)

           // redirect to the home page to issue a reload
           window.location.href = 'http://localhost:5173/'
        } else {
            console.error("LOGIN FAILED")
        }
    }

    // the React way of handling forms makes use of component state
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form 
                onSubmit={handleSubmit} 
                className="p-4 bg-white rounded shadow"
                style={{marginTop: '25vh'}}
            >
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        id="username"
                        className="form-control"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        className="form-control"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-danger w-100">Login</button>
            </form>
        </div>
    )
}