import { useEffect, useState } from "react"
import TradeControlBar from "../components/TradeControlBar"
import TradeRow from "../components/TradeRow"

export default function TradePage() {

    const parseJwt = () => {
        const jwt = localStorage.getItem('auth-token')
        if (!jwt) return null
        const payload = atob(jwt.split('.')[1])
        return JSON.parse(payload)
    }

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
            console.log(content)
            setTrades(content)
            console.log(trades)
        }
    }

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
                        <th scope="col">#</th>
                        <th scope="col">Offer</th>
                        <th scope="col">Request</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        trades.map((t, idx) => {
                            return (
                                <TradeRow key={idx}
                                    idx={idx}
                                    tradeId={t._id}
                                    offer={t.offer}
                                    request={t.request}
                                />
                            )
                        })
                    }
                </tbody>
            </table>
            <TradeControlBar />
        </>
    )

}