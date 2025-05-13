
import type { LucideIcon } from 'lucide-react';
import { Calculator, BookOpenText, Keyboard, HomeIcon as Home, Palette, ShieldQuestion, Gem, Code2, Heart } from 'lucide-react';
import type { StaticImageData } from 'next/image';

// Import images from src/app/learn/images
import mathImage from '@/app/learn/images/math.png';
import readingImage from '@/app/learn/images/reading.png';
import typingImage from '@/app/learn/images/typing.png';
import createImage from '@/app/learn/images/create.png'; // Assuming create.pny was a typo for create.png
import codingImage from '@/app/learn/images/coding.png';
import kindnessImage from '@/app/learn/images/kindness.png';


export const APP_NAME = "MAXIMUS";

export type ModuleInfo = {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
  dataAiHint: string;
  themeColor: string; // Tailwind bg color class
  imageSrc: StaticImageData; // Changed from string to StaticImageData
};

// Using Gem or ShieldQuestion as placeholders if specific Fortnite icons are not available
export const NAVIGATION_ITEMS = [
  { name: 'Home Base', path: '/', icon: Home },
  { name: 'Math Mission', path: '/learn/math', icon: Calculator },
  { name: 'Reading Quest', path: '/learn/reading', icon: BookOpenText },
  { name: 'Typing Drill', path: '/learn/typing', icon: Keyboard },
  { name: 'Creative Mode', path: '/learn/draw', icon: Palette },
  { name: 'Coding Combat', path: '/learn/coding', icon: Code2 },
  { name: 'Kindness Arena', path: '/learn/being-nice', icon: Heart },
];

export const MODULE_DATA: { [key: string]: ModuleInfo } = {
  math: {
    name: 'Math Mission',
    path: '/learn/math',
    icon: Calculator,
    description: 'Solve math challenges and earn V-Bucks!',
    dataAiHint: 'math blaster game', // Fortnite theme
    themeColor: 'bg-primary',
    imageSrc: mathImage,
  },
  reading: {
    name: 'Reading Quest',
    path: '/learn/reading',
    icon: BookOpenText,
    description: 'Explore lore and complete reading quests for V-Bucks!',
    dataAiHint: 'treasure map quest', // Fortnite theme
    themeColor: 'bg-accent',
    imageSrc: readingImage,
  },
  typing: {
    name: 'Typing Drill',
    path: '/learn/typing',
    icon: Keyboard,
    description: 'Master the keyboard in typing drills to win V-Bucks!',
    dataAiHint: 'typing race game', // Fortnite theme
    themeColor: 'bg-secondary',
    imageSrc: typingImage,
  },
  draw: {
    name: 'Creative Mode',
    path: '/learn/draw',
    icon: Palette,
    description: 'Unleash your inner artist and design for V-Bucks!',
    dataAiHint: 'digital art canvas', // Fortnite theme
    themeColor: 'bg-pink-500',
    imageSrc: createImage, 
  },
  coding: {
    name: 'Coding Combat',
    path: '/learn/coding',
    icon: Code2,
    description: 'Learn coding basics with drag & drop blocks and earn V-Bucks!',
    dataAiHint: 'code blocks game', // Fortnite theme
    themeColor: 'bg-green-500',
    imageSrc: codingImage,
  },
  beingNice: {
    name: 'Kindness Arena',
    path: '/learn/being-nice',
    icon: Heart,
    description: 'Make kind choices in scenarios and spread positivity for V-Bucks!',
    dataAiHint: 'friendship puzzle game', // Fortnite theme
    themeColor: 'bg-yellow-500',
    imageSrc: kindnessImage,
  },
};

export const ALL_MODULES: ModuleInfo[] = Object.values(MODULE_DATA);

// V-Bucks related constants
export const VBUCKS_ICON = Gem;
export const VBUCKS_PER_TIER = 100;
export const CURRENCY_NAME = "V-Bucks";
export const LEVEL_NAME_SINGULAR = "Tier";
export const LEVEL_NAME_PLURAL = "Tiers";
