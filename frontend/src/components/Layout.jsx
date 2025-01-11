import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import "../App.css"

export default function Layout({
  isLogged,
  user,
  setUser,
  pagination,
  setPagination,
}) {

  const parseJwt = () => {
    const jwt = localStorage.getItem("auth-token");
    if (!jwt) return null;
    const payload = atob(jwt.split(".")[1]);
    return JSON.parse(payload);
  };

  const fetchAlbumCards = async (albumId) => {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }
    const resp = await fetch(`http://localhost:3000/api/album/getAlbumCardsData/${albumId}`, options)
    if (resp.ok) {
      const content = await resp.json()
      setPagination({
        curPage: 0,
        numPages: Math.ceil(content.length / 10),
        cards: content ? content : []
      })
    }
  }

  // calls the backend API to fetch data from the currently logged user
  const fetchUserData = async (id) => {
    if (user.id) return;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };
    const resp = await fetch(
      "http://localhost:3000/api/user/getUserById/" + id,
      options
    );
    if (resp.ok) {
      const content = await resp.json();
      setUser(content);
    }
  };

  useEffect(() => {
    const jwt = parseJwt();
    if (!jwt) return;
    fetchUserData(jwt.id);
    fetchAlbumCards(jwt.albumId);
  }, []);

  return (
    <div className="comics-bg">
      <header>
        <Navbar isLogged={isLogged} />
      </header>
      <main className="layout-main container-fluid">
        <Outlet
          context={[isLogged, user, setUser, pagination, setPagination]}
        />
      </main>
    </div>
  );
}
