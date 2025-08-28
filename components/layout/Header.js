'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { io } from "socket.io-client";
import { communication } from "@/services/communication";
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, LogOut, User } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function Header({ activeSection, onToggleSidebar, isCollapsed }) {
  const router = useRouter();

  const [notificationCount, setNotificationCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userDetails] = useState({
    name: "Admin User",
    email: "admin@tubemonities.com",
    role: " Admin",
    createdAt: "2024-08-15T10:30:00Z"
  });

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
    <>
      {/* 🔹 Header */}
      <header className="h-10 md:h-12 sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-border shadow-sm">
        <div className="flex items-center justify-between gap-2 h-full px-3 md:px-6">
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle sidebar"
              onClick={onToggleSidebar}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-border"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              {activeSection === "users" && "User Management"}
              {activeSection === "videos" && "Video Management"}
              {activeSection === "coins" && "Coin Management"}
              {activeSection === "transactions" && "Transaction Management"}
              {activeSection === "contacts" && "Query Management"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard/notificationmange">
              <Button variant="ghost" size="icon" className="relative pt-2">
                <Bell className="w-5 h-5 " />
                <Badge className="absolute top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Badge>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-51" align="end" forceMount>
                <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />               
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        document.cookie = 'auth=; Path=/; Max-Age=0; SameSite=Lax';
                        router.push('/login');
                      }}
                    >
                      <Button type="submit" variant="ghost" className={`w-4 h-4 ml-2 ${isCollapsed ? 'px-2' : ''}`}>
                        {!isCollapsed && 'Log out'}
                      </Button>
                    </form>               
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>


     {/* 🔹 Profile Modal */}
<Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
  <DialogContent className="max-w-md rounded-2xl shadow-xl border border-gray-200 p-0 overflow-hidden">
    {/* Top banner */}
    <div className="relative h-28 bg-gradient-to-r from-[rgb(49,186,140)] via-[rgb(49,186,140)] to-[rgb(233,77,89)]">
      {/* gloss overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.15),transparent_40%)]" />
      {/* close */}
      <button
        onClick={() => setProfileModalOpen(false)}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Admin flair */}
      {String(userDetails?.role || '').toLowerCase() === 'admin' && (
        <div className="absolute left-0 top-0 rounded-br-2xl bg-[rgb(233,77,89)]/90 px-3 py-1 text-xs font-semibold text-white">
          ADMIN
        </div>
      )}
    </div>

    {/* Card body */}
    <div className="-mt-10 px-6 pb-6">
      {/* Avatar */}
      <div className="flex justify-center">
        <div className="rounded-full ring-4 ring-white shadow-lg">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white">
            {userDetails?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userDetails.avatarUrl}
                alt={userDetails.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[rgb(49,186,140)] bg-[rgb(49,186,140)]/10">
                {(userDetails?.name || 'U')
                  .split(' ')
                  .map((s) => s[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name + email */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{userDetails?.name}</h3>
        <div className="mt-1 inline-flex items-center gap-2">
          <span className="text-xs text-gray-500">{userDetails?.email}</span>
        </div>

        {/* Role */}
        <div className="mt-3 flex items-center justify-center">
          <span
            className={[
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium capitalize',
              String(userDetails?.role || '').toLowerCase() === 'admin'
                ? 'bg-[rgb(233,77,89)]/10 text-[rgb(233,77,89)] ring-1 ring-[rgb(233,77,89)]/30'
                : 'bg-[rgb(49,186,140)]/10 text-[rgb(49,186,140)] ring-1 ring-[rgb(49,186,140)]/30',
            ].join(' ')}
          >
            {userDetails?.role}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Name</p>
          <p className="truncate text-sm font-medium text-gray-900">{userDetails?.name}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Email</p>
          <p className="truncate text-sm font-medium text-gray-900">{userDetails?.email}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Role</p>
          <p className="truncate text-sm font-medium text-gray-900 capitalize">{userDetails?.role}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Created At</p>
          <p className="text-sm font-medium text-gray-900">
            {userDetails?.createdAt
              ? new Date(userDetails.createdAt).toLocaleDateString()
              : '-'}
          </p>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="mt-6 flex justify-end">
        <Button
          className="bg-[rgb(49,186,140)] hover:bg-[rgb(49,186,140)]/90 text-white"
          onClick={() => setProfileModalOpen(false)}
        >
          Close
        </Button>
      </div> */}
    </div>
  </DialogContent>
</Dialog>



    </>
  );
}
