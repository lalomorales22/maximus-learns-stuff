
import { BeingNiceModule } from '@/components/being-nice/being-nice-module';
import type { Metadata } from 'next';
import { APP_NAME, MODULE_DATA } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${MODULE_DATA.beingNice.name} - ${APP_NAME}`,
  description: `${MODULE_DATA.beingNice.description}`,
};

export default function BeingNicePage() {
  return <BeingNiceModule />;
}
