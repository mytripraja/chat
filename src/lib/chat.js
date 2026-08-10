import {
  doc, setDoc, getDoc, collection, addDoc, query, orderBy,
  onSnapshot, serverTimestamp, updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// Deterministic chat id so two users always land on the same chat doc,
// matching the security rule that enforces this exact format.
export function getChatId(uidA, uidB) {
  return [uidA, uidB].sort().join('_')
}

export async function ensureChat(uidA, uidB) {
  const chatId = getChatId(uidA, uidB)
  const chatRef = doc(db, 'chats', chatId)
  const snap = await getDoc(chatRef)
  if (!snap.exists()) {
    await setDoc(chatRef, {
      participants: [uidA, uidB].sort(),
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      lastMessageSenderId: '',
      createdAt: serverTimestamp(),
    })
  }
  return chatId
}

export async function sendMessage(chatId, senderId, text) {
  const messagesRef = collection(db, 'chats', chatId, 'messages')
  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp(),
    status: 'sent',
  })
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
    lastMessageSenderId: senderId,
  })
}

// Subscribes to messages in real time. Call the returned function to unsubscribe.
export function listenToMessages(chatId, callback) {
  const messagesRef = collection(db, 'chats', chatId, 'messages')
  const q = query(messagesRef, orderBy('timestamp', 'asc'))
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(messages)
  })
}

export async function markMessageRead(chatId, messageId) {
  await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
    status: 'read',
  })
}
