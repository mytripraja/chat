import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToChats } from '../lib/chats';
import ChatListItem from '../components/ChatListItem';

export default function ChatList({ user }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;

    const userId = user.$id || user.uid;
    const unsubscribe = listenToChats(userId, (updatedChats) => {
      setChats(updatedChats);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Messages</h1>
        <button
          onClick={() => navigate('/new')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + New Chat
        </button>
      </header>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-800">
        {chats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.$id || chat.id}
              chat={chat}
              currentUserId={user?.$id || user?.uid}
              onClick={() => navigate(`/chat/${chat.$id || chat.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}