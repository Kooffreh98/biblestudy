import AppLayout from '@/components/AppLayout';
import HighlightsClient from './components/HighlightsClient';

export const metadata = { title: 'Highlights — BibleStudy' };

export default function HighlightsPage() {
  return (
    <AppLayout>
      <HighlightsClient />
    </AppLayout>
  );
}
