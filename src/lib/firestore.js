import {
  collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const SETTINGS_COL = 'settings';
const USERS_COL = 'users';
const AUDIT_COL = 'audit_log';
const COMPLAINTS_COL = 'complaints';

export async function getAllProducts() {
  const snap = await getDocs(collection(db, PRODUCTS_COL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function listenToProducts(callback) {
  return onSnapshot(collection(db, PRODUCTS_COL), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function getProduct(id) {
  const docRef = doc(db, PRODUCTS_COL, id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addProduct(product) {
  const docRef = doc(collection(db, PRODUCTS_COL));
  await setDoc(docRef, { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
}

export async function updateProduct(id, data) {
  const docRef = doc(db, PRODUCTS_COL, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

export async function getAllOrders(filters = {}) {
  let q = collection(db, ORDERS_COL);
  const constraints = [];
  if (filters.status) constraints.push(where('status', '==', filters.status));
  constraints.push(orderBy('createdAt', 'desc'));
  q = query(q, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function listenToOrders(callback) {
  const q = query(collection(db, ORDERS_COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function getOrder(id) {
  const docRef = doc(db, ORDERS_COL, id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getOrderById(orderId) {
  const q = query(collection(db, ORDERS_COL), where('orderId', '==', orderId));
  const snap = await getDocs(q);
  return snap.docs.length > 0 ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null;
}

export async function placeOrder(order) {
  const docRef = doc(collection(db, ORDERS_COL));
  const orderId = 'JAA' + Date.now().toString(36).toUpperCase();
  await setDoc(docRef, {
    ...order,
    orderId,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return orderId;
}

export async function updateOrderStatus(id, status, note = '') {
  const docRef = doc(db, ORDERS_COL, id);
  const update = { status, updatedAt: serverTimestamp() };
  if (note) update.statusNote = note;
  await updateDoc(docRef, update);
}

export async function updateOrder(id, data) {
  const docRef = doc(db, ORDERS_COL, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteOrder(id) {
  await deleteDoc(doc(db, ORDERS_COL, id));
}

export async function getSettings() {
  const docRef = doc(db, SETTINGS_COL, 'main');
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

export async function updateSettings(data) {
  const docRef = doc(db, SETTINGS_COL, 'main');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export function listenToSettings(callback) {
  const docRef = doc(db, SETTINGS_COL, 'main');
  return onSnapshot(docRef, snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

export async function saveAdminUser(uid, data) {
  const docRef = doc(db, USERS_COL, uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export async function getAdminUser(uid) {
  const docRef = doc(db, USERS_COL, uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, USERS_COL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function listenToUsers(callback) {
  return onSnapshot(collection(db, USERS_COL), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function addAuditLog(entry) {
  const docRef = doc(collection(db, AUDIT_COL));
  await setDoc(docRef, { ...entry, timestamp: serverTimestamp() });
}

export function listenToAuditLog(callback) {
  const q = query(collection(db, AUDIT_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function addComplaint(complaint) {
  const docRef = doc(collection(db, COMPLAINTS_COL));
  await setDoc(docRef, { ...complaint, status: 'open', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
}

export async function getAllComplaints() {
  const snap = await getDocs(collection(db, COMPLAINTS_COL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function listenToComplaints(callback) {
  return onSnapshot(collection(db, COMPLAINTS_COL), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function updateComplaint(id, data) {
  const docRef = doc(db, COMPLAINTS_COL, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}
