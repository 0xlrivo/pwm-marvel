import { useOutletContext } from "react-router-dom";
import AlbumViewer from "./AlbumViewer";
import HomeControlBar from "./HomeControlBar";

export default function Home() {

    const parseJwt = () => {
        const jwt = localStorage.getItem("auth-token");
        if (!jwt) return null;
        const payload = atob(jwt.split(".")[1]);
        return JSON.parse(payload);
      };

    const changeCurPage = (c) => {
        const p = pagination;
        setPagination({
            curPage: c,
            numPages: p.numPages,
            cards: p.cards
        })
    }

    // STATE
    const [isLogged, user, setUser, pagination, setPagination] = useOutletContext()

    return (
        <div>
            {
                isLogged
                    ? <>
                        <h1>Album of {user ? user.username : ""}</h1>

                        <AlbumViewer
                            albumId={parseJwt().albumId}
                            pagination={pagination}
                        />

                        <HomeControlBar
                            isLogged={isLogged}
                            credits={user ? user.credits : 0}
                            pagination={pagination}
                            changePage={changeCurPage}
                        />
                    </>
                    : <h1>Login first to view your album</h1>
            }

        </div>
    )
}