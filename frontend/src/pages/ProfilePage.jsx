import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ProfilePage() {

    const [isLogged, user, setUser, ,] = useOutletContext();

    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [favHero, setFavHero] = useState(user.favoriteHero);
    const [DL, setDL] = useState([]);

    const getFavHeroName = async () => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        };
        let response = await fetch(
            `http://localhost:3000/api/album/getCharacterById/${parseInt(favHero, 10)}`,
            options
        );
        if (response.ok) {
            response = await response.json();
            return response.name;
        }
    };

    const searchHeroByNames = async (query) => {
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                Accept: `application/json`,
            },
        };

        let response = await fetch(
            `http://localhost:3000/api/album/getCharactersByName/${query}`,
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
        e.preventDefault();

        let body = {
            username,
            email,
            password: password.length > 0 ? password : "", // Se la password è vuota, invia una stringa vuota
        };

        const newFavHero = document.getElementById("inputFavoriteHero").value.split("/")[0]; // Ottieni l'ID del nuovo ero
        // Aggiungi favoriteHero solo se è cambiato
        if (newFavHero !== user.favHero) {
            body.favoriteHero = parseInt(newFavHero, 10); // Aggiungi il nuovo valore solo se è cambiato
            if (!body.favoriteHero) body.favoriteHero = user.favHero
        } else {
            body.favoriteHero = user.favHero; // Se non è cambiato, mantieni il valore precedente
        }

        const options = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) // Invia il body con solo i dati cambiati
        };

        const resp = await fetch('http://localhost:3000/api/user/editProfile', options);
        if (resp.ok) {
            window.location.href = 'http://localhost:5173/'
        } else {
            const msg = (await resp.json()).message
            window.alert(msg)
        }
    };

    const deleteProfile = async () => {
        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth-token'),
            }
        };
        
        try {
            const response = await fetch('http://localhost:3000/api/user/deleteProfile', options);
        } catch (e) {
            window.alert("profile deleted")
            localStorage.removeItem('auth-token');
        }
    };
    

    useEffect(() => {
        const fetchFavoriteHero = async () => {
            const heroName = await getFavHeroName();
            setFavHero(heroName || ''); // Imposta il valore nello stato
        };
        fetchFavoriteHero();
    }, []);

    if (!isLogged) return <h1>Login first to edit your profile</h1>

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form
                onSubmit={handleSubmit}
                className="p-4 bg-white rounded shadow"
                style={{ width: '400px', marginTop: '20vh' }}
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
                    <label htmlFor="inputPassword" className="form-label">New Password</label>
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
                        value={favHero} // Usa lo stato per il valore
                        onChange={(e) => {
                            setFavHero(e.target.value); // Aggiorna lo stato
                            searchHeroByNames(e.target.value);
                        }}
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
                <button type="submit" className="btn btn-danger w-100 mt-2" onClick={async () => { await deleteProfile() }}>Delete Profile</button>
            </form>
        </div>
    );
}
