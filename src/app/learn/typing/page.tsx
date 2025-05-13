
import { TypingModule } from '@/components/typing/typing-module';
import type { Metadata } from 'next';
import { APP_NAME, MODULE_DATA } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${MODULE_DATA.typing.name} - ${APP_NAME}`,
  description: `${MODULE_DATA.typing.description}`,
};

export default function TypingPage() {
  return <TypingModule />;
}
