
import { MathModule } from '@/components/math/math-module';
import type { Metadata } from 'next';
import { APP_NAME, MODULE_DATA } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${MODULE_DATA.math.name} - ${APP_NAME}`,
  description: `${MODULE_DATA.math.description}`,
};

export default function MathPage() {
  return <MathModule />;
}
