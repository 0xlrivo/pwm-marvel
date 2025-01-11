import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
import ShopPage from './pages/ShopPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import TradePage from './pages/TradePage.jsx'
import { useState } from 'react'
import ProfilePage from './pages/ProfilePage.jsx'
import RegiisterPage from './pages/RegisterPage.jsx'

export default function App() {
	
	// GLOBAL APPLICATION STATE (that all pages share)
	
	// weather or not the user is logged
	const [isLogged, setIsLogged] = useState(localStorage.getItem('auth-token') ? true : false)

	// User data
	const [user, setUser] = useState({})

	// Album cards and display settings
	const [pagination, setPagination] = useState({
		curPage: 0,
		numPages: 1,
		cards: []
	})

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={
						<Layout
							isLogged={isLogged}
							user={user}
							setUser={setUser}
							pagination={pagination}
							setPagination={setPagination}
						/>
					}>
					<Route index element={<Home/>}/>
					<Route path='profile' element={<ProfilePage/>}/>
					<Route path='shop' element={<ShopPage/>}/>
					<Route path='trade' element={<TradePage/>}/>
					<Route path='login' element={<LoginPage/>}/>
					<Route path='register' element={<RegiisterPage/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}