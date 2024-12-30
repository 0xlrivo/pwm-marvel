import { Link } from "react-router-dom";

export default function Navbar({ isLogged }) {
  
  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    window.location.href = "http://localhost:5173/";
  };

  return (
    <div className="bg-dark fixed-top d-flex flex-wrap align-items-center justify-content-center p-3 mb-3">
      <a
        href="/"
        className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-white text-bold text-decoration-none"
      >
        <svg
          className="bi me-2"
          width="40"
          height="32"
          role="img"
          aria-label="Bootstrap"
        >
          <use xlinkHref="#bootstrap"></use>
        </svg>
        AFSE
      </a>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <Link to="/" className="nav-link px-2 text-warning">
            HOME
          </Link>
        </li>
        <li>
          <Link to="/shop" className="nav-link px-2 text-warning">
            SHOP
          </Link>
        </li>
        <li>
          <Link to="/trade" className="nav-link px-2 text-warning">
            TRADE
          </Link>
        </li>
        <li>
          <Link to="/profile" className="nav-link px-2 text-warning">
            PROFILE
          </Link>
        </li>
      </ul>

      <div className="col-md-3 text-end">
        {isLogged ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <span>
            <button type="button" className="btn btn-warning">
              Sign-up
            </button>
            <button type="button" className="btn btn-primary">
              <Link to="/login">Login</Link>
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
