import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom";
import TradeControlBar from "../components/TradeControlBar"
import TradeRow from "../components/TradeRow"

export default function TradePage() {

    const fetchUnfilledTrades = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        }
        const resp = await fetch('http://localhost:3000/api/order/getAllUnfilledOrders', options)
        if (resp.ok) {
            const content = await resp.json()
            setTrades(content)
        }
    }

    const [isLogged, user, setUser, pagination, setPagination] = useOutletContext()
    const [trades, setTrades] = useState([])

    useEffect(() => {
        fetchUnfilledTrades()
    }, [])

    return (
        <>
            <h1>Trade</h1>
            <table className="table table-hover table-striped">
                <thead>
                    <tr>
                        <th scope="col">Creator</th>
                        <th scope="col">Offer</th>
                        <th scope="col">Request</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        trades.map((t, idx) => {
                            return (
                                <TradeRow key={idx}
                                    isOwned={user._id == t.creatorId} // wheater or not the logged user owns this trade
                                    creatorId={t.creatorId}
                                    tradeId={t._id}
                                    offer={t.offer}
                                    request={t.request}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
            <TradeControlBar user={user} cards={pagination.cards}/>
        </>
    )

}