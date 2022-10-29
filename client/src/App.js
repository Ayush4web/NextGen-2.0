import './App.css'
import './Responsive.css'
import Dashboard from './components/Dashboard'
import Feedback from './components/Feedback'
import Notfound from './components/Notfound'
import Footer from './components/Footer'

import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useGlobalContext } from './context'
import Landing from './pages/Landing'
import Home from './pages/Home'


function App() {
  const {loadModels} = useGlobalContext()

  useEffect(() => {
    loadModels()
  }, [])
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/home' element={<Home />} />
   
          <Route path='/dash' element={<Dashboard />} />
          {/* <Route path='/feedback' element={[<Navbar />, <Feedback />]} /> */}
          <Route path='*' element={<Notfound />} />
        </Routes>
        {/* <Footer></Footer> */}
      </BrowserRouter>
    </>
  )
}

export default App
