import { nanoid } from 'nanoid'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Layout from './Layout'
import AvatarStack from './components/AvatarStack'
import Home from './home'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Layout />}>
        <Route path="/avatar-stack" element={<AvatarStack />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
