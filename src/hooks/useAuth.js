import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getAdminUser } from '../lib/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const data = await getAdminUser(firebaseUser.uid);
        setAdminData(data);
      } else {
        setAdminData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const isAdmin = adminData?.role === 'admin' || adminData?.role === 'super_admin' || adminData?.role === 'ultra_admin';
  const isSuperAdmin = adminData?.role === 'super_admin' || adminData?.role === 'ultra_admin';
  const isUltraAdmin = adminData?.role === 'ultra_admin';
  const isViewer = adminData?.role === 'viewer';

  return { user, adminData, loading, login, logout, isAdmin, isSuperAdmin, isUltraAdmin, isViewer };
}
