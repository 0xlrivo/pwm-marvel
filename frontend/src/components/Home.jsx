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
    const fetchUserData = async (id) => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }
        const resp = await fetch('http://localhost:3000/api/user/getUserById/' + id, options)
        if (resp.ok) {
            const content = await resp.json()
            setUserData(content)
        }
    }

    const fetchAlbumCards = async (albumId) => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }
        const resp = await fetch(`http://localhost:3000/api/album/getAlbumCardsData/${albumId}`, options)
        if (resp.ok) {
            const content = await resp.json()
            setPagination({
                curPage: 0,
                numPages: Math.ceil(content.length / 10),
                cards: content ? content : []
            })
        }
    }

    const changeCurPage = (c) => {
        const p = pagination;
        setPagination({
            curPage: c,
            numPages: p.numPages,
            cards: p.cards
        })
        console.log("ppp")
    }

    // STATE
    const [isLogged] = useOutletContext()
    const [userData, setUserData] = useState({})
    const [pagination, setPagination] = useState({
        curPage: 0,
        numPages: 1,
        cards: []
    })

    // EFFECT
    useEffect(() => {
        const jwt = parseJwt()
        if (!jwt) return
        fetchUserData(jwt.id)
        fetchAlbumCards(jwt.albumId)
    }, [])

    return (
        <>
            <h1>Album of {userData ? userData.username : ""}</h1>

            <AlbumViewer 
                albumId={parseJwt().albumId} 
                pagination={pagination}
            />

            <HomeControlBar 
                isLogged={isLogged} 
                credits={userData ? userData.credits : 0} 
                pagination={pagination}
                changePage={changeCurPage}
            />
        </>
    )
}