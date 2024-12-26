import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ isLogged,  user, setUser, pagination, setPagination }) {

    return (
        <div>
            <header>
                <Navbar isLogged={isLogged}/>
            </header>
            <main style={{marginTop: '73px'}} className="container-fluid">
                <Outlet context={[isLogged, user, setUser, pagination, setPagination]}/>
            </main>
        </div>
    )
}