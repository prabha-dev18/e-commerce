import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Contact us', description: 'Talk to the Lumière team on WhatsApp, phone or email, or send us a message.', alternates: { canonical: '/contact' } };
const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
const info = [[Phone, 'Phone', '+91 99999 99999', 'tel:+919999999999'], [Mail, 'Email', 'care@lumiere.in', 'mailto:care@lumiere.in'], [MessageCircle, 'WhatsApp', 'Chat with us', `https://wa.me/${wa}`], [MapPin, 'Address', '12 Ashram Road, Ahmedabad 380009', null], [Clock, 'Hours', 'Every day, 9am to 9pm', null]];

export default function Contact() {
  return (
    <div className="container-x py-12">
      <h1 className="text-3xl sm:text-5xl">Contact us</h1>
      <span className="mt-4 mb-8 block h-px w-14 bg-accent" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8"><h2 className="mb-5 text-2xl">Send a message</h2><ContactForm /></div>
        <div className="space-y-6">
          <ul className="space-y-4">{info.map(([Icon, l, v, href]) => (
            <li key={l} className="flex items-start gap-4"><span className="rounded-full bg-secondary p-3 text-accent"><Icon size={18} /></span><span><span className="block text-xs uppercase tracking-wide">{l}</span>{href ? <a href={href} className="text-primary hover:text-accent">{v}</a> : <span className="text-primary">{v}</span>}</span></li>
          ))}</ul>
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <iframe title="Map showing our Ahmedabad office" loading="lazy" referrerPolicy="no-referrer" className="h-72 w-full border-0" src="https://www.openstreetmap.org/export/embed.html?bbox=72.5560%2C23.0300%2C72.5760%2C23.0490&layer=mapnik&marker=23.0395%2C72.5660" />
          </div>
        </div>
      </div>
    </div>
  );
}
