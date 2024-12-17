import { useEffect, useState } from "react"
import HeroCard from "./HeroCard"

export default function AlbumViewer({ albumId }) {

    const fetchAlbumCards = async () => {
        if (!albumId) return
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }
        const resp = await fetch(`http://localhost:3000/api/album/getAlbumCardsData/${albumId}`, options)
        if (resp.ok) {
            const content = await resp.json()
            console.log(content)
            setPagination({
                'pages': Math.ceil(content.length / 10),
                'cards': content
            })
        }
    }

    // STATE
    const [pagination, setPagination] = useState({}) // { pages: 1, cards: [ {card}, ... ]}

    // EFFECT
    useEffect(() => {
        fetchAlbumCards()
    }, [])

    return (
        <div className="row row-cols-1 row-cols-md-5 g-4" style={{marginBottom: '5em'}}>
            {
                pagination
                    ? pagination.cards.map((item, idx) => {
                        return (
                            <div key={idx} className="col">
                                <HeroCard itemKey={idx} id={item.id} name={item.name} description={item.description} imgSrc={`${item.thumbnail.path}.${item.thumbnail.extension}`}/>
                            </div>
                        )
                    })
                    : ""
            }
        </div>
    )
}