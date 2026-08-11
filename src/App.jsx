import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser, loginAnonymously } from './lib/users';
import ChatList from './pages/ChatList';
import ChatThread from './pages/ChatThread';
import NewChat from './pages/NewChat';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing Appwrite session or initiate guest login
    getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        } else {
          return loginAnonymously().then((newUser) => {
            setUser(newUser);
            setLoading(false);
          });
        }
      })
      .catch((err) => {
        console.error('Auth initialization error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Connecting to Chat...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={user ? <ChatList user={user} /> : <Navigate to="/" />} />
          <Route path="/chat/:chatId" element={<ChatThread user={user} />} />
          <Route path="/new" element={<NewChat user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;