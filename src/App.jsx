import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { auth } from './lib/firebase'
import AuthModal from './components/AuthModal'
import ChatList from './pages/ChatList'
import NewChat from './pages/NewChat'
import ChatThread from './pages/ChatThread'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <AuthModal />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatList currentUser={user} />} />
        <Route path="/new" element={<NewChat currentUser={user} />} />
        <Route path="/chat/:chatId" element={<ChatThread currentUser={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
