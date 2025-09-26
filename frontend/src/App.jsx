import React from 'react'
import HomePage from './pages/HomePage'
import SignUp from './pages/SignUpPage'
import Login from './pages/LoginPage'
import Notification from './pages/NotificationPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'
import {Navigate, Route, Routes } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  //tanstack query 
  const {isLoading,authUser} = useAuthUser();

  const { theme } = useThemeStore()
  
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded
  
  if(isLoading) return <PageLoader/>

  return (
    <div className=' h-screen' data-theme = {theme}>
      <Routes>
       <Route path='/' element={isAuthenticated && isOnboarded ? (<Layout showSidebar = {true}>
        <HomePage/>
       </Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>)}/>
       <Route path='/login' element={!isAuthenticated?<Login/>:<Navigate to={isOnboarded ? "/" : "/onboarding"}/>}/>
       <Route path='/signup' element={!isAuthenticated?<SignUp/>: <Navigate to={isOnboarded ? "/" : "/onboarding"}/>}/>
       <Route path='/notification' element={isAuthenticated?<Notification/>: <Navigate to="/login"/>}/>
       <Route path='/call' element={isAuthenticated?<CallPage/>: <Navigate to="/login"/>}/>
       <Route path='/chat' element={isAuthenticated?<ChatPage/>: <Navigate to="/login"/>}/>
       <Route path='/onboarding' element={isAuthenticated ? (!isOnboarded ? (<OnboardingPage/>) : (<Navigate to="/"/>)):(<Navigate to='/login'/>)}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
