
import { DrawModule } from '@/components/draw/draw-module';
import type { Metadata } from 'next';
import { APP_NAME, MODULE_DATA } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${MODULE_DATA.draw.name} - ${APP_NAME}`,
  description: `${MODULE_DATA.draw.description}`,
};

export default function DrawPage() {
  return <DrawModule />;
}
