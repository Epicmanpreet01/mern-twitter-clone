import { Routes, Route } from 'react-router-dom'
import LogInPage from './pages/auth/logIn/logInPage.jsx'
import SignUpPage from './pages/auth/signUp/SignUpPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import SideBar from './components/common/SideBar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'

function App() {

  return (
    <div className='flex mx-auto max-w-6xl'>
      <SideBar />
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/SignUp' element={<SignUpPage />}/>
        <Route path='/LogIn' element={<LogInPage />}/>
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:userName' element={<ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  )
}

export default App
