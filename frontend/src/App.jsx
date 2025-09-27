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

       <Route path='/notification' element={isAuthenticated && isOnboarded ? (
        <Layout showSidebar = {true}>
          <Notification/>
        </Layout>
       ) :(
        <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
       ) }/>

       <Route path='/call/:id' element={isAuthenticated && isOnboarded ? (
        <CallPage/>
       ) : (
        <Navigate to={!isAuthenticated ? '/login' : '/onboaeding'}/>
       )}/>

       <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? (
        <Layout showSidebar={false}>
         <ChatPage/>
        </Layout>
       ):(
         <Navigate to={!isAuthenticated ? '/login' : '/onboarding'}/>
       )}/>
       
       <Route path='/onboarding' element={isAuthenticated ? (!isOnboarded ? (<OnboardingPage/>) : (<Navigate to="/"/>)):(<Navigate to='/login'/>)}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
