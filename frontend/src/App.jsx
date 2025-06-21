import { Routes, Route } from 'react-router-dom'
import LogInPage from './pages/auth/logIn/logInPage.jsx'
import SignUpPage from './pages/auth/signUp/SignUpPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import SideBar from './components/common/SideBar.jsx'
import RightPanel from './components/common/RightPanel.jsx'

function App() {

  return (
    <div className='flex mx-auto max-w-6xl'>
      <SideBar />
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/SignUp' element={<SignUpPage />}/>
        <Route path='/LogIn' element={<LogInPage />}/>
      </Routes>
      <RightPanel />
    </div>
  )
}

export default App
