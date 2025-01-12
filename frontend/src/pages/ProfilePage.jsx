import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ProfilePage() {

    const getFavHeroName = async () => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        }
        let response = await fetch(
            "http://localhost:3000/api/album/getCharactersByName/" + favHero,
            options
        );
        if (response.ok) {
            response = await response.json()
            return response.name
        }
    }

    const searchHeroByNames = async (query) => {
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
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

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'email': email,
                'favoriteHero': parseInt(favHero, 10)
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

    const [, user, setUser, ,] = useOutletContext()

    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [favHero, setFavHero] = useState(user.favoriteHero)
    const [DL, setDL] = useState([])

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form 
                onSubmit={handleSubmit} 
                className="p-4 bg-white rounded shadow"
                style={{ width: '400px', marginTop: '20vh'}}
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

                {/* Favorite Hero */}
                <div className="mb-3">
                    <label htmlFor="inputFavoriteHero" className="form-label">Favorite Hero</label>
                    <input
                        type="text"
                        list="favheroDL"
                        className="form-control"
                        id="inputFavoriteHero"
                        defaultValue={getFavHeroName()}
                        onChange={(e) => searchHeroByNames(e.target.value)}
                    />
                    <datalist id="favheroDL">
                        {DL.map((hero) => (
                            <option key={hero.id} value={`${hero.id}/${hero.name}`}>
                                {hero.name}
                            </option>
                        ))}
                    </datalist>
                </div>

                {/* Update Button */}
                <button type="submit" className="btn btn-primary w-100">Update Profile</button>
            </form>
        </div>
    )
}