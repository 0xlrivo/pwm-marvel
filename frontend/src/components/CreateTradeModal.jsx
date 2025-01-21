import { useState } from "react";

export default function CreateTradeModal({ credits, cards }) {

  const [creditsOut, setCreditsOut] = useState(0);
  const [creditsIn, setCreditsIn] = useState(0);
  const [cardsOut, setCardsOut] = useState([]);
  const [cardsIn, setCardsIn] = useState([]);

  const [cardsInDL, setCardsInDL] = useState([]);

  const appendCard = (isIn, cardId, cardName) => {
    cardId = parseInt(cardId, 10);
    if (isIn) {
      if (cardsOut.length < 3) {
        // check for duplicate entries
        if (cardsOut.findIndex((i) => i.id === cardId) === -1)
          setCardsOut((prev) => [...prev, { id: cardId, name: cardName }]);
      }
    } else {
      if (cardsIn.length < 3) {
        if (cardsIn.findIndex((i) => i.id === cardId) === -1)
          setCardsIn((prev) => [...prev, { id: cardId, name: cardName }]);
      }
    }
  };

  const clearForm = () => {
    setCreditsOut(0);
    setCreditsIn(0);
    setCardsOut([]);
    setCardsIn([]);
    setCardsInDL([]);
  };

  const searchHeroByNames = async (query) => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        Accept: `application/json`,
      },
    };

    let response = await fetch(
      "http://localhost:3000/api/album/getCharactersByName/" + query,
      options
    );
    if (response.ok) {
      response = await response.json();
      setCardsInDL(
        response.map((i) => {
          return { id: i.id, name: i.name };
        })
      );
    } else {
      console.error(await response.json());
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        offer: {
          cards: cardsOut.map((i) => {
            return parseInt(i.id, 10);
          }),
          credits: parseInt(creditsOut, 10),
        },
        request: {
          cards: cardsIn.map((i) => {
            return parseInt(i.id, 10);
          }),
          credits: parseInt(creditsIn, 10),
        },
      }),
    };

    const response = await fetch(
      `http://localhost:3000/api/order/createOrder`,
      options
    );
    if (!response.ok) {
      const msg = (await resp.json()).message
      window.alert(msg)
      clearForm()
    } else {
      window.location.href = "http://localhost:5173/trade"
    }
  };

  return (
    <div
      className="modal fade"
      id="createTradeModal"
      tabIndex="-1"
      aria-labelledby="createTradeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createTradeModalLabel">
              Create Trade
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleForm}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="creditsOutLabel" className="form-label">
                  Credits Out (max {credits})
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="creditsOut"
                  aria-describedby="creditsOutLabel"
                  value={creditsOut}
                  onChange={(e) => setCreditsOut(e.target.value)}
                  min={0}
                  max={credits}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cardsOut" className="form-label">
                  Cards Out (from your album)
                </label>
                {cardsOut.length > 0 ? (
                  cardsOut.map((c, idx) => {
                    return <p key={idx}>{c.name}</p>;
                  })
                ) : (
                  <p>None</p>
                )}
                <select
                  className="form-control"
                  onChange={(e) => {
                    const x = e.target.value.split("/");
                    appendCard(true, x[0], x[1]);
                  }}
                >
                  <option value="none" selected hidden></option>
                  {cards.map((t, idx) => {
                    return (
                      <option key={idx} value={`${t.id}/${t.name}`}>{t.name}</option>
                    );
                  })}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="creditsInLabel" className="form-label">
                  Credits In
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="creditsIn"
                  aria-describedby="creditsInLabel"
                  value={creditsIn}
                  onChange={(e) => setCreditsIn(e.target.value)}
                  min={0}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cardsIn" className="form-label">
                  Cards In
                </label>
                {cardsIn.length > 0 ? (
                  cardsIn.map((c, idx) => {
                    return <p key={idx}>{c.name}</p>;
                  })
                ) : (
                  <p>None</p>
                )}
                <input
                  id="cardOutTxt"
                  type="text"
                  list="cardsInDataList"
                  className="form-control"
                  onChange={(e) => searchHeroByNames(e.target.value)}
                />
                <datalist id="cardsInDataList">
                  {cardsInDL.map((c) => {
                    return (
                      <option key={c.id} value={`${c.id}/${c.name}`}>
                        {c.name}
                      </option>
                    );
                  })}
                </datalist>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    const card = document
                      .getElementById("cardOutTxt")
                      .value.split("/");
                    appendCard(false, card[0], card[1]);
                  }}
                >
                  ADD
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => clearForm()}
              >
                Close
              </button>
              <button type="submit" className="btn btn-success">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
