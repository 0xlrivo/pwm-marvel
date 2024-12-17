import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {

    const [isLogged, setIsLogged] = localStorage.getItem('auth-token') ? useState(true) : useState(false)

    return (
        <>
            <header>
                <Navbar/>
            </header>
            <main style={{marginTop: '73px'}} className="container-fluid">
                <Outlet context={[isLogged]}/>
            </main>
        </>
    )
}