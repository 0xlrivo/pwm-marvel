export default function SellCardsTable({ cards }) {

    const sellCard = async (cardId) => {
        const options = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
                "Content-Type": "application/json",
            }
        }
        const response = await fetch("http://localhost:3000/api/album/sellCard/" + cardId, options)
        if (response.ok) {
            window.location.href = "http://localhost:5173/shop"
        } else {
            console.error(await response.json())
        }
    }

    return (
        <div style={{ position: 'relative', paddingBottom: '70px' }}>
            <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingRight: '15px' }}>
                <table className="tradetable table table-responsive text-center">
                    <thead>
                        <tr>
                            <th scope="col">Card</th>
                            <th scope="col">Hero Name</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cards.map((card, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <img src={`${card.thumbnail.path}.${card.thumbnail.extension}`} width={200} height={200} alt={card.name} />
                                    </td>
                                    <td>
                                        <h5 style={{marginTop: "5em"}}>{card.name}</h5>
                                    </td>
                                    <td>
                                        <button className="btn btn-success" style={{marginTop: "5em"}} onClick={() => sellCard(card.id)}>SELL</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}