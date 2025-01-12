import { useEffect, useState } from "react"

export default function TradeRow({
  isOwned,
  creatorId,
  tradeId,
  offer,
  request,
  cardsOwned
}) {

  const canFillTrade = () => {
    for (let i = 0; i < request.cards.length; i++) {
      if (cardsOwned.indexOf(request.cards[i]) === -1) return false;
    }
    return true
  }

  const fillTrade = async () => {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
      },
    };
    const response = await fetch(
      `http://localhost:3000/api/order/fillOrder/${tradeId}`,
      options
    );
    if (response.ok) {
      window.location.href = "http://localhost:5173/";
    } else {
      console.error(response.json());
    }
  };

  const fetchTradeData = async (cards, setter) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: cards,
      }),
    };
    let response = await fetch(
      "http://localhost:3000/api/album/getCharactersByIds",
      options
    );
    if (response.ok) {
      response = await response.json();
      setter(
        response.map((i) => {
          return {
            id: i.id,
            name: i.name,
            src: `${i.thumbnail.path}.${i.thumbnail.extension}`,
          };
        })
      );
    }
  };

  const fetchCreatorUsername = async () => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };
    const response = await fetch(
      `http://localhost:3000/api/user/getUserById/${creatorId}`,
      options
    );
    if (response.ok) {
      const user = await response.json();
      setCreator(user.username);
    }
  };

  const deleteTrade = async () => {
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    };
    const response = await fetch(
      `http://localhost:3000/api/order/deleteOrder/${tradeId}`,
      options
    );
    if (response.ok) {
      window.location.href = "http://localhost:5173/trade";
    } else {
      console.error(response.json());
    }
  };

  const [creator, setCreator] = useState("");
  const [offerData, setOfferData] = useState([]);
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    fetchCreatorUsername()
    fetchTradeData(offer.cards, setOfferData)
    fetchTradeData(request.cards, setRequestData)
  }, []);

  return (
    <tr className={canFillTrade() ? "traderow-fillable-img" : "traderow-unfillable-img"}>
      <th scope="row" className="text-center">
        <h5>{creator}</h5>
      </th>
      <td className="text-start">
        <div className="d-flex justify-content-start">
          {offerData.map((o, idx) => {
            return (
              <div key={idx} className="d-flex flex-column align-items-center mx-2">
                <img width={200} height={200} src={o.src} />
                <figcaption className="figure-caption text-white">{o.name}</figcaption>
              </div>
            );
          })}
        </div>
      </td>
      <td className="text-start">
        <div className="d-flex justify-content-start">
          {requestData.map((o, idx) => {
            const imgClass = cardsOwned.indexOf(o.id) !== -1 ? 'traderow-fillable-img' : 'traderow-unfillable-img';
            const figClass = cardsOwned.indexOf(o.id) !== -1 ? 'text-success' : 'text-danger';
            return (
              <div key={"rqdata" + idx} className="d-flex flex-column align-items-center mx-2">
                <img width={200} height={200} src={o.src} className={imgClass} />
                <figcaption className={`figure-caption ${figClass}`}>{o.name}</figcaption>
              </div>
            );
          })}
        </div>
      </td>
      <td className="text-center">
        {isOwned ? (
          <button className="btn btn-danger" onClick={async () => await deleteTrade()}>
            DELETE
          </button>
        ) : canFillTrade() ? (
          <button className="btn btn-success" onClick={async () => await fillTrade()}>
            FILL
          </button>
        ) : (
          <button disabled className="btn btn-warning">
            FILL
          </button>
        )}
      </td>
    </tr>

  );
}
