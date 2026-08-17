import { FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton({ phone = '919360940229' }) {
  return (
    <>
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 hover:scale-110 transition-all animate-bounce"
        aria-label="WhatsApp"
      >
        <FaWhatsapp className="w-7 h-7" />
      </a>
      <a
        href={`tel:+${phone}`}
        className="fixed bottom-6 left-6 z-50 bg-brand-orange text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-orange/80 hover:scale-110 transition-all"
        aria-label="Call Us"
      >
        <FiPhone className="w-6 h-6" />
      </a>
    </>
  );
}
