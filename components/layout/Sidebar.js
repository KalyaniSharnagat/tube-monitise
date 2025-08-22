'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Video,
  Coins,
  CreditCard,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const menuItems = [
  { id: 'users', label: 'User Management', icon: Users, path: '/dashboard/users' },
  { id: 'videos', label: 'Video Management', icon: Video, path: '/dashboard/videomange' },
  { id: 'coins', label: 'Coin Management', icon: Coins, path: '/dashboard/coin' },
  { id: 'transactions', label: 'Transaction', icon: CreditCard, path: '/dashboard/transaction' },
  { id: 'contacts', label: 'Contact', icon: MessageSquare, path: '/dashboard/contact' },
];

export function Sidebar({ activeSection, setActiveSection }) {
  const router = useRouter();

  return (
    <div className=" w-56 h-screen bg-white dark:bg-gray-800 border-r border-border shadow-lg flex flex-col">
      <div className="px-0 py-1">
        <div className="w-full flex justify-center">
          <img 
            src="/logo-removebg.png" 
            alt="Logo" 
            className="w-48 h-24 object-contain drop-shadow" 
          />
        </div>
      </div>
      <Separator />

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 mb-6 pt-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const iconClass =
              (item.id === 'transactions' || item.id === 'contacts')
                ? 'w-5 h-5 mr-3 text-red-600'
                : 'w-5 h-5 mr-3';
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start h-12`}
                onClick={() => {
                  setActiveSection(item.id);
                  router.push(item.path); // ✅ page route open hoga
                }}
              >
                <Icon className={iconClass} />
                {item.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            document.cookie = 'auth=; Path=/; Max-Age=0; SameSite=Lax';
            router.push('/login'); // ✅ logout hone ke baad login page pe le jayega
          }}
        >
          <Button type="submit" variant="ghost" className="w-full justify-start">
            <LogOut className="w-5 h-5 mr-3" />
            Log out
          </Button>
        </form>
      </div>
    </div>
  );
}
