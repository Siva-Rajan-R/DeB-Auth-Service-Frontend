import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HomePage } from './Pages/Home'
import { Route, Routes } from 'react-router-dom'
import { AuthDocs } from './Pages/Docs'
import { DashboardPage } from './Pages/Dashboard'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/auth-docs' element={<AuthDocs/>}></Route>
        <Route path='/dashboard' element={<DashboardPage/>}></Route>
      </Routes>
    </>
  )
}

export default App
