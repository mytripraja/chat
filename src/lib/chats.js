import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

// Requires a composite index (Firestore will prompt you with a one-click link
// in the browser console the first time this query runs — click it to create it).
export function listenToChats(uid, callback) {
  const chatsRef = collection(db, 'chats')
  const q = query(
    chatsRef,
    where('participants', 'array-contains', uid),
    orderBy('lastMessageTime', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(chats)
  })
}
