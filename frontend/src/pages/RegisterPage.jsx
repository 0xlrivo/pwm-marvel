import { useState } from "react"
import { useOutletContext } from "react-router-dom"

export default function RegisterPage() {

    const [,,,,,setError] = useOutletContext()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [DL, setDL] = useState([])

    const searchHeroByNames = async (query) => {
        const options = {
          method: "GET",
          headers: {
            Accept: `application/json`,
          },
        };
    
        let response = await fetch(
          "http://localhost:3000/api/album/getCharactersByName/" + query,
          options
        );
        if (response.ok) {
          response = await response.json();
          setDL(
            response.map((i) => {
              return { id: i.id, name: i.name };
            })
          );
        } else {
          console.error(await response.json());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const favHero = document.getElementById("inputFavoriteHero").value.split("/")[0];

        // make a request to the login endpoint, if successfull is will return a JWT token
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'email': email,
                'password': password,
                'favoriteHero': parseInt(favHero, 10)
            })
        }

        const resp = await fetch('http://localhost:3000/api/user/register', options)
        if (resp.ok) {
            window.location.href = 'http://localhost:5173/login'
        } else {
            const msg = await resp.json()
            setError({
                show: true,
                title: "Register Error",
                msg: msg.message
            })
        }
    }

    

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form 
                onSubmit={handleSubmit} 
                className="p-4 bg-white rounded shadow"
                style={{ width: '400px', marginTop: '15vh'}}
            >
                {/* Username */}
                <div className="mb-3">
                    <label htmlFor="inputUsername" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Favorite Hero */}
                <div className="mb-3">
                    <label htmlFor="inputFavoriteHero" className="form-label">Favorite Hero</label>
                    <input
                        type="text"
                        list="favheroDL"
                        className="form-control"
                        id="inputFavoriteHero"
                        onChange={(e) => searchHeroByNames(e.target.value)}
                    />
                    <datalist id="favheroDL">
                        {DL.map((c) => (
                            <option key={c.id} value={`${c.id}/${c.name}`}>
                                {c.name}
                            </option>
                        ))}
                    </datalist>
                </div>

                {/* Register Button */}
                <button type="submit" className="btn btn-danger w-100">Register</button>
            </form>
        </div>
    )
}