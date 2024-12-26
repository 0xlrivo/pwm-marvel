export default function HomeControlBar({ isLogged, credits, pagination, changePage }) {

    const buyCredits = async () => {
        // API call
        console.log("hi")
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