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
    fetchCreatorUsername();
    fetchTradeData(offer.cards, setOfferData);
    fetchTradeData(request.cards, setRequestData);
  }, []);

  return (
    <tr>
      <th scope="row">{creator}</th>
      <td>
        {offerData.map((o, idx) => {
          return (
            <>
              <img key={idx} width={200} height={200} src={o.src} />
              <figcaption className="figure-caption text-success">{o.name}</figcaption>
            </>
          );
        })}
      </td>
      <td>
        {requestData.map((o, idx) => {
          return (
            <>
              <img key={idx} width={200} height={200} src={o.src} />
              <figcaption className="figure-caption text-danger">{o.name}</figcaption>
            </>
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
