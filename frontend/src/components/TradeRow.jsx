import { useEffect, useState } from "react"

export default function TradeRow({ isOwned, creatorId, tradeId, offer, request }) {

    const fillTrade = async () => {
        
    }

    const fetchCreatorUsername = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }
        const response = await fetch(`http://localhost:3000/api/user/getUserById/${creatorId}`, options)
        if (response.ok) {
            const user = await response.json()
            setCreator(user.username)
        }
    }

    const deleteTrade = async () => {
        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            }
        }
        const response = await fetch(`http://localhost:3000/api/order/deleteOrder/${tradeId}`, options)
        if (response.ok) {
            console.log("Trade Deleted")
        } else {
            console.error(response.json())
        }
    }

    const [creator, setCreator] = useState("")

    useEffect(() => {
        fetchCreatorUsername()
    }, [])

    return (
        <tr>
            <th scope="row">{creator}</th>
            <td>
                <p>{offer.credits} credits</p>
            </td>
            <td>
                <p>{request.credits} credits</p>
            </td>
            <td>
                {
                    isOwned
                        ? <button className="btn btn-danger" onClick={async () => {await deleteTrade()}}>DELETE</button>
                        : <button className="btn btn-success" onClick={async () => {await fillTrade()}}>FILL</button>
                }
                
            </td>
        </tr>
    )
}