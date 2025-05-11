import { ReadingModule } from '@/components/reading/reading-module';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Reading Realm - ${APP_NAME}`,
  description: 'Explore exciting stories and improve your reading comprehension!',
};

export default function ReadingPage() {
  return <ReadingModule />;
}
