import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { findUserByEmail } from '../lib/users'
import { ensureChat } from '../lib/chat'

export default function NewChat({ currentUser }) {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Safely get user ID for Appwrite ($id) or fallback to Firebase (uid) just in case
  const currentUserId = currentUser.$id || currentUser.uid

  async function handleSearch(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    setLoading(true)
    try {
      const user = await findUserByEmail(trimmed)
      if (!user) {
        setError('No MyTripRaja user found with that email')
        return
      }
      
      const targetUserId = user.$id || user.uid
      if (targetUserId === currentUserId) {
        setError("That's your own account — enter someone else's email")
        return
      }
      setResult(user)
    } catch {
      setError('Something went wrong — try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleStartChat() {
    if (!result) return
    setLoading(true)
    try {
      const targetUserId = result.$id || result.uid
      const chatId = await ensureChat(currentUserId, targetUserId)
      navigate(`/chat/${chatId}`)
    } catch {
      setError('Could not start chat — try again')
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <Link to="/" className="text-blue-600 text-sm font-medium">
          Back
        </Link>
        <h1 className="text-lg font-semibold">New chat</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 mb-6">
          <label className="text-sm text-gray-600">
            Find a MyTripRaja user by email to start a chat
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="someone@example.com"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Looking up…' : 'Search'}
          </button>
        </form>

        {result && (
          <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shrink-0">
              {(result.displayName || result.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">
                {result.displayName || result.name || 'Unknown user'}
              </p>
              <p className="text-sm text-gray-500 truncate">{result.email}</p>
            </div>
            <button
              type="button"
              onClick={handleStartChat}
              disabled={loading}
              className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shrink-0"
            >
              {loading ? 'Starting…' : 'Start chat'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}