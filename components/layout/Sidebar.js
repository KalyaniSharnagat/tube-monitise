'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Video,
  Coins,
   Receipt,             
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const menuItems = [
  { id: 'users', label: 'User Management', icon: Users, path: '/dashboard/users' },
  { id: 'videos', label: 'Video Management', icon: Video, path: '/dashboard/videomange' },
  { id: 'coins', label: 'Coin Management', icon: Coins, path: '/dashboard/coin' },
  { id: 'transactions', label: 'Transaction', icon: Receipt, path: '/dashboard/transaction' },
  { id: 'contacts', label: 'Query List', icon: HelpCircle, path: '/dashboard/contact' },
];


export function Sidebar({ activeSection, setActiveSection, isCollapsed }) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get current path

  return (
    <div
      className={`hidden md:flex h-[100dvh] sticky top-0 bg-white dark:bg-gray-800 border-r border-border shadow-lg flex-col transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="px-0 py-2">
        <div className="w-full flex justify-center">
          <img
            src="/logo-removebg.png"
            alt="Logo"
            className={`${isCollapsed ? 'w-10 h-10' : 'w-48 h-20'} object-contain drop-shadow`}
          />
        </div>
      </div>
      <Separator />

      <ScrollArea className={`flex-1 ${isCollapsed ? 'px-1' : 'px-4'}`}>
        <div className="space-y-2 mb-6 pt-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path; // ✅ Check active tab

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-12 ${
                  isActive ? 'bg-red-600 text-white hover:bg-red-700' : ''
                } ${isCollapsed ? 'px-2' : ''}`}
                onClick={() => router.push(item.path)}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-3'} ${isActive ? 'text-white' : ''}`} />
                {!isCollapsed && item.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className={`p-2 md:p-4 border-t border-border`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            document.cookie = 'auth=; Path=/; Max-Age=0; SameSite=Lax';
            router.push('/login');
          }}
        >
          <Button type="submit" variant="ghost" className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}>
            <LogOut className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
            {!isCollapsed && 'Log out'}
          </Button>
        </form>
      </div>
    </div>
  );
}
