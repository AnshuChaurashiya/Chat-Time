import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Aountication/LoginPage'
import RegisterPage from './pages/Aountication/RegisterPage'
import Home from './pages/Home/Home'
import Profile from './pages/Profile'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from './context/AuthContext'

function App() {
  const {authUser} = useContext(AuthContext)

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/register' element={!authUser ? <RegisterPage /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to='/login' />} />
      </Routes>
    </>
  )
}

export default App