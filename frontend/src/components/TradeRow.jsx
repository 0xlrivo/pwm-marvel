import { useEffect, useState } from "react";

export default function TradeRow({
  isOwned,
  creatorId,
  tradeId,
  offer,
  request,
}) {
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

  const fetchCardsData = async (isOffer, cards) => {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({
        ids: cards,
      }),
    };
    const response = await fetch(
      `http://localhost:3000/api/album/getCharactersByIds`,
      options
    );
    if (response.ok) {
      const r = await response.json();
      isOffer ? setOfferCards(r) : setRequestCards(r);
    } else {
      console.error(await response.json());
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
      window.location.href = "http://localhost:5173/";
    } else {
      console.error(response.json());
    }
  };

  const [creator, setCreator] = useState("");
  const [offerCards, setOfferCards] = useState([]);
  const [requestCards, setRequestCards] = useState([]);

  useEffect(() => {
    fetchCreatorUsername();
    //fetchCardsData(true, offer.cards);
    //fetchCardsData(false, request.cards);
  }, []);

  return (
    <tr>
      <th scope="row">{creator}</th>
      <td>
        {offerCards.map((c, idx) => {
          return (
            <img
              key={idx}
              src={`${c.thumbnail.path}.${c.thumbnail.extension}`}
              width={200}
              height={200}
            />
          );
        })}
      </td>
      <td>
        {requestCards.map((c, idx) => {
          return (
            <img
              key={idx}
              src={`${c.thumbnail.path}.${c.thumbnail.extension}`}
              width={200}
              height={200}
            />
          );
        })}
      </td>
      <td>
        {isOwned ? (
          <button
            className="btn btn-danger"
            onClick={async () => {
              await deleteTrade();
            }}
          >
            DELETE
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={async () => {
              await fillTrade();
            }}
          >
            FILL
          </button>
        )}
      </td>
    </tr>
  );
}
