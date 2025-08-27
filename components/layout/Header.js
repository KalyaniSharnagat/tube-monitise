'use client';
import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { io } from "socket.io-client";
import { communication } from "@/services/communication";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, User, LogOut, Settings } from 'lucide-react';  

export function Header({ activeSection }) {
  const getSectionTitle = () => {
    switch (activeSection) {
      // case 'User Management': return 'User Management';
      case 'users': return 'User Management';
      case 'videos': return 'Video Management';
      case 'coins': return 'Coin Management';
      case 'transactions': return 'Transaction Management';
      case 'contacts': return 'Contact Management';
      // default: return 'User Management';
    }
  };

    const showPagination = activeSection !== 'dashboard';
    
  const [notificationCount, setNotificationCount] = useState(0);
  const [socket, setSocket] = useState(null);

    const fetchNotificationCount = async () => {
      try {
        const res = await communication.getNotificationCount();
        if (res?.data?.status === "SUCCESS") {
          setNotificationCount(res.data.notification || 0);
        } else {
          setNotificationCount(0);
        }
      } catch (err) {
        console.error("Error fetching notification count:", err);
        setNotificationCount(0);
      }
    };

    useEffect(() => {
    const socketConnection = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("notificationCount", () => {
        fetchNotificationCount(); 
      });
    }
  }, [socket]);

  useEffect(() => {
    fetchNotificationCount(); 
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <h2 className="text-xl font-semibold text-foreground">{getSectionTitle()}</h2>

        <div className="flex items-center space-x-4">
          <Link href="/dashboard/notificationmange">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500">
         {notificationCount > 99 ? "99+" : notificationCount}
        </Badge>
      </Button>
    </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@tubemonities.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}