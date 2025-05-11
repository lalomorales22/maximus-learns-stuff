import { DrawModule } from '@/components/draw/draw-module';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Drawing Pad - ${APP_NAME}`,
  description: 'Unleash your creativity and draw colorful masterpieces!',
};

export default function DrawPage() {
  return <DrawModule />;
}
