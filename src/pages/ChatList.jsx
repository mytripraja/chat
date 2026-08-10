import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listenToChats } from '../lib/chats'
import { getUserProfile } from '../lib/users'
import ChatListItem from '../components/ChatListItem'

export default function ChatList({ currentUser }) {
  const [chats, setChats] = useState([])
  const [profiles, setProfiles] = useState({}) // uid -> profile, cached

  useEffect(() => {
    const unsub = listenToChats(currentUser.uid, setChats)
    return unsub
  }, [currentUser.uid])

  // Fetch profiles for the "other" participant in each chat, only for ones we haven't seen yet
  useEffect(() => {
    const missing = chats
      .map((c) => c.participants.find((p) => p !== currentUser.uid))
      .filter((uid) => uid && !profiles[uid])

    if (missing.length === 0) return

    Promise.all(missing.map((uid) => getUserProfile(uid))).then((results) => {
      setProfiles((prev) => {
        const next = { ...prev }
        results.forEach((p) => {
          if (p) next[p.uid] = p
        })
        return next
      })
    })
  }, [chats, currentUser.uid, profiles])

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-semibold">Chats</h1>
        <Link
          to="/new"
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium"
        >
          New chat
        </Link>
      </header>

      {chats.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          No conversations yet — start one with "New chat"
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const otherUid = chat.participants.find((p) => p !== currentUser.uid)
            return (
              <ChatListItem
                key={chat.id}
                chat={chat}
                otherUser={profiles[otherUid]}
                isOwnLastMessage={chat.lastMessageSenderId === currentUser.uid}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
