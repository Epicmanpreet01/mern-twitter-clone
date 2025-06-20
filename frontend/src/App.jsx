import { Routes, Route } from 'react-router-dom'
import LogInPage from './pages/auth/logIn/logInPage.jsx'
import SignUpPage from './pages/auth/signUp/SignUpPage.jsx'
import HomePage from './pages/home/HomePage.jsx'

function App() {

  return (
    <div className='flex mx-auto max-w-6xl'>
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/SignUp' element={<SignUpPage />}/>
        <Route path='/LogIn' element={<LogInPage />}/>
      </Routes>
    </div>
  )
}

export default App
