export default function HomeControlBar({ isLogged, credits, pagination, changePage }) {

    // API call to /user/buyCredits
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

    // renders the pagination controller that splits the album into pages of 10 cards each
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
        <div className="bg-dark fixed-bottom d-flex flex-wrap align-items-center justify-content-center p-3 mb-0">
            
            <div className="flex align-items-center col-md-3 mb-2 mb-md-0 text-white text-decoration-none">
                <button className="btn btn-primary">{credits} credits</button>
            </div>

            <div className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <div className="btn-group">{renderPaginationController()}</div>
            </div>

            <div className="col-md-3 text-end">
                <button type="button" className="btn btn-warning" onClick={async() => {await buyCredits()}}>Buy Credits</button>
            </div>
            

        </div>
    )
}