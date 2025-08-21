'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Video,
  Users,
  Coins,
  CreditCard,
  MessageSquare,
  Settings,
  Shield,
  Bell,
  Play,
  LogOut,
} from 'lucide-react';

const menuItems = [
  // { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'videos', label: 'Video Management', icon: Video },
  { id: 'coins', label: 'Coin Management', icon: Coins },
  { id: 'transactions', label: 'Transaction Management', icon: CreditCard },
  { id: 'contacts', label: 'Contact Management', icon: MessageSquare },
];

const secondaryItems = [
  // { id: 'moderation', label: 'Content Moderation', icon: Shield },
  // { id: 'notifications', label: 'Notifications', icon: Bell },
  // { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="fixed inset-y-0 left-0 w-56 h-screen bg-white dark:bg-gray-800 border-r border-border shadow-lg flex flex-col">
      <div className="px-0 py-1">
        <div className="w-full">
          <img src="/logo-removebg.png" alt="Logo" className="w-full h-16 object-contain drop-shadow" />
        </div>
      </div>
      <Separator />

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 mb-6 pt-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const iconClass = (item.id === 'transactions' || item.id === 'contacts')
              ? 'w-5 h-5 mr-3 text-red-600'
              : 'w-5 h-5 mr-3';
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className={iconClass} />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2 pb-6 pt-2">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-12`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
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
            window.location.href = '/login';
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