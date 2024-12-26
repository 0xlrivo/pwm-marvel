import CreateTradeModal from "./CreateTradeModal";

export default function TradePage({ user, cards }) {
  // @todo muovere cards allo stato globale dell'applicazione cosi le ho a disposizione qui e non mi serve un'altra fetch
  // dal mio album
  const createOrder = async () => {};

  return (
    <>
      <div className="navbar navbar-expand navbar-dark bg-dark fixed-bottom d-flex flex-wrap align-items-center justify-content-center">
        
        <button
          type="button"
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#createTradeModal"
        >
          CREATE TRADE
        </button>

        <p className="text-white">Credits: {user ? user.credits : 0}</p>
      </div>
      <CreateTradeModal credits={user ? user.credits : 0} cards={cards}/>
    </>
  );
}
