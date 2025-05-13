
import { ReadingModule } from '@/components/reading/reading-module';
import type { Metadata } from 'next';
import { APP_NAME, MODULE_DATA } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${MODULE_DATA.reading.name} - ${APP_NAME}`,
  description: `${MODULE_DATA.reading.description}`,
};

export default function ReadingPage() {
  return <ReadingModule />;
}
