import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import ShopPage from './pages/ShopPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import TradePage from './pages/TradePage.jsx'

function App() {

	// @note user data e cards STATE vanno qui, dato che sono globali per tutta l'applicazione
	// in questo modo, posso caricare le cards una volta sola dal backend, e riusarle sia per album sia per trades
	// ovviamente, quando apro un pacchetto / fillo un ordine le cards verranno cambiate (@todo vedere qui come fare a ricaricare lo stato)

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout/>}>
					<Route index element={<Home/>}/>
					<Route path='profile' element={<Profile/>}/>
					<Route path='shop' element={<ShopPage/>}/>
					<Route path='trade' element={<TradePage/>}/>
					<Route path='login' element={<LoginPage/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
