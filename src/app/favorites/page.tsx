import AppLayout from '@/components/AppLayout';
import FavoritesClient from './components/FavoritesClient';

export const metadata = { title: 'Favorites & Notes — BibleStudy' };

export default function FavoritesPage() {
  return (
    <AppLayout>
      <FavoritesClient />
    </AppLayout>
  );
}
