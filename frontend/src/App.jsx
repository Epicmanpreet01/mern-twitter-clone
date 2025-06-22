import { Routes, Route, Navigate } from 'react-router-dom'
import LogInPage from './pages/auth/logIn/LogInPage.jsx'
import SignUpPage from './pages/auth/signUp/SignUpPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import SideBar from './components/common/SideBar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
import useAuthUser from './hooks/queries/useAuthUser.js'

function App() {
  const { data:authUser, isLoading  } = useAuthUser()

  if(isLoading) {
    return <div className='h-screen flex justify-center items-center'><LoadingSpinner className="size-lg" /></div>
  }

  return (
    <div className='flex mx-auto max-w-6xl'>
      {authUser && <SideBar />}
      <Routes>
        <Route path='/' element={authUser? <HomePage /> : <Navigate to={'/LogIn'} /> }/>
        <Route path='/SignUp' element={!authUser? <SignUpPage />: <Navigate to={'/'} /> }/>
        <Route path='/LogIn' element={!authUser? <LogInPage />: <Navigate to={'/'} />}/>
        <Route path='/notifications' element={authUser? <NotificationPage /> : <Navigate to={'/LogIn'} />} />
        <Route path='/profile/:userName' element={authUser? <ProfilePage /> : <Navigate to={'/LogIn'} />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            zIndex: 9999
          }
        }}
      />
    </div>
  )
}

export default App
