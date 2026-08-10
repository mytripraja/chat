import { Link } from 'react-router-dom'

export default function ChatListItem({ chat, otherUser, isOwnLastMessage }) {
  return (
    <Link
      to={`/chat/${chat.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
    >
      <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium shrink-0">
        {(otherUser?.displayName || '?').charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-gray-900 truncate">
            {otherUser?.displayName || 'Unknown user'}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">
          {isOwnLastMessage && 'You: '}
          {chat.lastMessage || 'Start the conversation'}
        </p>
      </div>
    </Link>
  )
}
