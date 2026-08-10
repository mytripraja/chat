import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'
import { ref, onValue, off, set as rtdbSet } from 'firebase/database'
import { db, rtdb } from '../lib/firebase'
import { listenToMessages, sendMessage, markMessageRead } from '../lib/chat'
import { getUserProfile } from '../lib/users'
import MessageBubble from '../components/MessageBubble'
import CallModal from '../components/CallModal'

const IconPhone = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const IconVideo = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
)

export default function ChatThread({ currentUser }) {
  const { chatId } = useParams()
  const [messages, setMessages] = useState([])
  const [otherUid, setOtherUid] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [online, setOnline] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const [text, setText] = useState('')
  const [outgoingCall, setOutgoingCall] = useState(null)
  const [incomingCall, setIncomingCall] = useState(null)
  const bottomRef = useRef(null)
  const typingTimerRef = useRef(null)

  // Load the chat doc and the other participant's profile.
  useEffect(() => {
    let cancelled = false
    async function loadChat() {
      const chatSnap = await getDoc(doc(db, 'chats', chatId))
      if (!chatSnap.exists() || cancelled) return
      const uid = chatSnap.data().participants.find((p) => p !== currentUser.uid)
      setOtherUid(uid)
      const profile = await getUserProfile(uid)
      if (!cancelled) setOtherUser(profile)
    }
    loadChat()
    return () => { cancelled = true }
  }, [chatId, currentUser.uid])

  // Presence from Realtime Database.
  useEffect(() => {
    if (!otherUid) return
    const statusRef = ref(rtdb, `status/${otherUid}`)
    const unsub = onValue(statusRef, (snap) => {
      const val = snap.val()
      setOnline(!!val && val.state === 'online')
    })
    return () => off(statusRef, 'value')
  }, [otherUid])

  // Their typing indicator from Realtime Database.
  useEffect(() => {
    if (!otherUid) return
    const typingRef = ref(rtdb, `typing/${chatId}/${otherUid}`)
    const unsub = onValue(typingRef, (snap) => setOtherTyping(!!snap.val()))
    return () => off(typingRef, 'value')
  }, [chatId, otherUid])

  // Clear our typing flag when leaving the thread.
  useEffect(() => () => {
    clearTimeout(typingTimerRef.current)
    rtdbSet(ref(rtdb, `typing/${chatId}/${currentUser.uid}`), false).catch(() => {})
  }, [chatId, currentUser.uid])

  // Real-time message subscription.
  useEffect(() => {
    const unsub = listenToMessages(chatId, setMessages)
    return unsub
  }, [chatId])

  // Auto-scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark incoming unread messages as read.
  useEffect(() => {
    messages
      .filter((m) => m.senderId !== currentUser.uid && m.status !== 'read')
      .forEach((m) => markMessageRead(chatId, m.id))
  }, [messages, chatId, currentUser.uid])

  // Incoming call detection for this thread.
  useEffect(() => {
    const callsRef = collection(db, 'calls')
    const q = query(
      callsRef,
      where('calleeId', '==', currentUser.uid),
      where('chatId', '==', chatId)
    )
    const unsub = onSnapshot(q, (snap) => {
      snap.docs.forEach((d) => {
        const data = d.data()
        if (data.status === 'ringing' && data.callerId !== currentUser.uid) {
          setIncomingCall((prev) => prev ?? { id: d.id, ...data })
        }
      })
    })
    return unsub
  }, [currentUser.uid, chatId])

  function handleChange(e) {
    setText(e.target.value)
    rtdbSet(ref(rtdb, `typing/${chatId}/${currentUser.uid}`), true).catch(() => {})
    clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      rtdbSet(ref(rtdb, `typing/${chatId}/${currentUser.uid}`), false).catch(() => {})
    }, 1000)
  }

  async function handleSend(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    rtdbSet(ref(rtdb, `typing/${chatId}/${currentUser.uid}`), false).catch(() => {})
    clearTimeout(typingTimerRef.current)
    setText('')
    await sendMessage(chatId, currentUser.uid, trimmed)
  }

  function handleStartCall(type) {
    if (!otherUser) return
    setOutgoingCall({ type, chatId })
  }

  const statusLine = otherTyping ? 'typing…' : online ? 'online' : 'offline'

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <Link to="/" className="text-blue-600 text-sm font-medium shrink-0">
          Back
        </Link>
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shrink-0">
          {(otherUser?.displayName || '?').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-semibold text-gray-900 truncate">
            {otherUser?.displayName || '…'}
          </h1>
          <p className={`text-xs ${otherTyping ? 'text-blue-600' : online ? 'text-green-600' : 'text-gray-400'}`}>
            {statusLine}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleStartCall('voice')}
          aria-label="Voice call"
          disabled={!otherUser}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40"
        >
          <IconPhone />
        </button>
        <button
          type="button"
          onClick={() => handleStartCall('video')}
          aria-label="Video call"
          disabled={!otherUser}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40"
        >
          <IconVideo />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isOwn={m.senderId === currentUser.uid} />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
        <input
          value={text}
          onChange={handleChange}
          placeholder="Message"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          Send
        </button>
      </form>

      {outgoingCall && (
        <CallModal
          mode="outgoing"
          type={outgoingCall.type}
          chatId={outgoingCall.chatId}
          peerUser={otherUser}
          currentUserUid={currentUser.uid}
          onClose={() => setOutgoingCall(null)}
        />
      )}
      {incomingCall && (
        <CallModal
          mode="incoming"
          call={incomingCall}
          peerUser={otherUser}
          currentUserUid={currentUser.uid}
          onClose={() => setIncomingCall(null)}
        />
      )}
    </div>
  )
}
