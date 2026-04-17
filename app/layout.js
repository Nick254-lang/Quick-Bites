import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'MyRestaurant',
  description: 'Order your favorite meals anytime',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
