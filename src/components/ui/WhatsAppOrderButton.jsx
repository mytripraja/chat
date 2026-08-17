import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../hooks/useSettings';

export default function WhatsAppOrderButton({ orderDetails }) {
  const { settings } = useSettings();
  const phone = settings?.whatsapp?.phoneNumber || '919360940229';

  const message = encodeURIComponent(
    `🛒 *New Order - JAA FOODS*\n\n` +
    `Order ID: ${orderDetails.orderId || 'Pending'}\n` +
    `Customer: ${orderDetails.name}\n` +
    `Phone: ${orderDetails.phone}\n` +
    `Address: ${orderDetails.address}\n` +
    `City: ${orderDetails.city}\n\n` +
    `*Items:*\n${orderDetails.items?.map(i => `${i.name} x${i.quantity} = ₹${i.total}`).join('\n')}\n\n` +
    `Subtotal: ₹${orderDetails.subtotal}\n` +
    `Shipping: ₹${orderDetails.shipping}\n` +
    `*Total: ₹${orderDetails.total}*\n\n` +
    `Payment: ${orderDetails.paymentMethod}\n` +
    (orderDetails.note ? `Note: ${orderDetails.note}\n` : '')
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 hover:shadow-lg transition-all"
    >
      <FaWhatsapp className="w-5 h-5" />
      Send Order via WhatsApp
    </a>
  );
}
