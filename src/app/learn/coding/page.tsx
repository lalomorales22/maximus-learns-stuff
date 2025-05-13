
import { CodingModule } from '@/components/coding/coding-module';
import type { Metadata } from 'next';
import { APP_NAME, MODULE_DATA } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${MODULE_DATA.coding.name} - ${APP_NAME}`,
  description: `${MODULE_DATA.coding.description}`,
};

export default function CodingPage() {
  return <CodingModule />;
}
