import { configureAbly } from '@ably-labs/react-hooks'
import { nanoid } from 'nanoid'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import AvatarStack from './components/AvatarStack'

configureAbly({ key: import.meta.env.VITE_ABLY_KEY, clientId: nanoid() })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/avatar-stack" element={<AvatarStack />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
