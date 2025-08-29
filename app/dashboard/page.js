'use client';

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";

import { CoinManagement } from "./coin/CoinManagement";
import { VideoManagement } from "./videomange/VideoManagement";
import { ContactManagement } from "./contact/ContactManagement";
import { TransactionManagement } from "./transaction/TransactionManagement";
import {Notification} from "./notificationmange/Notification"; 
import { UserManagement } from "./users/UserManagement";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API/data load OR route load
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  // if (loading) {
  //   return <Loader text="Loading page..." />; 
  // }

  return (
    <Layout>
      <UserManagement />
      <CoinManagement />
      <VideoManagement />
      <ContactManagement />
      <TransactionManagement />
      <Notification />
    </Layout>
  );
}
