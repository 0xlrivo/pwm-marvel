export default function HomeControlBar({ isLogged, credits, pagination, changePage }) {

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
            console.log("credits added")
        }
    }

    const renderPaginationController = () => {
        let res = []
        for (let i = 0; i < pagination.numPages; i++) {
            if (i == pagination.curPage) {
                res.push(
                    <button type="button" className="btn btn-primary" onClick={() => changePage(i)}>{i + 1}</button>
                )
            } else {
                res.push(
                    <button className="btn btn-secondary" onClick={() => changePage(i)}>{i + 1}</button>
                )
            }
        }
        return res
    }

    return (
        <div className="navbar navbar-expand navbar-dark bg-dark fixed-bottom d-flex flex-wrap align-items-center justify-content-center">
            <p className="text-bold text-white">{credits}</p>

            <div className="bnt-group">
                {renderPaginationController()}
            </div>

            <button type="button" className="btn btn-warning" onClick={buyCredits}>Buy Credits</button>

        </div>
    )
}