
import type { LucideIcon } from 'lucide-react';
import { Calculator, BookOpenText, Keyboard, HomeIcon as Home, Palette, ShieldQuestion, Gem } from 'lucide-react'; // Added Gem for V-Bucks style

export const APP_NAME = "MAXIMUS"; // Changed from "Maximus Learns"

export type ModuleInfo = {
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
  dataAiHint: string;
  themeColor: string; // Tailwind bg color class
};

// Using Gem or ShieldQuestion as placeholders if specific Fortnite icons are not available
export const NAVIGATION_ITEMS = [
  { name: 'Home Base', path: '/', icon: Home },
  { name: 'Math Mission', path: '/learn/math', icon: Calculator },
  { name: 'Reading Quest', path: '/learn/reading', icon: BookOpenText },
  { name: 'Typing Drill', path: '/learn/typing', icon: Keyboard },
  { name: 'Creative Mode', path: '/learn/draw', icon: Palette },
];

export const MODULE_DATA: { [key: string]: ModuleInfo } = {
  math: {
    name: 'Math Mission',
    path: '/learn/math',
    icon: Calculator,
    description: 'Solve math challenges and earn V-Bucks!',
    dataAiHint: 'epic math battle', // Fortnite theme
    themeColor: 'bg-primary',
  },
  reading: {
    name: 'Reading Quest',
    path: '/learn/reading',
    icon: BookOpenText,
    description: 'Explore lore and complete reading quests for V-Bucks!',
    dataAiHint: 'adventure map scroll', // Fortnite theme
    themeColor: 'bg-accent',
  },
  typing: {
    name: 'Typing Drill',
    path: '/learn/typing',
    icon: Keyboard,
    description: 'Master the keyboard in typing drills to win V-Bucks!',
    dataAiHint: 'gaming keyboard fast', // Fortnite theme
    themeColor: 'bg-secondary',
  },
  draw: {
    name: 'Creative Mode',
    path: '/learn/draw',
    icon: Palette,
    description: 'Unleash your inner artist and design for V-Bucks!',
    dataAiHint: 'graffiti art colorful', // Fortnite theme
    themeColor: 'bg-pink-500', // Keep pink or change to another Fortnite color
  },
};

export const ALL_MODULES: ModuleInfo[] = Object.values(MODULE_DATA);

// V-Bucks related constants
export const VBUCKS_ICON = Gem; // Using Gem icon for V-Bucks
export const VBUCKS_PER_TIER = 100; // Renamed from XP_PER_LEVEL
export const CURRENCY_NAME = "V-Bucks";
export const LEVEL_NAME_SINGULAR = "Tier";
export const LEVEL_NAME_PLURAL = "Tiers";
