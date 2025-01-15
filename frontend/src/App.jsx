import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
import ShopPage from './pages/ShopPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import TradePage from './pages/TradePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ErrorToast from './components/ErrorToast.jsx'

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

	// Error State
	const [error, setError] = useState({
		show: false,
		title: '',
		msg: ''
	})

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={
						<Layout
							isLogged={isLogged}
							user={user}
							setUser={setUser}
							pagination={pagination}
							setPagination={setPagination}
							setError={setError}
						/>
					}>
						<Route index element={<Home />} />
						<Route path='profile' element={<ProfilePage />} />
						<Route path='shop' element={<ShopPage />} />
						<Route path='trade' element={<TradePage />} />
						<Route path='login' element={<LoginPage />} />
						<Route path='register' element={<RegisterPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
			<ErrorToast error={error} setError={setError}/>
		</>
	)
}