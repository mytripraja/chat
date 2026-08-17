import { useState, useEffect } from 'react';
import { listenToOrders } from '../lib/firestore';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToOrders(data => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const getOrdersByStatus = (status) => orders.filter(o => o.status === status);
  const getOrderById = (orderId) => orders.find(o => o.orderId === orderId);

  return { orders, loading, getOrdersByStatus, getOrderById };
}
