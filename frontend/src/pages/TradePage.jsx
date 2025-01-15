import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import TradeControlBar from "../components/TradeControlBar";
import TradeRow from "../components/TradeRow";

export default function TradePage() {

  const [,user,,pagination,setError] = useOutletContext();
  const [trades, setTrades] = useState([]);

  const fetchUnfilledTrades = async () => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };
    const resp = await fetch(
      "http://localhost:3000/api/order/getAllUnfilledOrders",
      options
    );
    if (resp.ok) {
      const content = await resp.json();
      setTrades(content);
    }
  };

  useEffect(() => {
    fetchUnfilledTrades();
  }, [user]); // runs after user is fetched

  return (
    <>
      <h1>Trade</h1>
      {/* Aggiungi un contenitore con overflow per la tabella */}
      <div style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', paddingRight: '15px' }}>
        <table className="tradetable table table-responsive table-striped text-center">
          <thead>
            <tr>
              <th scope="col">Creator</th>
              <th scope="col">Offer</th>
              <th scope="col">Request</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t, idx) => {
              return (
                <TradeRow
                  key={idx}
                  isOwned={user._id == t.creatorId} // wheater or not the logged user owns this trade
                  creatorId={t.creatorId}
                  tradeId={t._id}
                  offer={t.offer}
                  request={t.request}
                  cardsOwned={pagination.cards.map((i) => { return i.id })} // only pass ids
                  setError={setError}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trade Control Bar */}
      <TradeControlBar user={user} cards={pagination.cards} setError={setError} />
    </>
  )
}
