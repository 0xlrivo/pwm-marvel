export default function HomeControlBar({ isLogged, credits }) {
    return (
        <div className="navbar navbar-expand navbar-dark bg-dark fixed-bottom d-flex flex-wrap align-items-center justify-content-center">
            <p className="text-bold text-white">{credits}</p>
            <button type="button" className="btn btn-warning">Buy Credits</button>
        </div>
    )
}