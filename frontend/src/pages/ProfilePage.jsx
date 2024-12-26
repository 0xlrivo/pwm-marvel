import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ProfilePage() {

    const handleSubmit = async (e) => {
        e.preventDefault()

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'email': email,
            })
        }

        const resp = await fetch('http://localhost:3000/api/user/editProfile', options)
        if (resp.ok) {
           const content = await resp.json()
           console.log(content)
        } else {
            console.log("LOGIN FAILED")
            console.error(await resp.json())
        }
    }

    const [isLogged, user, setUser, pagination, setPagination] = useOutletContext()

    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [favHero, setFavHero] = useState(user.favoriteHero)

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="inputUsername" className="form-label">Username</label>
                <input type="text" className="form-control" id="inputUsername" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
            </div>
            <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label">Email</label>
                <input type="email" className="form-control" id="inputEmail" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            </div>
            <div className="mb-3">
                <label htmlFor="inputFavoriteHero" className="form-label">Favorite Hero</label>
                <input type="text" className="form-control" id="inputUsername" value={favHero} onChange={(e) => {setFavHero(e.target.value)}}/>
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
    )
}