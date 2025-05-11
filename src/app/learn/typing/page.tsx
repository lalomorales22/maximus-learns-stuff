import { TypingModule } from '@/components/typing/typing-module';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Typing Titans - ${APP_NAME}`,
  description: 'Practice your typing skills and become a keyboard master!',
};

export default function TypingPage() {
  return <TypingModule />;
}
