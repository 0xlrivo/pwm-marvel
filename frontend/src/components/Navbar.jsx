import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="bg-dark fixed-top d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-0 border-bottom">
      <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-white text-decoration-none">
        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"></use></svg>
        AFSE
      </a>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li><Link href="/" className="nav-link px-2 text-white">HOME</Link></li>
        <li><Link href="/packets" className="nav-link px-2 text-white">PACKETS</Link></li>
        <li><Link href="/trade" className="nav-link px-2 text-white">TRADE</Link></li>
        <li><Link href="/profile" className="nav-link px-2 text-white">PROFILE</Link></li>
      </ul>

      <div className="col-md-3 text-end">
        <button type="button" className="btn btn-outline-primary me-2">Login</button>
        <button type="button" className="btn btn-primary">Sign-up</button>
      </div>
    </div>
  )
}
