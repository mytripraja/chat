import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore'
import { db } from './firebase'

// Adjust the field name/collection here if your existing MyTripRaja `users` collection
// uses different field names — this assumes `email` and `displayName` fields exist.
export async function findUserByEmail(email) {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('email', '==', email.trim().toLowerCase()), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { uid: d.id, ...d.data() }
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() }
}
