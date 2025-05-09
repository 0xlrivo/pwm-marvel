import CreateTradeModal from "./CreateTradeModal";

export default function TradePage({ user, cards }) {
  
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

  return (
    <>
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
            data-bs-toggle="modal"
            data-bs-target="#createTradeModal"
          >
            CREATE TRADE
          </button>
        </div>

        <div className="col-md-3 text-end">
          <button type="button" className="btn btn-warning" onClick={async () => { await buyCredits() }}>Buy Credits</button>
        </div>

      </div>
      <CreateTradeModal credits={user ? user.credits : 0} cards={cards} />
    </>
  );
}
