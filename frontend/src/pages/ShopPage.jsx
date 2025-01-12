import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import SellCardsTable from "../components/SellCardsTable";

export default function ShopPage() {

    const buyCredits = async () => {
        const options = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:5173",
              "Access-Control-Allow-Credentials": "true"
            }
        }
        const response = await fetch('http://localhost:3000/api/user/buyCredits', options)
        if (response.ok) {
            window.location.href = 'http://localhost:5173/'
        }
    }

    const openPacket = async () => {
        const options = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("auth-token"),
                Accept: "application/json",
            },
        };
        const resp = await fetch(
            `http://localhost:3000/api/album/openPacket`,
            options
        );
        if (resp.ok) {
            const content = await resp.json();
            setPacketContent(content)
        }
    };

    const [, user, ,pagination,] = useOutletContext();
    const [packetContent, setPacketContent] = useState([])

    return (
        <>
            <h1>Shop</h1>

            <SellCardsTable cards={pagination.cards}/>

            <div className="bg-dark fixed-bottom d-flex flex-wrap align-items-center justify-content-center p-3 mb-0">
                <div className="flex align-items-center col-md-3 mb-2 mb-md-0 text-white text-decoration-none">
                    <button className="btn btn-primary">
                        {user ? user.credits : 0} credits
                    </button>
                </div>
                <div className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={async () => {
                            await openPacket();
                        }}
                    >
                        BUY PACKET
                    </button>
                </div>

                <div className="col-md-3 text-end">
                    <button type="button" className="btn btn-warning" onClick={async() => {await buyCredits()}}>Buy Credits</button>
                </div>
            </div>
        </>
    );
}
