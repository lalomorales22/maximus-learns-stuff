import { MathModule } from '@/components/math/math-module';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Math Adventures - ${APP_NAME}`,
  description: 'Practice math problems and improve your skills!',
};

export default function MathPage() {
  return <MathModule />;
}
