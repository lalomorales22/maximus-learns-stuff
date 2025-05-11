import type { LucideIcon } from 'lucide-react';
import { Calculator, BookOpenText, Keyboard, HomeIcon as Home } from 'lucide-react';

export const APP_NAME = "Maximus Learns";

export type ModuleInfo = {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
  dataAiHint: string;
  themeColor: string; // Tailwind bg color class
};

export const NAVIGATION_ITEMS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Math', path: '/learn/math', icon: Calculator },
  { name: 'Reading', path: '/learn/reading', icon: BookOpenText },
  { name: 'Typing', path: '/learn/typing', icon: Keyboard },
];

export const MODULE_DATA: { [key: string]: ModuleInfo } = {
  math: {
    name: 'Math Adventures',
    path: '/learn/math',
    icon: Calculator,
    description: 'Solve fun math problems and become a number wizard!',
    dataAiHint: 'math blackboard',
    themeColor: 'bg-primary', // Blue
  },
  reading: {
    name: 'Reading Realm',
    path: '/learn/reading',
    icon: BookOpenText,
    description: 'Explore exciting stories and improve your reading skills!',
    dataAiHint: 'open book',
    themeColor: 'bg-accent', // Red
  },
  typing: {
    name: 'Typing Titans',
    path: '/learn/typing',
    icon: Keyboard,
    description: 'Master the keyboard with engaging typing challenges!',
    dataAiHint: 'colorful keyboard',
    themeColor: 'bg-secondary', // Yellow
  },
};

export const ALL_MODULES: ModuleInfo[] = Object.values(MODULE_DATA);
