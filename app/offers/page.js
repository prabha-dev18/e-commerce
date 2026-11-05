import { redirect } from 'next/navigation';
export const metadata = { title: 'Offers' };
export default function Offers() { redirect('/shop?discount=20&sort=price-asc'); }
