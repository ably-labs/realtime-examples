import ReactDOM from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import AvatarStack from './components/AvatarStack'
import Home from './home'
import EmojiReactions from './components/EmojiReactions/EmojiReactions'
import Claims from './components/Claims/Claims'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Layout />}>
        <Route path="/avatar-stack" element={<AvatarStack />} />
        <Route path="/emoji-reactions" element={<EmojiReactions />} />
        <Route path="/claims" element={<Claims />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
