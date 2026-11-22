import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
export const metadata: Metadata = { title: 'SlotSync — Resource management, in sync', description: 'One seamless platform to discover, reserve and manage spaces, equipment and experiences.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-theme="dark"><head><script dangerouslySetInnerHTML={{ __html: `try { const saved = localStorage.getItem('slotsync-theme'); const preferred = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; document.documentElement.dataset.theme = saved || preferred; } catch (_) {}` }} /></head><body><ThemeProvider>{children}</ThemeProvider></body></html>; }
