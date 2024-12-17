import { useOutletContext } from "react-router-dom";
import AlbumViewer from "./AlbumViewer";
import HomeControlBar from "./HomeControlBar";
import { useEffect, useState } from "react";

export default function Home() {

    // extract the claims from the JWT token found in local storage
    const parseJwt = () => {
        const jwt = localStorage.getItem('auth-token')
        if (!jwt) return null
        const payload = atob(jwt.split('.')[1])
        return JSON.parse(payload)
    }

    // calls the backend API to fetch data from the currently logged user
    const fetchUserData = async () => {
        console.log("called")
        const jwt = parseJwt()
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }
        const resp = await fetch('http://localhost:3000/api/user/getUserById/' + jwt.id)
        if (resp.ok) {
            const content = await resp.json()
            setCredits(content.credits)
        }
    }

    // STATE
    const [isLogged] = useOutletContext()
    const [credits, setCredits] = useState(0)

    // EFFECT
    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <>
            <h1>Album of </h1>
            <AlbumViewer albumId={parseJwt().albumId}/>
            <HomeControlBar isLogged={isLogged} credits={credits}/>
        </>
    )
}