import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import OpenPacket from './components/OpenPacket.jsx'
import Trade from './components/Trade.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout/>}>
					<Route index element={<Home/>}/>
					<Route path='profile' element={<Profile/>}/>
					<Route path='packets' element={<OpenPacket/>}/>
					<Route path='trade' element={<Trade/>}/>
					<Route path='login' element={<LoginPage/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
