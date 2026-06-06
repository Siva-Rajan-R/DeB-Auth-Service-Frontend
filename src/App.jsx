import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HomePage } from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import { AuthDocs } from './Pages/Docs'
import { DashboardPage } from './Pages/Dashboard'
import { DashboardDetail } from './Pages/DashboardDetail'
import { LoginPortal } from './Pages/LoginPortal'
import { ResetPassword } from './Pages/ResetPassword'
import { DashboardLayout } from './Components/DashboardLayout'
import { ToastContainer } from './Components/ToastContainer'

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/auth/request/:request_id/:flow_type' element={<LoginPortal/>}></Route>
        <Route path='/auth/reset-password/:token' element={<ResetPassword/>}></Route>
        
        {/* Dashboard Routes wrapped in DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path='/auth-docs' element={<AuthDocs/>}></Route>
          <Route path='/dashboard' element={<DashboardPage/>}></Route>
          <Route path='/dashboard-detail' element={<DashboardDetail/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
